import * as validacaoVotacao from '../Votacao/votacaoValidator.js'
import {registrarVoto} from './votoService.js'

export async function registrarVotoController(req,res,next) {
  try{
    const idUsuario = req.usuario.id

    const data = {
      idProposta: req.body.idPauta,
      idOpcaoResposta: req.body.idOpcaoResposta
    }

    const parsedData = validacaoVotacao.SchemaRegistrarVoto.parse(data);
    const resultado = registrarVoto({idUsuario, ...parsedData})
        
    return res.status(201).json(resultado)
        
  }catch(err){
    next(err)
  }
}
    
