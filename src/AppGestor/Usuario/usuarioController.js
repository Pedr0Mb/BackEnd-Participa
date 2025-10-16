import * as admValidation from './usuarioValidator.js'
import * as administradorService from './usuarioService.js'

export async function pesquisarUsuarioController(req, res, next) {
  try {
    const filters = admValidation.SchemaPesquisarUsuario.parse( {
      nome: req.query.nome || null,
      role: req.query.role || null,
      cpf: req.query.cpf || null
    })

    const usuarios = await administradorService.pesquisarUsuario(filters)
    return res.status(200).json(usuarios)
  } catch (err) {
    next(err)
  }
}

export async function visualizarUsuarioController(req, res, next) {
  try {
    const { idUsuario } = admValidation.SchemaUsuarioID.parse({ idUsuario: Number(req.params.id) })
    const usuario = await administradorService.visualizarUsuario(idUsuario)
    return res.status(200).json(usuario)
  } catch (err) {
    next(err)
  }
}

export async function editarUsuarioController(req, res, next) {
  try {
    const idAdm = req.usuario.id

    const parseData = admValidation.SchemaEditarUsuario.parse({
      id: Number(req.body.id),
      nome: req.body.nome,
      email: req.body.email,
      role: req.body.role,
      ativo: req.body.ativo
    })  

    await administradorService.editarUsuario({ idAdm, ...parseData })
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export async function verHistoricoController(req, res, next) {
  try {
    const {idUsuario} = admValidation.SchemaUsuarioID.parse({
      idUsuario: Number(req.params.id), 
    })

    const historico = await administradorService.verHistorico(idUsuario)
    return res.status(200).json(historico)
  } catch (err) {
    next(err)
  }
}

export async function promoverUserController(req,res,next) {
  try {
    const {idUsuario} = admValidation.SchemaUsuarioID.parse({
      idUsuario: req.params.id
    })

    await administradorService.promoverUsuario(idUsuario)
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export async function desativarUserController(req,res,next) {
  try {
    const {idUsuario} = admValidation.SchemaUsuarioID.parse({
      idUsuario: req.params.id
    })

    await administradorService.desativarUser(idUsuario)
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}