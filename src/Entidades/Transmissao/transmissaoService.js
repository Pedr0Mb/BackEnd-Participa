import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { obterCategoriaUsuario } from '../../utils/obterCategoriasUsuario.js'

const transmissaoRef = db.collection('Transmissao')

// ================= Pesquisar transmissões =================
export async function pesquisarTransmissao(data) {
  const categorias = await obterCategoriaUsuario(data.idUsuario)

  let query = transmissaoRef
    .select('titulo', 'imagem', 'subTitulo', 'tema', 'dataPublicacao')
    .where('isDeleted', '==', false)
    .orderBy('dataPublicacao', 'desc')

  if (data.titulo) query = query.where('tituloLower', '==', data.titulo.toLowerCase())

  const resultado = await query.get()
  if (resultado.empty) return []

  const filtrado = resultado.docs.filter(doc => {
    const tema = doc.data().tema
    return categorias.includes('todos') || categorias.includes(tema)
  })

  return filtrado.map(doc => ({ id: doc.id, ...doc.data() }))
}

// ================= Visualizar transmissão =================
export async function visualizarTransmissao(idTransmissao) {
  const docSnap = await transmissaoRef.doc(idTransmissao).get()

  if (!docSnap.exists) {
    const err = new Error('Transmissão não encontrada')
    err.status = 404
    throw err
  }

  return { id: docSnap.id, ...docSnap.data() }
}

// ================= Criar transmissão =================
export async function criarTransmissao(data) {
  const urlFoto = await salvarFoto(data.arquivoFoto.buffer,`transmissao/${Date.now()}/foto`,data.arquivoFoto.mimetype);
   
  const transmissaoDoc = await transmissaoRef.add({
    idUsuario: data.idUsuario,
    titulo: data.titulo,
    subTitulo: data.subTitulo,
    tituloLower: data.titulo.toLowerCase(),
    dataPublicacao: admin.firestore.FieldValue.serverTimestamp(),
    descricao: data.descricao,
    link: data.link,
    isDeleted: false,
    tema: data.tema,
    fonte: data.fonte,
    tempo: data.tempo,
    imagem: urlFoto
  })

  await registrarAtividade({
    tipo: 'Transmissão',
    titulo: data.titulo,
    descricao: `Você criou uma transmissão`,
    acao: 'Transmissão criada',
    idUsuario: data.idUsuario,
    idAtividade: transmissaoDoc.id
  })

  return { message: 'Transmissão criada com sucesso' }
}

// ================= Editar transmissão =================
export async function editarTransmissao(data) {
  const docSnap = await transmissaoRef.doc(data.idTransmissao).get()
  
  if (!docSnap.exists || docSnap.data().isDeleted) {
    const err = new Error('Transmissão não encontrada')
    err.status = 404
    throw err
  }

  let urlFoto = docSnap.data().imagem
  
 if (data.arquivoFoto) {
      const oldPath = data.urlFoto.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
      if (oldPath) await bucket.file(oldPath).delete();
      urlFoto = await salvarFoto(data.arquivoFoto.buffer,`transmissao/${data.idTransmissao}/foto`,data.arquivoFoto.mimetype);
 }

  await transmissaoRef.doc(data.idTransmissao).update({
    titulo: data.titulo,
    subTitulo: data.subTitulo,
    tituloLower: data.titulo.toLowerCase(),
    descricao: data.descricao,
    link: data.link,
    imagem: urlFoto,
    tema: data.tema,
    fonte: data.fonte,
    tempo: data.tempo
  })

  await registrarAtividade({
    tipo: 'Transmissão',
    titulo: data.titulo,
    descricao: `Você editou uma transmissão`,
    acao: 'Transmissão editada',
    idUsuario: data.idUsuario,
    idAtividade: docSnap.id
  })

  return { message: 'Transmissão alterada com sucesso' }
}

// ================= Deletar transmissão=================
export async function deletarTransmissao(data) {
  const docSnap = await transmissaoRef.doc(data.idTransmissao).get()

  if (!docSnap.exists || docSnap.data.isDeleted) {
    const err = new Error('Transmissão não encontrada')
    err.status = 404
    throw err
  }

  await transmissaoRef.doc(data.idTransmissao).update({ isDeleted: true })

  await registrarAtividade({
    tipo: 'Transmissão',
    titulo: docSnap.data().titulo,
    descricao: `Você excluiu uma transmissão`,
    acao: 'Transmissão excluída',
    idUsuario: data.idUsuario,
    idAtividade: docSnap.id
  })

  return { message: 'Transmissão deletada com sucesso' }
}
