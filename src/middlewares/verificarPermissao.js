import { db } from '../plugins/bd.js'
const usuarioRef = db.collection('Usuario')

export function verificarPermissao(cargosPermitidos = [], permissoesPermitidas = []) {
  return async (req, res, next) => {
    const idUsuario = req.usuario.id;

    const usuarioDoc = await usuarioRef.doc(idUsuario).get()

    const usuario = usuarioDoc.data()

    const cargo = usuario.cargo;
    const permissoes = usuario.permissoes || [];

    if (cargo === 'Administrador') {
      return next();
    }

    const cargoValido = cargosPermitidos.includes(cargo);
    const permissaoValida = permissoes.some(p => permissoesPermitidas.includes(p))

    if (!cargoValido && !permissaoValida) { 
      return res.status(403).json({ mensagem: 'Acesso negado: permissão insuficiente' })
    }

    next()
  }
}
