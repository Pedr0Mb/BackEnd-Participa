import { db, admin } from '../plugins/bd.js'
import { getNextId } from './getNextId.js'

const descricoesRef = db.collection('Descricao')

export async function atualizarDescricoes({ descricoes = [], tipoAtividade, idItem }) {

  const antigasSnapshot = await descricoesRef
    .where('tipoAtividade', '==', tipoAtividade)
    .where('idItem', '==', idItem)
    .get()

  const deletos = antigasSnapshot.docs.map(doc => doc.ref.delete())
  await Promise.all(deletos)

  await Promise.all(
    descricoes.map(async desc => {
      const novoId = await getNextId('Descricao') 
      return descricoesRef.doc(String(novoId)).set({
        id: novoId,
        titulo: desc.titulo || null,
        info: desc.info || null,
        tipoAtividade,
        idItem,
        criadoEm: admin.firestore.FieldValue.serverTimestamp()
      })
    })
  )
}
