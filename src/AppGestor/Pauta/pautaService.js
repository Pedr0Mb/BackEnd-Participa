import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { getNextId } from '../../utils/getNextId.js'
import { atualizarDescricoes } from '../../utils/atualizarDescricoes.js'

function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}

const pautaRef = db.collection('Pauta')
const descricaoRef = db.collection('Descricao')

export async function pesquisarPauta(data) {
  let query = pautaRef.select('titulo','status','inicioVotacao','fimVotacao','imagem','foto','tema')

  if(data.titulo) query = query.where('titulo','==',data.titulo)
  if(data.status) query = query.where('status','==',data.status)

  const resultado = await query.orderBy('inicioVotacao','asc').get()
  if(resultado.empty) return []

  return resultado.docs.map(doc => {
    const d = doc.data();
    return {
      id: Number(doc.id),
      titulo: d.titulo,
      status: d.status,
      imagem: d.imagem,
      inicioVotacao: formatarData(d.inicioVotacao),
      fimVotacao: formatarData(d.fimVotacao)
    };
  });
}

export async function visualizarPauta(idPauta) {
  const doc = await pautaRef.doc(String(idPauta)).get();
  if (!doc.exists)
    throw Object.assign(new Error('Pauta não encontrada'), { status: 404 });

  const data = doc.data();
  const agora = new Date();

  if (data.status === 'aberta' && agora > data.fimVotacao.toDate()) {
    await pautaRef.doc(String(idPauta)).update({ status: 'finalizada' });
    data.status = 'finalizada';
  }

  const descricoesSnapshot = await descricaoRef
    .where('tipo', '==', 'Pauta')
    .where('idItem', '==', Number(idPauta))
    .get();

  const descricoes = descricoesSnapshot.docs.map(descDoc => {
    const descData = descDoc.data();
    return {
      id: Number(descDoc.id),
      titulo: descData.titulo,
      info: descData.info,
      criadoEm: formatarData(descData.criadoEm),
      atualizadoEm: formatarData(descData.atualizadoEm)
    };
  });

  return {
    id: Number(doc.id),
    ...data,
    inicioVotacao: formatarData(data.inicioVotacao),
    fimVotacao: formatarData(data.fimVotacao),
    criadoEm: formatarData(data.criadoEm),
    atualizadoEm: formatarData(data.atualizadoEm),
    descricoes
  };
}

export async function criarPauta(data) {
  const nextId = await getNextId('Pauta');

  await pautaRef.doc(String(nextId)).set({
    id: nextId,
    titulo: data.titulo,
    opcoes: (data.opcoes).map((o, i) => ({ id: i + 1, ...o, qtVotos: 0 })),
    inicioVotacao: data.inicioVotacao,
    fimVotacao: data.fimVotacao,
    imagem: data.imagem ,
    status: 'rascunho',
    tema: data.tema,
    criadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (data.descricao != null) {
    await atualizarDescricoes({
      descricoes: data.descricao,
      tipoAtividade: 'Pauta',
      idItem: nextId,
    });
  }

  await registrarAtividade({
    tipo: 'Pauta',
    descricao: 'Você criou uma pauta',
    acao: 'Pauta criada',
    idUsuario: data.idCriador, 
    idAtividade: nextId,
  });
}

export async function editarPauta(data) {
  const doc = await pautaRef.doc(String(data.id)).get();

  if (!doc.exists) 
    throw Object.assign(new Error('Pauta não encontrada'), { status: 404 });

  if (doc.data().status !== 'rascunho') 
    throw Object.assign(new Error('Pauta publicada não pode ser editada encontrada'), { status: 400 });

  await pautaRef.doc(String(data.id)).update({
    titulo: data.titulo,
    descricao: data.descricao,
    opcoes: data.opcoes?.map((o, i) => ({ id: i + 1, ...o, qtVotos: 0 })),
    inicioVotacao: data.inicioVotacao,
    fimVotacao: data.fimVotacao,
    imagem: data.imagem,
    tema: data.tema,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (data.descricao != null) {
    await atualizarDescricoes({
      descricoes: data.descricao,
      tipoAtividade: 'Pauta',
      idItem: data.id,
    });
  }

  await registrarAtividade({
    tipo: 'Pauta',
    descricao: 'Você editou uma pauta',
    acao: 'Pauta editada',
    idUsuario: data.idCriador,
    idAtividade: data.id,
  });
}

export async function publicarPauta(data) {
  const doc = await pautaRef.doc(String(data.idPauta)).get()
  if(!doc.exists)
    throw Object.assign(new Error('Pauta não encontrada'), { status: 404 });

  if(doc.data().status !== 'rascunho')
    throw Object.assign(new Error('Pauta publicada não pde ser publicada'), { status: 400 });

  await pautaRef.doc(String(data.idPauta)).update({ status: 'aberta' })

  await registrarAtividade({
    tipo: 'Pauta',
    descricao: 'Você publicou uma pauta',
    acao: 'Pauta publicada',
    idUsuario: data.idCriador,
    idAtividade: data.idPauta
  })
}

export async function deletarPauta(data) {
  const doc = await pautaRef.doc(String(data.idPauta)).get()
  if(!doc.exists)
    throw Object.assign(new Error('Pauta não encontrada'), { status: 404 });

  await atualizarDescricoes({ descricoes: [], tipoAtividade: 'Pauta', idItem: data.idPauta })
  await pautaRef.doc(String(data.idPauta)).delete()

  await registrarAtividade({
    tipo: 'Pauta',
    descricao: 'Você excluiu uma pauta',
    acao: 'Pauta excluída',
    idUsuario: data.idCriador,
    idAtividade: data.idPauta
  })
}
