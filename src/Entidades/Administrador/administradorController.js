import * as admValidation from './administradorValidator.js'
import * as administradorService from './administradorService.js'

export async function pesquisarUsuarioController(req, res, next) {
  try {
    const data = {
      nome: req.query.nome || null,
      cargo: req.query.cargo || null,
      cpf: req.query.cpf || null
    }

    const parseData = admValidation.SchemaPesquisarUsuario.parse(data)
    const usuario = await administradorService.pesquisarUsuario(parseData)
    
    return res.status(200).json(usuario)

  }catch(err) {
    next(err)
  }
}

export async function visualizarUsuarioController(req, res, next) {
  try {
    const data = { id: req.query.id }

    const { id } = admValidation.SchemaVisualizarUsuario.parse(data)
    const usuario = await administradorService.visualizarUsuario(id)

    return res.status(200).json(usuario)

  }catch (err) {
      next(err)
  }
}

export async function editarUsuarioController(req, res, next) {
  try {
    const idAdm = req.usuario.id

    const data = {
      id: req.body.id,
      nome: req.body.nome,
      email: req.body.email,
      cargo: req.body.cargo,
      permissoes: req.body.permissoes || null,
    }

    const parseData = admValidation.SchemaEditarUsuario.parse(data)
    const resultado = await administradorService.editarUsuario({ idAdm, ...parseData })

    return res.status(200).json(resultado)

  } catch (err) {
    next(err)
  }
}

export async function verHistoricoController(req, res, next) {
  try {
    const data = {
      id: req.query.id , 
      dataInicio: req.query.dataInicio ? new Date(req.query.dataInicio) : null,
      tipoAtividade: req.query.tipoAtividade || null
    }
    
    const parseData = admValidation.SchemaVerHistorico.parse(data)
    const historico = await administradorService.verHistorico(parseData)

    return res.status(200).json(historico)

  } catch (err) {
      next(err)
  }
}