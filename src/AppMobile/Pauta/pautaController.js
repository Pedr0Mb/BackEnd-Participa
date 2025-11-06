import * as pautaService from './pautaService.js'
import * as pautaValidator from './pautaValidator.js'

export async function pesquisarPautaController(req, res, next) {
  try {
    const filters = pautaValidator.SchemaPesquisarPauta.parse({
      status: req.query.status || null,
      titulo: req.query.titulo || null,
    })

    const resultado = await pautaService.pesquisarPauta({
      ...filters,
    })
    res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

export async function visualizarPautaController(req, res, next) {
  try {
    const { idPauta } = pautaValidator.SchemaPautaID.parse({
      idPauta: Number(req.params.id),
    })
    const resultado = await pautaService.visualizarPauta(idPauta)
    res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

export async function registrarVotoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const parsedData = pautaValidator.SchemaRegistrarVoto.parse({
      idPauta: Number(req.params.idPauta),
      idOpcao: Number(req.params.idOpcao)
    })

    await pautaService.registrarVoto({ idUsuario, ...parsedData })
    return res.sendStatus(201)
  } catch (err) {
    next(err)
  }
}