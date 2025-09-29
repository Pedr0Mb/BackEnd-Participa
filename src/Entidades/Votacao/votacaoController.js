import * as votacaoService from './votacaoService.js'
import * as validacaoVotacao from './votacaoValidator.js'

export async function pesquisarVotacaoController(req,res,next) {
  try{
    const idUsuario = req.usuario.id
    const data = {
      status: req.query.status || null,
      titulo: req.query.titulo || null,
    }

    const parseData = validacaoVotacao.SchemaPesquisarVotacao.parse(data)
    const resultado = votacaoService.pesquisarVotacao({idUsuario, ...parseData})
    
    return res.status(200).json(resultado)

  }catch(err){
    next(err)  
  }
}

export async function visualizarVotacaoController(req,res,next) {
  try{
    let idVotacao = req.query.idVotacao
  
    idVotacao = validacaoVotacao.SchemaVotacaoID.parse(idVotacao)
    const resultado = votacaoService.visualizarVotacao(parseData)
  
    return res.status(200).json(resultado);
  } catch (err) {
    next(err)  
  }
}


export async function criarVotacaoController(req,res,next) {
  try{
    const idUsuario = req.usuario.id

    const data = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      publicoAlvo: req.body.publicoAlvo,
      orcamento: req.body.orcamento,
      dataInicio: new Date(req.body.dataInicio),
      dataFim: new Date(req.body.dataFim),
      opcoesResposta: req.body.opcoesResposta,
      descricoes: req.body.descricoes,
      arquivoFoto: req.file
    }

    const parseData = validacaoVotacao.SchemaCriarVotacao.parse(data);
    const resultado = votacaoService.criarVotacao({idUsuario, ...parseData})
    
    return res.status(201).json(resultado)

  }catch(err){
    next(err)  
  }
}
    
export async function editarVotacaoController(req,res,next) {
  try {
    const idUsuario = req.usuario.id;
    
    const data = {
      idVotacao: req.body.idVotacao,
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      publicoAlvo: req.body.publicoAlvo,
      orcamento: req.body.orcamento,
      dataInicio: new Date(req.body.dataInicio),
      dataFim: new Date(req.body.dataFim),
      opcoesResposta: req.body.opcoesResposta,
      arquivoFoto: req.file
    };

    const parseData = validacaoVotacao.SchemaEditarVotacao.parse(data);
    const resultado = votacaoService.editarVotacao({idUsuario, ...parseData()})

    return res.status(200).json(resultado);

  } catch (err) {
    next(err)  
  }
}
    
export async function deletarVotacaoController(req,res,next) {
  try{
    const idUsuario = req.usuario.id

    const data = { idVotacao: req.query.idVotacao}

    const {idVotacao} = validacaoVotacao.sC.parse(data);
    const resultado =  votacaoService.deletarVotacao({idVotacao, idUsuario,})

    return res.status(200).json(resultado)

  }catch(err){
    next(err)  
  }
}