import { db } from '../../plugins/bd.js'
import { formatarData } from '../../utils/formatarData.js'

const noticiaRef = db.collection('Noticia')

export async function pesquisarNoticia(filters) {
  let query = noticiaRef
    .select(
      'titulo',
      'tema',
      'imagem',
      'fonte',
      'criadoEm',
      'publicadoEm',
      'status'
    )
    .where('status', '==', 'publicado')
    .orderBy('criadoEm', 'desc')

  if (filters.titulo) query = query.where('titulo', '==', filters.titulo)

  const resultado = await query.get()
  if (resultado.empty) return []

  return resultado.docs.map(doc => ({
    id: Number(doc.id),
    ...doc.data(),
    criadoEm: formatarData(doc.data().criadoEm),
    publicadoEm: formatarData(doc.data().publicadoEm),
  }))
}

export async function visualizarNoticia(id) {
  const noticiaDoc = await noticiaRef.doc(String(id)).get()

  if (!noticiaDoc.exists)
    throw Object.assign(new Error('Noticia não encontrada'), { status: 404 })

  const data = noticiaDoc.data()
  return {
    id: Number(noticiaDoc.id),
    ...data,
    criadoEm: formatarData(data.criadoEm),
    publicadoEm: formatarData(data.publicadoEm),
  }
}
