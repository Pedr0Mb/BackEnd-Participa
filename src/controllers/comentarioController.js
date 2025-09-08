import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'
import * as validacaoComentario from '../validacoes/validacaoComentario.js'

export async function criarComentario(req,res) {
    try{
        const idUsuario = req.usuario.id;

        const  data = {
            texto: req.body.texto,
            idPauta: Number(req.body.idPauta)
        };

        const { texto, idPauta } = validacaoComentario.SchemaCriarComentario.parse(data);
      
        const [comentario]  = await db.query(
            `INSERT INTO Comentario (
            texto_comentario,
            dataPublicacao_comentario,
            id_usuario,
            id_pauta ) 
            VALUES (?, NOW(), ?, ?)`,
            [texto, idUsuario, idPauta]
        );

        const idComentario = comentario.insertId 

        await registrarAtividade({
            tipo: 'Comentario',
            titulo: 'Comentário adicionado',
            link: null,
            idUsuario,
            idAtividade: idComentario,
        });
    
        return res.status(201).json({ message: 'Comentario criado com sucesso'})
    
    }catch(error){
        console.error('Erro ao criar comentario: ',error)
        return res.status(500).json({ error: 'Erro interno ao criar comentario'})
    }
}

export async function alterarComentario(req,res) {
    try{
        const idUsuario = req.usuario.id

        const data = {
            texto: req.body.texto,
            idComentario: Number(req.body.id)
        };

        const { texto, idComentario } = validacaoComentario.SchemaAlterarComentario.parse(data);

        const [criadorComentario] = await db.query('SELECT id_usuario FROM Comentario WHERE id_comentario = ? AND id_usuario = ?', [idComentario,idUsuario])
        
        if(criadorComentario.length === 0 && req.usuario.cargo == 'cidadao') return res.status(403).json({ message: 'Você não pode alterar esse Comentario'})
        
        await db.query('UPDATE Comentario SET texto_comentario = ? WHERE id_comentario = ?', [texto, idComentario])
        
        await registrarAtividade({
            tipo: 'Comentario',
            titulo: 'Comentário alterado',
            link: null,
            idUsuario,
            idAtividade: idComentario,
        });
        
        return res.status(200).json({ message: 'Comentario atualizado com sucesso'})

    }catch(error){
        console.error('Erro ao atualizar Comentario: ',error)
        return res.status(500).json({ error: 'Erro interno ao atualizar Comentario'})
    }
}

export async function deletarComentario(req,res) {
    try{
        const idUsuario = req.usuario.id
        
        const data = { idComentario: Number(req.params.idComentario)};

        const { idComentario } = validacaoComentario.SchemaDeletarComentario.parse(data);

        const [criadorComentario] = await db.query('SELECT id_usuario FROM Comentario WHERE id_comentario = ? AND id_usuario = ?', [idComentario,idUsuario])
    
        if(criadorComentario.length === 0 && req.usuario.cargo == 'cidadao') return res.status(403).json({ message: 'Você não pode alterar essa Comentario'})

        await db.query('DELETE FROM Comentario WHERE id_comentario = ?', [idComentario])
   
        await registrarAtividade({
            tipo: 'Comentario',
            titulo: 'Comentário removido',
            link: null,
            idUsuario,
            idAtividade: idComentario,
        });
    
        return res.status(200).json({ message: 'Comentario deletado com sucesso'})

    }catch(error){
        console.error('Erro ao deletar Comentario: ',error)
        return res.status(500).json({ error: 'Erro interno ao deletar Comentario'})
    }
}