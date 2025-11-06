import { db } from '../plugins/bd.js'
const usuarioRef = db.collection('Usuario')

export function verificarPermissao(cargosPermitidos) {
  return async (req, res, next) => {
    const idUsuario = req.usuario.id;

    const usuarioDoc = await usuarioRef.doc(idUsuario).get()

    const usuario = usuarioDoc.data()

    const cargo = usuario.role;

    if (cargo === 'Administrador') {
      return next();
    }

    const cargoValido = cargosPermitidos.includes(cargo);

    if (!cargoValido) {
      return res.status(403).json({ mensagem: 'Acesso negado: permissão insuficiente' })
    }

    next()
  }
}
