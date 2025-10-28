import { db, admin } from '../../plugins/bd.js';
import { registrarAtividade } from '../../utils/registroAtividade.js';
import { getNextId } from '../../utils/getNextId.js';

const noticiaRef = db.collection('Noticia');

function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}

// ======================== Pesquisar notícias ========================
export async function pesquisarNoticia(filters) {
  let query = noticiaRef
    .select('titulo', 'tema', 'imagem', 'fonte', 'resumo', 'linkExterno', 'criadoEm', 'publicadoEm', 'status');

  if (filters.titulo) query = query.where('titulo', '==', filters.titulo);
  if (filters.status) query = query.where('status', '==', filters.status);

  const resultado = await query.get();

  if (resultado.empty) return [];

  return resultado.docs.map(doc => {
      const data = doc.data();
      return {
        id: Number(doc.id),
        ...data,
        criadoEm: formatarData(data.criadoEm),
        publicadoEm: formatarData(data.publicadoEm),
      };
    });
}

// ======================== Visualizar notícia ========================
export async function visualizarNoticia(idNoticia) {
  const noticiaDoc = await noticiaRef.doc(String(idNoticia)).get();

  if (!noticiaDoc.exists) throw Object.assign(new Error('Notícia não encontrada'), { status: 404 });

  const data = noticiaDoc.data();
  return {
    id: Number(noticiaDoc.id),
    ...data,
    criadoEm: formatarData(data.criadoEm),
    publicadoEm: formatarData(data.publicadoEm),
  };
}

// ======================== Criar notícia ========================
export async function criarNoticia(data) {
  const idNumerico = await getNextId('Noticia');

  await noticiaRef.doc(String(idNumerico)).set({
    titulo: data.titulo,
    tema: data.tema,
    fonte: data.fonte,
    resumo: data.resumo,
    linkExterno: data.linkExterno,
    imagem: data.imagem,
    criadoPor: data.idUsuario,
    status: 'rascunho',
    publicadoEm: null,
    criadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  await registrarAtividade({
    tipo: 'Notícia',
    titulo: data.titulo,
    descricao: 'Você criou uma notícia',
    acao: 'Notícia criada',
    idUsuario: data.idUsuario,
    idAtividade: idNumerico,
  });
}

// ======================== Editar notícia ========================
export async function editarNoticia(data) {
  const noticiaDoc = await noticiaRef.doc(String(data.idNoticia)).get();

  if (!noticiaDoc.exists) throw Object.assign(new Error('Notícia não encontrada'), { status: 404 });
  if (noticiaDoc.data().status === 'publicado') throw Object.assign(new Error('Notícia publicada não pode ser editada'), { status: 409 });

  await noticiaRef.doc(String(data.idNoticia)).update({
    titulo: data.titulo,
    tema: data.tema,
    fonte: data.fonte,
    resumo: data.resumo,
    linkExterno: data.linkExterno,
    imagem: data.imagem,
  });

  await registrarAtividade({
    tipo: 'Notícia',
    titulo: data.titulo,
    descricao: 'Você editou a notícia',
    acao: 'Notícia editada',
    idUsuario: data.idUsuario,
    idAtividade: data.idNoticia,
  });
}

// ======================== Publicar notícia ========================
export async function publicarNoticia(data) {
  const noticiaDoc = await noticiaRef.doc(String(data.idNoticia)).get();

  if (!noticiaDoc.exists) throw Object.assign(new Error('Notícia não encontrada'), { status: 404 });

  await noticiaRef.doc(String(data.idNoticia)).update({
    status: 'publicado',
    publicadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  await registrarAtividade({
    tipo: 'Notícia',
    titulo: noticiaDoc.data().titulo,
    descricao: 'Você publicou a notícia',
    acao: 'Notícia publicada',
    idUsuario: data.idUsuario,
    idAtividade: data.idNoticia,
  });
}

// ======================== Deletar notícia ========================
export async function deletarNoticia(data) {
  const noticiaDoc = await noticiaRef.doc(String(data.idNoticia)).get();

  if (!noticiaDoc.exists) throw Object.assign(new Error('Notícia não encontrada'), { status: 404 });

  await noticiaRef.doc(String(data.idNoticia)).delete();

  await registrarAtividade({
    tipo: 'Notícia',
    titulo: noticiaDoc.data().titulo,
    descricao: 'Você excluiu uma notícia',
    acao: 'Notícia excluída',
    idUsuario: data.idUsuario,
    idAtividade: data.idNoticia,
  });
}
