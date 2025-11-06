import { db } from '../../plugins/bd.js'
import { formatarData } from '../../utils/formatarData.js'

const transmissaoRef = db.collection('Transmissao')

export async function pesquisarTransmissao(titulo) {
  let query = transmissaoRef
    .select(
      'idTransmissao',
      'titulo',
      'imagem',
      'foto',
      'tema',
      'criadoEm',
      'publicadoEm',
      'status'
    )

    .where('status', '==', 'publicado')
    .orderBy('criadoEm', 'desc')

  if (titulo) query = query.where('titulo', '==', titulo)

  const resultado = await query.get()
  if (resultado.empty) return []

  return resultado.docs.map(doc => {
    const data = doc.data()
    return {
      idTransmissao: Number(doc.id),
      ...data,
      criadoEm: formatarData(data.criadoEm),
      publicadoEm: formatarData(data.publicadoEm)
    }
  })
}

export async function visualizarTransmissao(idTransmissao) {
  const docSnap = await transmissaoRef.doc(String(idTransmissao)).get()

  if (!docSnap.exists)
    throw Object.assign(new Error('Transmissão não encontrada'), { status: 404 })

  const data = docSnap.data()
  return {
    idTransmissao: Number(docSnap.id),
    ...data,
    criadoEm: formatarData(data.criadoEm),
    publicadoEm: formatarData(data.publicadoEm),
  }
}
