import { atualizarDescricoes } from '../../utils/atualizarDescricoes.js';
import { db, admin } from '../../plugins/bd.js';
import { registrarAtividade } from '../../utils/registroAtividade.js';
import { obterDadosUsuario } from '../../utils/obterDadosUsuario.js';
import { obterCategoriaUsuario } from '../../utils/obterCategoriasUsuario.js';
import { getNextId } from '../../utils/getNextId.js';

const debateRef = db.collection('Debate');
const comentarioRef = db.collection('Comentario');
const descricaoRef = db.collection('Descricao');

function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}


export async function pesquisarDebate(data) {
  const categorias = await obterCategoriaUsuario(data.idUsuario);

  let query = debateRef
    .select('titulo', 'subtitulo', 'idAutor', 'imagem', 'criadoEm', 'fotoUrlAutor', 'nomeAutor', 'qtComentario', 'tema')
    .orderBy('criadoEm', 'desc');

  if (data.titulo) query = query.where('titulo', '==', data.titulo);
  if (data.idUsuario) query = query.where('idAutor', '==', data.idUsuario);

  const resultado = await query.get();
  if (resultado.empty) return [];

  const filtrado = resultado.docs.filter(doc => {
    const tema = doc.data().tema;
    return categorias.includes('todos') || categorias.includes(tema);
  });

  return filtrado.map(doc => {
    const debate = doc.data();
    return {
      id: doc.id,
      ...debate,
      criadoEm: formatarData(debate.criadoEm),
    };
  });
}


export async function visualizarDebate(idDebate) {
  const debateDoc = await debateRef.doc(String(idDebate)).get();
  if (!debateDoc.exists)
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 });

  const debateData = debateDoc.data();

  const comentariosQuery = await comentarioRef
    .where('idDebate', '==', idDebate)
    .get();

  const descricaoQuery = await descricaoRef
    .where('tipo', '==', 'Debate')
    .where('idItem', '==', idDebate)
    .get();

  return {
    id: debateDoc.id,
    ...debateData,
    criadoEm: formatarData(debateData.criadoEm),
    atualizadoEm: formatarData(debateData.atualizadoEm),
    comentarios: comentariosQuery.docs.map(doc => {
      const c = doc.data();
      return {
        id: doc.id,
        ...c,
        criadoEm: formatarData(c.criadoEm),
        atualizadoEm: formatarData(c.atualizadoEm),
      };
    }),
    descricoes: descricaoQuery.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        criadoEm: formatarData(d.criadoEm),
      };
    }),
  };
}

export async function criarDebate(data) {
  const idDebate = await getNextId('Debate');
  const { nome, fotoUrl } = await obterDadosUsuario(data.idAutor);

  await debateRef.doc(String(idDebate)).set({
    idAutor: data.idAutor,
    nomeAutor: nome,
    fotoUrlAutor: fotoUrl,
    titulo: data.titulo,
    subtitulo: data.subtitulo,
    imagem: data.imagem,
    tema: data.tema || null,
    criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    atualizadoEm: null,
    qtComentario: 0,
  });

  if (data.descricoes != null) {
    await atualizarDescricoes({
      descricoes: data.descricoes,
      tipoAtividade: 'Debate',
      idItem: idDebate,
    });
  }

  await registrarAtividade({
    tipo: 'Debate',
    titulo: data.titulo,
    descricao: `Você criou um novo Debate`,
    acao: 'Debate criada',
    idUsuario: data.idAutor,
    idAtividade: String(idDebate),
  });
}

export async function editarDebate(data) {
  const debateDoc = await debateRef.doc(String(data.idDebate)).get();
  if (!debateDoc.exists)
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 });

  const debateData = debateDoc.data();
  const { role } = await obterDadosUsuario(data.idUsuario);

  if (debateData.idAutor !== data.idUsuario && role === 'cidadao')
    throw Object.assign(new Error('Você não pode alterar esse Debate'), { status: 403 });

  await debateRef.doc(String(data.idDebate)).update({
    titulo: data.titulo,
    subtitulo: data.subtitulo,
    imagem: data.imagem,
    tema: data.tema || null,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (data.descricoes != null) {
    await atualizarDescricoes({
      descricoes: data.descricoes,
      tipoAtividade: 'Debate',
      idItem: String(data.idDebate),
    });
  }

  await registrarAtividade({
    tipo: 'Debate',
    titulo: data.titulo,
    descricao: `Você editou o Debate`,
    acao: 'Debate editada',
    idUsuario: data.idUsuario,
    idAtividade: String(data.idDebate),
  });
}

export async function deletarDebate(data) {
  const debateDoc = await debateRef.doc(String(data.idDebate)).get();
  if (!debateDoc.exists)
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 });

  const debateData = debateDoc.data();
  const { role } = await obterDadosUsuario(data.idUsuario);

  if (debateData.idAutor !== data.idUsuario && role === 'cidadao')
    throw Object.assign(new Error('Você não pode excluir esse Debate'), { status: 403 });

  await debateRef.doc(String(data.idDebate)).delete();
  await atualizarDescricoes([], 'Debate', String(data.idDebate));

  await registrarAtividade({
    tipo: 'Debate',
    titulo: debateData.titulo,
    descricao: `Você excluiu o Debate`,
    acao: 'Debate excluída',
    idUsuario: data.idUsuario,
    idAtividade: String(data.idDebate),
  });
}
