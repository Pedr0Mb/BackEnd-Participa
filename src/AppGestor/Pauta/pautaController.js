import * as pautaService from './pautaService.js';
import * as pautaValidator from './pautaValidator.js';

function parseDate(dateStr) {
  return dateStr ? new Date(dateStr) : null;
}

export async function pesquisarPautaController(req, res, next) {
  try {
    const filters = pautaValidator.SchemaPesquisarPauta.parse({
      status: req.query.status || null,
      titulo: req.query.titulo || null,
    });

    const pautas = await pautaService.pesquisarPauta(filters);
    return res.status(200).json(pautas);
  } catch (err) {
    next(err);
  }
}

export async function visualizarPautaController(req, res, next) {
  try {
    const { idPauta } = pautaValidator.SchemaPautaID.parse({
      idPauta: Number(req.params.id),
    });

    const pauta = await pautaService.visualizarPauta(idPauta);
    return res.status(200).json(pauta);
  } catch (err) {
    next(err);
  }
}

export async function criarPautaController(req, res, next) {
  try {
    const data = pautaValidator.SchemaCriarPauta.parse({
      titulo: req.body.titulo,
      descricoes: req.body.descricoes,
      opcoes: req.body.opcoes,
      imagem: req.body.imagem,
      inicioVotacao: parseDate(req.body.inicioVotacao),
      fimVotacao: parseDate(req.body.fimVotacao),
      tema: req.body.tema,
    });

    await pautaService.criarPauta({ idCriador: req.usuario.id, ...data });
    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
}

export async function editarPautaController(req, res, next) {
  try {
    const data = pautaValidator.SchemaEditarPauta.parse({
      id: Number(req.params.id),
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      opcoes: req.body.opcoes,
      imagem: req.body.imagem,
      inicioVotacao: parseDate(req.body.inicioVotacao),
      fimVotacao: parseDate(req.body.fimVotacao),
      tema: req.body.tema,
    });

    await pautaService.editarPauta({ idCriador: req.usuario.id, ...data });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function publicarPautaController(req, res, next) {
  try {
    const { idPauta } = pautaValidator.SchemaPautaID.parse({
      idPauta: Number(req.params.id),
    });

    await pautaService.publicarPauta({ idCriador: req.usuario.id, idPauta });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function deletarPautaController(req, res, next) {
  try {
    const { idPauta } = pautaValidator.SchemaPautaID.parse({
      idPauta: Number(req.params.id),
    });

    await pautaService.deletarPauta({ idCriador: req.usuario.id, idPauta });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
