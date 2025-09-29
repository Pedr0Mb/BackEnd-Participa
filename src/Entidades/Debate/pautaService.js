import { atualizarDecricoes } from '../../utils/atualizarDescricoes.js'
import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { obterDadosUsuario } from '../../utils/obterDadosUsuario.js'

const pautaRef = db.collection('Pauta')
const comentarioRef = db.collection('Comentario')
const descricaoRef = db.collection('Descricao')

// ================= Pesquisar Pauta =================
export async function pesquisarPauta(data) {
  let query = pautaRef
    .select('titulo','SubTitulo','dataPublicacao','idUsuario','imagem','qtComentario','nomeUsuario','fotoUrlUsuario') 
    .where('isDeleted', '==', false)
    .orderBy('dataPublicacao','desc')

  if (data.titulo) query = query.where('tituloLower', '==', data.titulo.toLowerCase())
  if (data.idUsuario) query = query.where('idUsuario','==',data.idUsuario)

  const resultado = await query.get()
  if (resultado.empty) return []

  const pautas = resultado.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return pautas;
}

// ================= Visualizar Pauta =================
export async function visualizarPauta(idPauta) {
  const pautaDoc = await pautaRef.doc(idPauta).get()

  if (!pautaDoc.exists) {
    const err = new Error('Pauta não encontrada')
    err.status = 404
    throw err
  }

  const comentariosQuery = await comentarioRef.where('idPauta', '==', idPauta).where('idDeleted','==',false).get()
  const descricaoQuery = await descricaoRef.where('tipoAtividade','==','Pauta').where('idItem','==',idPauta).get()

  const pauta = { 
    id: pautaDoc.id, 
    ...pautaDoc.data(), 
    comentarios: comentariosQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    descricoes: descricaoQuery.docs.map(doc => ({id: doc.id, ...doc.data() }))
  }

  return pauta
}

// ================= Criar Pauta =================
export async function criarPauta(data) {
  const fotoUrl = await salvarFoto(data.arquivoFoto.buffer,`pauta/${Date.now()}/foto`,data.arquivoFoto.mimetype);
  const {nome,fotoUsuario} = await obterDadosUsuario(data.idUsuario)

  const pautaDoc = await pautaRef.add({
    idUsuario: data.idUsuario,
    titulo: data.titulo,
    tituloLower: data.titulo.toLowerCase(),
    nomeUsuario: nome,
    fotoUsuario: fotoUsuario,
    isDeleted: false,
    dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
    qtComentario: 0,
    imagem: fotoUrl
  })

  await Promise.all(
    data.descricoes.map(desc => descricaoRef.add({
    titulo: desc.titulo,
    info: desc.info,
    tipo: 'Pauta',
    idItem: pautaDoc.id,
    dataCriacao: admin.firestore.FieldValue.serverTimestamp()
  }))
  )

  await registrarAtividade({
    tipo: 'Pauta',
    titulo: data.titulo,
    descricao: `Você criou uma pauta`,
    acao: 'Pauta criada',
    idUsuario: data.idUsuario,
    idAtividade: pautaDoc.id,
  })

  return { message: 'Pauta criada com sucesso' }
}

// ================= Editar Pauta =================
export async function editarPauta(data) {
  const pautaDoc = await pautaRef.doc(data.idPauta).get()
  
  if (!pautaDoc.exists || pautaDoc.data().isDeleted) {
    const err = new Error('Pauta não encontrada')
    err.status = 404
    throw err
  }
  
  const {cargo} = await obterDadosUsuario(data.idUsuario)
  
  if (pautaDoc.data().idUsuario !== data.idUsuario && cargo === 'cidadao') {
    const err = new Error('Você não pode alterar essa pauta')
    err.status = 403
    throw err
  }

  let urlFoto = pautaDoc.data().imagem

  if (data.arquivoFoto) {
    const oldPath = data.urlFoto.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
    if (oldPath) await bucket.file(oldPath).delete();
    urlFoto = await salvarFoto(data.arquivoFoto.buffer,`pauta/${data.idPauta}/foto`,data.arquivoFoto.mimetype);
 }

  await pautaRef.doc(data.idPauta).update({
    titulo: data.titulo,
    tituloLower: data.titulo.toLowerCase(),
    imagem: urlFoto,
    dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
  })

  await atualizarDecricoes({
    descricoes: data.descricoes,
    tipo: 'Pauta',
    idItem: data.idPauta
  })

  await registrarAtividade({
    tipo: 'Pauta',
    titulo: data.titulo,
    descricao: `Você editou a pauta`,
    acao: 'Pauta editada',
    idUsuario: data.idUsuario,
    idAtividade: data.idPauta,
  })

  return { message: 'Pauta alterada com sucesso' }
}

// ================= Deletar Pauta =================

export async function deletarPauta(data) {
  const pautaDoc = await pautaRef.doc(data.idPauta).get()
  if (!pautaDoc.exists || pautaDoc.data().isDeleted) {
    const err = new Error('Pauta não encontrada')
    err.status = 404
    throw err
  }

  const {cargo} = await obterDadosUsuario(data.idUsuario)
  const pautaData = pautaDoc.data();

  if (pautaData.idUsuario !== data.idUsuario && cargo === 'cidadao') {
    const err = new Error('Você não pode excluir essa pauta');
    err.status = 403
    throw err
  }

  await pautaRef.doc(data.idPauta).update({isDeleted: true})
  await atualizarDecricoes([],'Pauta',data.idPauta)

  await registrarAtividade({
    tipo: 'Pauta',
    titulo: pautaData.titulo,
    descricao: `Você excluiu a pauta`,
    acao: 'Pauta excluida',
    idUsuario: data.idUsuario,
    idAtividade: data.idPauta,
  })

  return { message: 'Pauta deletada com sucesso' }
}
