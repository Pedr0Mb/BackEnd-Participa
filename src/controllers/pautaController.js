import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'
import * as validacaoPauta from '../validacoes/validacaoPauta.js'

export async function pesquisarPauta(req,res) {  
  try{
    const data = {
      titulo: req.body.titulo || null,
      status: req.body.status || null
    }

    const { titulo, status } = validacaoPauta.SchemaPesquisarPauta.parse(data)

    const [resultado] = await db.query('CALL pesquisarPautas(?,?)', [titulo,status])
   
    const pautas = resultado[0] || [];

    if (pautas.length === 0) return res.status(404).json({ message: 'pauta não encontrada' });
    
    return res.status(200).json(pautas)

  }catch(error){
    console.error('Erro ao pesquisar pauta: ',error)
    return res.status(500).json({ error: 'Erro interno ao pesquisar Pauta'})
  }
}

export async function visualizarPauta(req, res) {
  try {
    const data = { idPauta: Number(req.params.id) }

    const { idPauta } = validacaoPauta.SchemaVisualizarPauta.parse(data);

    const [resultado] = await db.query('CALL visualizarPauta(?)', [idPauta]);

    const pauta = resultado[0][0] || {}; 
    const comentarios = resultado[1] || []; 

    return res.status(200).json({pauta,comentarios});

  } catch (error) {
    console.error('Erro ao visualizar pauta: ', error);
    return res.status(500).json({ error: 'Erro interno ao visualizar a pauta' });
  }
}


export async function criarPauta(req,res) {  
  try{
      const idUsuario = req.usuario.id
      
      const data = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        justificativa: req.body.justificativa,
        dataLimite: new Date(req.body.dataLimite),
        imagem: req.body.imagem || null,
      } 

      const { titulo, descricao, justificativa, dataLimite, imagem } = validacaoPauta.SchemaCriarPauta.parse(data);

       const [result] = await db.query(
          `INSERT INTO Pauta (
          titulo_pauta,
          descricao_pauta,
          justificativa_pauta,
          dataPublicacao_pauta,
          dataLimite_pauta,
          imagem_pauta,
          status_pauta,
          id_usuario ) 
          VALUES (?, ?, ?, NOW(), ?, ?, 'Ativa', ?)`,
          [titulo, descricao, justificativa, dataLimite, imagem, idUsuario]
        )

        const idPauta = result.insertId;

        await registrarAtividade({
          tipo: 'Pauta',
          titulo: 'Pauta criada',
          link: null,
          idUsuario,
          idAtividade: idPauta,
        });

        return res.status(201).json({ message: 'Pauta criada com sucesso'})

    }catch(error){
        console.error('Erro ao criar pauta: ',error)
        return res.status(500).json({ error: 'Erro interno ao criar pauta'})
    }
}

export async function alterarPauta(req,res) {
  try{
  const idUsuario = req.usuario.id

  const data = {
    idPauta: Number(req.body.id),
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    justificativa: req.body.justificativa,
    dataLimite: new Date(req.body.dataLimite),
    imagem: req.body.imagem || null,
    status: req.body.status || 'Ativo'
  }

  const { idPauta, titulo, descricao, justificativa, dataLimite, imagem, status } = validacaoPauta.SchemaAlterarPauta.parse(data);

  const [criadorPauta] = await db.query(
    `SELECT id_usuario 
    FROM Pauta
    WHERE id_pauta = ? AND id_usuario = ?`, 
    [idPauta, idUsuario]
  )

  if(criadorPauta.length === 0 && req.usuario.cargo == 'cidadao') return res.status(403).json({ message: 'Você não pode alterar essa pauta'})
        
  await db.query(
      `UPDATE Pauta 
      SET titulo_pauta = ?,
      descricao_pauta = ?,
      justificativa_pauta = ?,
      dataLimite_pauta = ?,
      imagem_pauta = ?,
      status_pauta = ?
      WHERE id_pauta = ?`, 
      [titulo, descricao, justificativa, dataLimite, imagem, status, idPauta]
    )
        
    await registrarAtividade({
      tipo: 'Pauta',
      titulo: 'Pauta alterada',
      link: null,
      idUsuario,
      idAtividade: idPauta,
    });

      return res.status(200).json({ message: 'Pauta atualizada com sucesso'})

    }catch(error){
        console.error('Erro ao atualizar Pauta: ',error)
        return res.status(500).json({ error: 'Erro interno ao atualizar Pauta'})
    }
}

export async function deletarPauta(req,res) {
  try{
    const idUsuario = req.usuario.id

    const data = { idPauta: Number(req.params.id) }

    const { idPauta } = validacaoPauta.SchemaDeletarPauta.parse(data);
  
    const [criadorPauta] = await db.query(`
      SELECT id_usuario 
      FROM Pauta WHERE id_pauta = ? 
      AND id_usuario = ?`, 
      [idPauta, idUsuario]
    )
  
    if(criadorPauta.length === 0 && req.usuario.cargo == 'cidadao') return res.status(500).json({ message: 'Você não pode alterar essa pauta'})
      
    await db.query('DELETE FROM Pauta WHERE id_pauta = ?', [idPauta])
        
    await registrarAtividade({
      tipo: 'Pauta',
      titulo: 'Pauta removida',
      link: null,
      idUsuario,
      idAtividade: idPauta,
    })

    return res.status(200).json({ message: 'Pauta deletada com sucesso'})

  }catch(error){
      console.error('Erro ao atualizar Pauta: ',error)
      return res.status(500).json({ error: 'Erro interno ao deletar Pauta'})
  }
}