import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { getNextId } from '../../utils/getNextId.js'

function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}

const pautaRef = db.collection('Pauta') 
const descricaoRef = db.collection('Descricao')
const votoRef = db.collection('Voto')

export async function pesquisarPauta(data) {
  let query = pautaRef.select('titulo','status','inicioVotacao','fimVotacao','imagem','foto','tema')
  .where('status','==','aberta')

  if(data.titulo) query = query.where('titulo','==',data.titulo)

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
    throw Object.assign(new Error('Pauta não encontrado'), { status: 404 })
  
  const data = doc.data();
  const agora = new Date();
  
  if (data.status === 'aberta' && agora > data.fimVotacao.toDate()) {
    await pautaRef.doc(String(idPauta)).update({ status: 'encerrada' });
  }
  
  const descricoesSnapshot = await descricaoRef
  .where('tipoAtividade', '==', 'Pauta')
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

export async function registrarVoto(data) {
  const pautaDoc = await pautaRef.doc(String(data.idPauta)).get();

  if (!pautaDoc.exists)
    throw Object.assign(new Error('Pauta não encontrada'), { status: 404 });

  const votacao = pautaDoc.data();
  const agora = new Date();
  const inicio = votacao.inicioVotacao?.toDate ? votacao.inicioVotacao.toDate() : new Date(votacao.inicioVotacao);
  const fim = votacao.fimVotacao?.toDate ? votacao.fimVotacao.toDate() : new Date(votacao.fimVotacao);

  if (votacao.status !== 'aberta' || agora < inicio || agora > fim)
    throw Object.assign(new Error('Pauta não está aberta para votos'), { status: 401 });

  const votoExistente = await votoRef
    .where('idUsuario', '==', data.idUsuario)
    .where('idPauta', '==', data.idPauta)
    .limit(1)
    .get();

  if (!votoExistente.empty) 
    throw Object.assign(new Error('Você já votou nesta pauta'), { status: 400 });

  const novasOpcoes = votacao.opcoes.map(opcao =>
    opcao.id === data.idOpcao
      ? { ...opcao, qtVotos: opcao.qtVotos + 1 }
      : opcao
  );

  await pautaRef.doc(String(data.idPauta)).update({
    opcoes: novasOpcoes
  });

  const novoIdVoto = await getNextId('Voto');

  await votoRef.doc(String(novoIdVoto)).set({
    idUsuario: data.idUsuario,
    idPauta: data.idPauta,
    idOpcaoResposta: data.idOpcao,
    dataRegistro: admin.firestore.FieldValue.serverTimestamp()
  });

  await registrarAtividade({
    tipo: 'Voto',
    descricao: 'Você registrou seu voto',
    acao: 'Voto registrado',
    payload: `Opção votada id: ${data.idOpcao}`,
    idUsuario: data.idUsuario,
    idAtividade: novoIdVoto
  });
}
