import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { getNextId } from '../../utils/getNextId.js'

const comentarioRef = db.collection('Comentario')
const debateRef = db.collection('Debate')
const usuarioRef = db.collection('Usuario')

export async function criarComentario(data) {
  const debateDoc = await debateRef.doc(String(data.idDebate)).get();
  if (!debateDoc.exists) 
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 });

  if (data.parentComentario) {
    const parentDoc = await comentarioRef.doc(String(data.parentComentario)).get();
    if (!parentDoc.exists) 
      throw Object.assign(new Error('Comentário pai não encontrado'), { status: 404 });

    if (parentDoc.data().idDebate !== data.idDebate) 
      throw Object.assign(new Error('Comentário  pai é de outro debate'), { status: 400 });
  }

  const novoId = await getNextId('Comentario');

  await comentarioRef.doc(String(novoId)).set({
    id: novoId,
    idDebate: data.idDebate,
    idUsuario: data.idUsuario,
    parentComentario: data.parentComentario || null,
    texto: data.texto,
    criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    atualizadoEm: null,
  });

  await debateRef.doc(String(data.idDebate)).update({
    qtComentario: admin.firestore.FieldValue.increment(1),
  });

  await registrarAtividade({
    tipo: 'Comentário',
    titulo: data.texto,
    descricao: `Você comentou na debate "${debateDoc.data().titulo}"`,
    acao: 'Comentário criado',
    idUsuario: data.idUsuario,
    idAtividade: novoId,
  });
}

export async function deletarComentario(data) {
  const comentarioDoc = await comentarioRef.doc(String(data.idComentario)).get();

  if (!comentarioDoc.exists) 
    throw Object.assign(new Error('Comentário não encontrado'), { status: 400 });

  const usuarioDoc = await usuarioRef.doc(String(data.idUsuario)).get();
  const usuario = usuarioDoc.data();

  if (comentarioDoc.data().idUsuario !== data.idUsuario && usuario.role === 'cidadao') 
    throw Object.assign(new Error('Voçê não tem permissão para remover esse debate'), { status: 403 });

  await comentarioRef.doc(String(data.idComentario)).delete();

  await debateRef.doc(String(comentarioDoc.data().idDebate)).update({
    qtComentario: admin.firestore.FieldValue.increment(-1),
  });

  await registrarAtividade({
    tipo: 'Comentario',
    titulo: comentarioDoc.data().texto,
    descricao: `Você deletou um comentário`,
    acao: 'Comentário removido',
    idUsuario: data.idUsuario,
    idAtividade: data.idComentario,
  });
}

export async function editarComentario(data) {
  const comentarioDoc = await comentarioRef.doc(String(data.idComentario)).get()

  if (!comentarioDoc.exists) 
    throw Object.assign(new Error('Comentário não encontrado'), { status: 404 });

  const usuarioDoc = await usuarioRef.doc(String(data.idUsuario)).get()
  const usuario = usuarioDoc.data()

  if (comentarioDoc.data().idUsuario !== data.idUsuario && usuario.role === 'cidadao') 
    throw Object.assign(new Error('Voçê não tem permissão para remover esse comentario'), { status: 403 });

  await comentarioRef.doc(String(data.idComentario)).update({
    texto: data.texto,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Comentario',
    titulo: data.texto,
    descricao: `Você editou um comentário`,
    acao: 'Comentário alterado',
    idUsuario: data.idUsuario,
    idAtividade: data.idComentario
  })
}