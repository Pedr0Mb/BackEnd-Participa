import * as denunciaService from './denunciaService.js'
import * as denunciaValidator from './denunciaValidator.js'

export async function pesquisarDenunciaController(req, res, next) {
  try {
    const parsedData = denunciaValidator.SchemaPesquisarDenuncia.parse({ 
      tipo: req.query.tipo || null, 
      status: req.query.status || null
    })
    const resultado = await denunciaService.pesquisarDenuncia(parsedData)

    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

export async function visualizarDenunciaController(req, res, next) {
  try {
    const {idDenuncia} = denunciaValidator.SchemaIdDenuncia.parse({ 
      idDenuncia: Number(req.params.id) 
    })
    const resultado = await denunciaService.visualizarDenuncia(idDenuncia)

    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

export async function removerDenunciaController(req, res, next) {
  try {
    const  {idDenuncia} = denunciaValidator.SchemaIdDenuncia.parse({ 
      idDenuncia: Number(req.params.id) 
    })
    await denunciaService.removerDenuncia(idDenuncia)

    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export async function verificarDenunciaController(req, res, next) {
  try {
    const {idDenuncia} = denunciaValidator.SchemaIdDenuncia.parse({ 
      idDenuncia: Number(req.params.id),  
    })
    await denunciaService.verificarDenuncia(idDenuncia)

    return res.sendStatus(201)
  } catch (err) {
    next(err)
  }
}
