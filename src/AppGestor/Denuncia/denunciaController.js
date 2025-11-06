import * as denunciaService from './denunciaService.js'
import * as denunciaValidator from './denunciaValidator.js'

export async function pesquisarDenunciaController(req, res, next) {
  try {
    const data = denunciaValidator.SchemaPesquisarDenuncia.parse({
      tipo: req.query.tipo || null,
      status: req.query.status || null
    })

    const denuncias = await denunciaService.pesquisarDenuncia(data)
    return res.status(200).json(denuncias)
  } catch (err) {
    next(err)
  }
}

export async function visualizarDenunciaController(req, res, next) {
  try {
    const { idDenuncia } = denunciaValidator.SchemaIdDenuncia.parse({
      idDenuncia: Number(req.params.id)
    })

    const denuncia = await denunciaService.visualizarDenuncia(idDenuncia)
    return res.status(200).json(denuncia)
  } catch (err) {
    next(err)
  }
}

export async function removerDenunciaController(req, res, next) {
  try {
    const { idDenuncia } = denunciaValidator.SchemaIdDenuncia.parse({
      idDenuncia: Number(req.params.id)
    })

    const idUsuario = req.usuario.id
    await denunciaService.removerDenuncia(idDenuncia, idUsuario)

    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export async function verificarDenunciaController(req, res, next) {
  try {
    const { idDenuncia } = denunciaValidator.SchemaIdDenuncia.parse({
      idDenuncia: Number(req.params.id)
    })

    const idUsuario = req.usuario.id
    await denunciaService.verificarDenuncia(idDenuncia, idUsuario)

    return res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}
