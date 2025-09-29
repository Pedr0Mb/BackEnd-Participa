import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'

const comentarioRef = db.collection('Comentario')
const pautaRef = db.collection('Pauta')
const usuarioRef = db.collection('Usuario')

export async function criarComentario(data) {
  const comentarioDoc = await comentarioRef.add({
    texto: data.texto,
    dataPublicacao: admin.firestore.FieldValue.serverTimestamp(),
    id_usuario: data.idUsuario,
    id_pauta: data.idPauta,
    isDeleted: false
  })

    await pautaRef.doc(data.idPauta).update({
      qtComentario: admin.firestore.FieldValue.increment(1)
    })
  
  await registrarAtividade({
    tipo: 'Comentário',
    titulo: data.texto,
    descricao: `Você comentou em uma pauta`,
    acao: 'Comentário criado',
    payload: null,
    idUsuario: data.idUsuario,
    idAtividade: comentarioDoc.id,
  })

  return { message: 'Comentário criado com sucesso'}
}

export async function editarComentario(data) {
  const comentarioDoc = await comentarioRef.doc(data.idComentario).get()

  if (!comentarioDoc.exists) {
    const err = new Error('Comentário não encontrado')
    err.status = 404
    throw err
  }

  const usuarioDoc = await usuarioRef.doc(data.idUsuario).get()
  const usuario = usuarioDoc.data()
  const cargo = usuario.cargo

  if (comentarioDoc.data().id_usuario !== data.idUsuario && cargo === 'cidadao') {
    const err = new Error('Você não tem permissão para editar esse comentário')
    err.status = 403
    throw err
  }

  await comentarioRef.doc(data.idComentario).update({ texto: data.texto })

  await registrarAtividade({
    tipo: 'Comentário',
    titulo: data.titulo,
    descricao: `Você editou um comentário`,
    acao: 'Comentário alterado',
    payload: null,
    idUsuario: data.idUsuario,
    idAtividade: data.idComentario,
  })

  return { message: 'Comentário atualizado com sucesso' }
}

export async function deletarComentario(data) {
  const comentarioDoc = await comentarioRef.doc(data.idComentario).get()

  if (!comentarioDoc.exists) {
    const err = new Error('Comentário não encontrado')
    err.status = 404
    throw err
  }

  const usuarioDoc = await usuarioRef.doc(data.idUsuario).get()
  const usuario = usuarioDoc.data()
  const cargo = usuario.cargo

  if (comentarioDoc.data().id_usuario !== data.idUsuario && cargo === 'cidadao') {
    const err = new Error('Você não tem permissão para deletar esse comentário')
    err.status = 403
    throw err
  }

  await comentarioRef.doc(data.idComentario).update({isDeleted: true})

  await pautaRef.doc(data.idPauta).update({
    qtComentario: admin.firestore.FieldValue.increment(-1)
  })


  await registrarAtividade({
    tipo: 'Comentário',
    titulo: data.titulo,
    descricao: `Você deletou um comentário`,
    acao: 'Comentário removido',
    payload: null,
    idUsuario: data.idUsuario,
    idAtividade: data.idComentario,
  })

  return { message: 'Comentário deletado com sucesso' }
}
