import { db, admin } from '../../plugins/bd.js';
import { registrarAtividade } from '../../utils/registroAtividade.js';
import { getNextId } from '../../utils/getNextId.js';

const transmissaoRef = db.collection('Transmissao');

function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}

export async function pesquisarTransmissao(filters) {
  let query = transmissaoRef
    .select('idTransmissao', 'titulo', 'imagem', 'foto', 'tema', 'criadoEm','publicadoEm')

  if (filters.titulo) query = query.where('titulo', '==', filters.titulo);
  if (filters.status) query = query.where('status', '==', filters.status);

  const resultado = await query.get();
  if (resultado.empty) return [];

  return resultado.docs.map(doc => {
    const data = doc.data();
    return {
      idTransmissao: Number(doc.id),
      ...data,
      criadoEm: formatarData(data.criadoEm),
      publicadoEm: formatarData(data.publicadoEm)
    };
  });
}

export async function visualizarTransmissao(idTransmissao) {
  const docSnap = await transmissaoRef.doc(String(idTransmissao)).get();

  if (!docSnap.exists) 
    throw Object.assign(new Error('Transmissão não encontrada'), { status: 404 });

  const data = docSnap.data();
  return {
    idTransmissao: Number(docSnap.id),
    ...data,
    criadoEm: formatarData(data.criadoEm),
    publicadoEm: formatarData(data.publicadoEm),
  };
}

export async function criarTransmissao(data) {
  const idTransmissao = await getNextId('Transmissao');

  await transmissaoRef.doc(String(idTransmissao)).set({
    titulo: data.titulo,
    subtitulo: data.subtitulo,
    fonte: data.fonte,
    tema: data.tema,
    tempo: data.tempo,
    descricao: data.descricao,
    linkExterno: data.linkExterno,
    imagem: data.imagem, 
    foto: data.foto,     
    criadoPor: data.idUsuario,
    publicadoEm: null,
    status: 'rascunho',
    criadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  await registrarAtividade({
    tipo: 'Transmissão',
    titulo: data.titulo,
    descricao: 'Você criou uma transmissão',
    acao: 'Transmissão criada',
    idUsuario: data.idUsuario,
    idAtividade: idTransmissao,
  });
}

export async function editarTransmissao(data) {
  console.log(data)
  const docSnap = await transmissaoRef.doc(String(data.idTransmissao)).get();

  if (!docSnap.exists) 
    throw Object.assign(new Error('Transmissão não encontrada'), { status: 404 });

  if (docSnap.data().status == 'publicado') 
    throw Object.assign(new Error('Transmissão não pode ser editada'), { status: 404 });


  await transmissaoRef.doc(String(data.idTransmissao)).update({
    titulo: data.titulo,
    subtitulo: data.subtitulo,
    fonte: data.fonte,
    tema: data.tema,
    tempo: data.tempo,
    descricao: data.descricao,
    linkExterno: data.linkExterno,
    imagem: data.imagem,
    foto: data.foto,      
  });

  await registrarAtividade({
    tipo: 'Transmissão',
    titulo: data.titulo,
    descricao: 'Você editou uma transmissão',
    acao: 'Transmissão editada',
    idUsuario: data.idUsuario,
    idAtividade: data.idTransmissao,
  });
}

export async function publicarTransmissao(data) {
  const docSnap = await transmissaoRef.doc(String(data.idTransmissao)).get();

  if (!docSnap.exists || !docSnap.data().ativo) 
    throw Object.assign(new Error('Transmissão não encontrada'), { status: 404 });

  await transmissaoRef.doc(String(data.idTransmissao)).update({
    status: 'publicado',
    publicadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  await registrarAtividade({
    tipo: 'Transmissão',
    titulo: docSnap.data().titulo,
    descricao: 'Você publicou uma transmissão',
    acao: 'Transmissão publicada',
    idUsuario: data.idUsuario,
    idAtividade: data.idTransmissao,
  })
}

export async function deletarTransmissao(data) {
  const docSnap = await transmissaoRef.doc(String(data.idTransmissao)).get();

  if (!docSnap.exists) 
    throw Object.assign(new Error('Transmissão não encontrada'), { status: 404 });

  await transmissaoRef.doc(String(data.idTransmissao)).delete();

  await registrarAtividade({
    tipo: 'Transmissão',
    titulo: docSnap.data().titulo,
    descricao: 'Você excluiu uma transmissão',
    acao: 'Transmissão excluída',
    idUsuario: data.idUsuario,
    idAtividade: data.idTransmissao,
  });
}
