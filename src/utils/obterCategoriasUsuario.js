import { db } from '../plugins/bd.js'

const preferenciaRef = db.collection('Preferencia')

export async function obterCategoriaUsuario(idUsuario) {
    const snapshot = await preferenciaRef.select('opcoesCategoria').where('idUsuario', '==', idUsuario).get()
    const doc = snapshot.docs[0].data()
    let categoria = doc.opcoesCategoria
    if (categoria.length == 0) categoria = ['todos']
    return categoria
}
