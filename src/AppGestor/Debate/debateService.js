import { atualizarDescricoes } from '../../utils/atualizarDescricoes.js'
import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { formatarData } from '../../utils/formatarData.js'

const debateRef = db.collection('Debate')
const comentarioRef = db.collection('Comentario')
const descricaoRef = db.collection('Descricao')

export async function pesquisarDebate(data) {
  let query = debateRef
    .select('titulo', 'subtitulo', 'idAutor', 'imagem', 'criadoEm', 'fotoUrlAutor', 'nomeAutor', 'qtComentario')
    .orderBy('criadoEm', 'desc')

  if (data.titulo) query = query.where('titulo', '==', data.titulo)
  if (data.idUsuario) query = query.where('idAutor', '==', data.idUsuario)

  const resultado = await query.get()
  if (resultado.empty) return []

  return resultado.docs.map(doc => {
    const debate = doc.data()
    return {
      id: Number(doc.id),
      ...debate,
      criadoEm: formatarData(debate.criadoEm),
    }
  })
}

export async function visualizarDebate(idDebate) {
  const debateDoc = await debateRef.doc(String(idDebate)).get()

  if (!debateDoc.exists)
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 })

  const debateData = debateDoc.data()

  const comentariosQuery = await comentarioRef
    .where('idDebate', '==', idDebate)
    .get()

  const descricaoQuery = await descricaoRef
    .where('tipoAtividade', '==', 'Debate')
    .where('idItem', '==', idDebate)
    .get()

  return {
    id: Number(debateDoc.id),
    ...debateData,
    criadoEm: formatarData(debateData.criadoEm),
    atualizadoEm: formatarData(debateData.atualizadoEm),

    comentarios: comentariosQuery.docs.map(doc => {
      const c = doc.data()
      return {
        id: Number(doc.id),
        ...c,
        criadoEm: formatarData(c.criadoEm),
        atualizadoEm: formatarData(c.atualizadoEm),
      }
    }),

    descricoes: descricaoQuery.docs.map(doc => {
      const d = doc.data()
      return {
        id: Number(doc.id),
        ...d,
        criadoEm: formatarData(d.criadoEm),
      }
    }),
  }
}

export async function editarDebate(data) {
  const debateDoc = await debateRef.doc(String(data.idDebate)).get()

  if (!debateDoc.exists) 
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 })

  await debateRef.doc(String(data.idDebate)).update({
    titulo: data.titulo,
    subtitulo: data.subtitulo,
    imagem: data.imagem,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
  })

  await atualizarDescricoes({
    descricoes: data.descricoes,
    tipoAtividade: 'Debate',
    idItem: String(data.idDebate),
  })

  await registrarAtividade({
    tipo: 'Debate',
    titulo: data.titulo,
    descricao: 'Você editou o Debate',
    acao: 'Debate editado',
    idUsuario: data.idUsuario,
    idAtividade: String(data.idDebate),
  })
}

export async function deletarDebate(data) {
  const debateDoc = await debateRef.doc(String(data.idDebate)).get()

  if (!debateDoc.exists) 
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 })

  const debateData = debateDoc.data()

  await debateRef.doc(String(data.idDebate)).delete()
  
  await atualizarDescricoes({ 
    descricoes: [], 
    tipoAtividade: 'Debate', 
    idItem: String(data.idDebate) 
  })

  await registrarAtividade({
    tipo: 'Debate',
    titulo: debateData.titulo,
    descricao: 'Você excluiu o Debate',
    acao: 'Debate excluído',
    idUsuario: data.idUsuario,
    idAtividade: String(data.idDebate),
  })
}
