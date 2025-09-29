import * as denunciaService from './denunciaService.js'
import * as denunciaValidator from './denunciaValidator.js'

export async function enviarDenunciaController(req,res,next) {
    try{
        const idUsuario = req.usuario.id
    
        const data = {
            idAtividade: req.body.idAtividade,
            tipoAtividade: req.body.tipoAtividade,
            motivo: req.body.motivo,
            descricao: req.body.descricao,
            idUsuarioReportado: req.body.idUsuarioReportado
        }
    
        const parsedData = denunciaValidator.SchemaEnviarDenuncia.parse(data)
        const resultado = denunciaService.enviarDenuncia({idUsuario, ...parsedData})

        return res.status(200).json(resultado)
    }catch(err){
        next(err)
    }
}

export async function pesquisarDenunciaController(req,res,next) {
    try {
        let tipoAtividade = req.query.tipoAtividade || null
    
        tipoAtividade = denunciaValidator.SchemaPesquisarDenuncia(tipoAtividade)
        const resultado = denunciaService.pesquisarDenuncia(tipoAtividade)

        return res.status(200).json(resultado)
    } catch (err) {
        next(err)
    }
}

export async function verificarDenunciaController(req,res,next) {
    try {
        const data = {
            tipoDenuncia: req.body.tipoDenuncia,
            idDenuncia: req.body.idDenuncia
        }

        const parsedData = denunciaValidator.SchemaVerificarDenuncia(data)
        const resultado = denunciaService.verificarDenuncia(parsedData)

        return res.status(200).json(resultado)
    } catch (err) {
        next(err)
    }
}