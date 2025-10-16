import * as votacaoService from './pautaService.js';
import * as validacaoVotacao from './pautaValidator.js';

export async function pesquisarPautaController(req, res, next) {
  try {
    const filters = validacaoVotacao.SchemaPesquisarPauta.parse({
      status: req.query.status || null,
      titulo: req.query.titulo || null,
    })

    const resultado = await votacaoService.pesquisarPauta(filters);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function visualizarPautaController(req, res, next) {
  try {
    const { idPauta } = validacaoVotacao.SchemaPautaID.parse({
      idPauta: Number(req.params.id),
    })

    const resultado = await votacaoService.visualizarPauta(idPauta);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function criarPautaController(req, res, next) {
  try {
    const data = validacaoVotacao.SchemaCriarPauta.parse({
      titulo: req.body.titulo,
      descricoes: req.body.descricoes,
      opcoes: req.body.opcoes,
      imagem: req.body.imagem,
      inicioVotacao: parseDate(req.body.inicioVotacao),
      fimVotacao: parseDate(req.body.fimVotacao),
      tag: req.body.tag,
    });

    await votacaoService.criarPauta({idCriador: req.usuario.id,...data,});
    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
}

export async function editarPautaController(req, res, next) {
  try {
   const data = validacaoVotacao.SchemaEditarPauta.parse({
    id: req.params.id,               
    titulo: req.body.titulo,
    descricao: req.body.descricao,   
    opcoes: req.body.opcoes,         
    imagem: req.body.imagem,
    inicioVotacao: parseDate(req.body.inicioVotacao),
    fimVotacao: parseDate(req.body.fimVotacao),
    tag: req.body.tag,
});

    await votacaoService.editarPauta({ idCriador: req.usuario.id,...data,});
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function publicarPautaController(req, res, next) {
  try {
    const { idPauta } = validacaoVotacao.SchemaPautaID.parse({idPauta: Number(req.params.idPauta),});
    await votacaoService.publicarPauta({idCriador: req.usuario.id,idPauta,})
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function deletarPautaController(req, res, next) {
  try {
    const { idPauta } = validacaoVotacao.SchemaPautaID.parse({idPauta: Number(req.params.idPauta),});
    await votacaoService.deletarPauta({idCriador: req.usuario.id, idPauta,});
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
