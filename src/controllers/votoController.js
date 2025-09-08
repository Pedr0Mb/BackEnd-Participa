import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'
import * as validacaoVotacao from '../validacoes/validacaoVotacao.js'

export async function registrarVoto(req,res) {
  try{
    const idUsuario = req.usuario.id

    const data = {idProposta: Number(req.body.idProposta)}

    const { idProposta } = validacaoVotacao.SchemaRegistrarVoto.parse(data);

    await db.query('CALL registrarVoto(?, ?)', [idUsuario, idProposta]);
        
    await registrarAtividade({
      tipo: 'Voto',
      titulo: 'Voto Registrado',
      link: null,
      idUsuario,
      idAtividade: idProposta,
    })
        
    return res.status(201).json({ message: 'Voto registrado com sucesso'})
        
  }catch(error){
    console.error('Erro ao registrar voto: ',error)
    return res.status(500).json({ error: 'Erro ao registrar voto'})
  }
}
    
