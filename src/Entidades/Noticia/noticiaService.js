import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { obterCategoriaUsuario } from '../../utils/obterCategoriasUsuario.js'

const noticiaRef = db.collection('Noticia')

// ================= Pesquisar notícias =================
export async function pesquisarNoticia(data) {
  const categorias = await obterCategoriaUsuario(data.idUsuario)

  let query = noticiaRef
    .select('titulo','tituloLower','tema','imagem','fonte','resumo','link_externo','dataPublicacao','isDeleted')
    .where('isDeleted','==',false)
    .orderBy('dataPublicacao','desc')

  if (data.titulo) query = query.where('tituloLower','==',data.titulo.toLowerCase())
  
  const resultado = await query.get()
  if (resultado.empty) return []

  const filtrado = resultado.docs.filter(doc => {
    const tema = doc.data().tema
    return categorias.includes('todos') || categorias.includes(tema)
  })

  return filtrado.map(doc => ({ id: doc.id, ...doc.data() }))
}

// ================= Visualizar notícia =================
export async function visualizarNoticia(idNoticia) {
  const noticiaDoc = await noticiaRef.doc(idNoticia).get()

  if (!noticiaDoc.exists || noticiaDoc.data().isDeleted) {
    const err = new Error('Notícia não encontrada')
    err.status = 404
    throw err
  }

  return { id: noticiaDoc.id, ...noticiaDoc.data() }
}

// ================= Criar notícia =================
export async function criarNoticia(data) {
  const urlFoto = await salvarFoto( data.arquivoFoto.buffer,`noticia/${Date.now()}/foto`,data.arquivoFoto.mimetype);
  
  const noticiaDoc = await noticiaRef.add({
    titulo: data.titulo,
    tituloLower: data.titulo.toLowerCase(),
    tema: data.tema,
    fonte: data.fonte,
    resumo: data.resumo,
    link_externo: data.link_externo,
    imagem: urlFoto,
    idUsuario: data.idUsuario,
    isDeleted: false,
    dataPublicacao: admin.firestore.FieldValue.serverTimestamp()
  });
  
  await registrarAtividade({
    tipo: 'Notícia',
    titulo: data.titulo,
    descricao: `Você criou uma notícia`,
    acao: 'Notícia criada',
    idUsuario: data.idUsuario,
    idAtividade: noticiaDoc.id
  });

  return { message: 'Notícia criada com sucesso' };
}

// ================= Editar notícia =================
export async function editarNoticia(data) {
  const noticiaDoc = await noticiaRef.doc(data.idNoticia).get();

  if (!noticiaDoc.exists || noticiaDoc.data().isDeleted) {
    const err = new Error('Notícia não encontrada')
    err.status = 404
    throw err
  }

  let urlFoto = noticiaDoc.data().imagem
    
  if (data.arquivoFoto) {
      const oldPath = urlFoto.split(`https://storage.googleapis.com/${bucket.name}/`)[1]
      if (oldPath) await bucket.file(oldPath).delete()
      urlFoto = await salvarFoto(data.arquivoFoto.buffer,`noticia/${Date.now()}/foto`,data.arquivoFoto.mimetype)
  }

  await noticiaRef.doc(data.idNoticia).update({
    titulo: data.titulo,
    tituloLower: data.titulo.toLowerCase(),
    tema: data.tema,
    fonte: data.fonte,
    resumo: data.resumo,
    link_externo: data.link_externo,
    imagem: urlFoto
  });

  await registrarAtividade({
    tipo: 'Notícia',
    titulo: data.titulo,
    descricao: `Você editou a notícia`,
    acao: 'Notícia editada',
    idUsuario: data.idUsuario,
    idAtividade: noticiaDoc.id
  });

  return { message: 'Notícia alterada com sucesso' };
}

// ================= Deletar notícia=================
export async function deletarNoticia(data) {
  const noticiaDoc = await noticiaRef.doc(data.idNoticia).get()

  if (!noticiaDoc.exists || noticiaDoc.data().isDeleted) {
    const err = new Error('Notícia não encontrada')
    err.status = 404
    throw err
  }

  await noticiaRef.doc(data.idNoticia).update({ isDeleted: true })

  await registrarAtividade({
    tipo: 'Notícia',
    titulo: noticiaDoc.titulo,
    descricao: `Você excluiu uma notícia`,
    acao: 'Notícia excluida',
    idUsuario: data.idUsuario,
    idAtividade: noticiaDoc.id
  })

  return { message: 'Notícia deletada com sucesso' }
}
