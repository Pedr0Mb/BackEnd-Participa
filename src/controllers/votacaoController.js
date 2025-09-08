import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'
import * as validacaoVotacao from '../validacoes/validacaoVotacao.js'

export async function pesquisarVotacoes(req,res) {
  try{
    const data = {
      status: req.body.status || null,
      titulo: req.body.titulo || null,
      tema: req.body.tema || null
    }

    const { status, titulo, tema } = validacaoVotacao.SchemaPesquisarVotacao.parse(data)
    
    const [resultado] = await db.query('CALL pesquisarVotacoes(?,?,?)', [status, titulo,tema])
   
    const votacoes = resultado[0] || [];

    if (votacoes.length === 0) return res.status(404).json({ message: 'Votação não encontrada' });
    
    return res.status(200).json(votacoes)

  }catch(error){
    console.error('Erro ao pesquisar votação: ',error)
    return res.status(500).json({ error: 'Erro ao pesquisar votação'})
  }
}

export async function visualizarVotacao(req, res) {
  const id = req.params.id;

  try {
    const [resultado] = await db.query('CALL visualizarVotacao(?)', [id]);

    const votacao = resultado[0] || {};     
    const propostas = resultado[1] || [];     

    return res.status(200).json({votacao,propostas});

  } catch (error) {
    console.error('Erro ao visualizar votação: ', error);
    return res.status(500).json({ error: 'Erro interno ao visualizar a votação' });
  }
}


export async function criarVotacao(req,res) {
  try{
    const idUsuario = req.usuario.id

    const data = {
      titulo: req.body.titulo,
      tema: req.body.tema,
      breveDescritivo: req.body.breveDescritivo,
      publicoAlvo: req.body.publicoAlvo,
      orcamento: req.body.orcamento,
      dataFim: new Date(req.body.dataFim),
      imagem: req.body.imagem || null,
      opcoesResposta: req.body.opcoesResposta
    }

    const { titulo, tema, breveDescritivo, publicoAlvo, orcamento, dataFim, imagem, opcoesResposta } = validacaoVotacao.SchemaCriarVotacao.parse(data);

    const [resultadoVotacao] = await db.query(
      `INSERT INTO Votacao (
      titulo_votacao,
      tema_votacao,
      breveDescritivo_votacao,
      publicoAlvo_votacao,
      orçamento_votacao,
      dataPublicação_votacao,
      dataFim_votacao,
      status_votacao,
      imagem_votacao,
      id_usuario )
      VALUES (?, ?, ?, ?, ?, NOW(), ?, 'Em andamento', ?, ?)`,
      [titulo, tema, breveDescritivo, publicoAlvo, orcamento, dataFim, imagem, idUsuario]
    )

    const idVotacao = resultadoVotacao.insertId

    for (const opcao of opcoesResposta) {
      const { titulo } = validacaoVotacao.schemaOpcoesResposta.parse(opcao);
      await db.query(
        `INSERT INTO OpcoesResposta (
        titulo_opcaoResposta, 
        id_votacao,
        id_usuario)
        VALUES (?,?,?)`,
        [titulo, idVotacao, idUsuario]
      );
    }

    await registrarAtividade({
      tipo: 'Votação',
      titulo: 'Votação criada',
      link: null,
      idUsuario,
      idAtividade: idVotacao,
    })

    return res.status(201).json({ message: 'Votação criada com sucesso'})
  }catch(error){
    console.error('Erro ao criar votação: ',error)
    return res.status(500).json({ error: 'Erro ao criar votação'})
  }
}
    
export async function alterarVotacao(req, res) {
  try {
    const idUsuario = req.usuario.id;
    const data = {
      idVotacao: Number(req.body.id),
      titulo: req.body.titulo,
      tema: req.body.tema,
      breveDescritivo: req.body.breveDescritivo,
      publicoAlvo: req.body.publicoAlvo,
      orcamento: req.body.orcamento,
      dataFim: new Date(req.body.dataFim),
      status: req.body.status,
      imagem: req.body.imagem || null,
      resultado: req.body.resultado || null,
      opcoesResposta: req.body.opcoesResposta,
    };
    const { idVotacao, titulo, tema, breveDescritivo, publicoAlvo, orcamento, dataFim, status, imagem, resultado, opcoesResposta } = validacaoVotacao.SchemaAlterarVotacao.parse(data);

    await db.query(
      `UPDATE Votacao 
      SET titulo_votacao = ?, 
          tema_votacao = ?,
          breveDescritivo_votacao = ?,
          publicoAlvo_votacao = ?,
          orçamento_votacao = ?,
          dataFim_votacao = ?,
          status_votacao = ?,
          imagem_votacao = ?,
          resultado_votacao = ?
      WHERE id_votacao = ?`,
      [titulo, tema, breveDescritivo, publicoAlvo, orcamento, dataFim, status, imagem, resultado, idVotacao]
    );

    await db.query('DELETE FROM OpcoesResposta WHERE id_votacao = ?', [idVotacao]);

    for (const opcao of opcoesResposta) {
      const { titulo } = validacaoVotacao.schemaOpcoesResposta.parse({ idVotacao, ...opcao });
      await db.query(
        `INSERT INTO OpcoesResposta (
          titulo_opcaoResposta,
          id_votacao,
          id_usuario
        ) VALUES (?, ?, ?)`,
        [titulo, idVotacao, idUsuario]
      );
    }

    await registrarAtividade({
      tipo: 'Votação',
      titulo: 'Votação alterada',
      link: null,
      idUsuario,
      idAtividade: idVotacao,
    })

    return res.status(200).json({ message: 'Votação atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar votação: ', error);
    return res.status(500).json({ error: 'Erro ao atualizar votação' });
  }
}
    
export async function deletarVotacao(req,res) {
  try{
    const idUsuario = req.usuario.id

    const data = { idVotacao: Number(req.params.idVotacao) }

    const { idVotacao } = validacaoVotacao.SchemaDeletarVotacao.parse(data);

    await db.query('DELETE FROM Votacao WHERE id_votacao = ?', [idVotacao])

    await registrarAtividade({
      tipo: 'Votação',
      titulo: 'Votação removida',
      link: null,
      idUsuario,
      idAtividade: idVotacao,
    })

    return res.status(200).json({ message: 'Votação deletada com sucesso'})

  }catch(error){
    console.error('Erro ao deletar votação: ',error)
    return res.status(500).json({ error: 'Erro ao deletar votação'})
  }
}