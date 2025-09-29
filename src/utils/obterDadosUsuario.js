import {db} from '../plugins/bd.js'

const usuarioRef = db.collection('Usuario')

export async function obterDadosUsuario(idUsuario) {
    const usuarioDoc = await usuarioRef.doc(idUsuario).get()
    const usuario = usuarioDoc.data()
    return usuario
}