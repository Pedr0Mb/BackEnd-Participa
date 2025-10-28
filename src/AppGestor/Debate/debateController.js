import * as debateService from './debateService.js';
import * as debateValidator from './debateValidator.js';

export async function pesquisarDebateController(req, res, next) {  
  try {
    const data = debateValidator.SchemaPesquisarDebate.parse({
      titulo: req.query.titulo || null,
    });

    const pautas = await debateService.pesquisarDebate(data);
    return res.status(200).json(pautas);
  } catch(err) {
    next(err);
  }
}

export async function visualizarDebateController(req, res, next) {
  try {
    const { idDebate } = debateValidator.SchemaDebateId.parse({ idDebate: Number(req.params.id) });

    const resultado = await debateService.visualizarDebate(idDebate);
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function editarDebateController(req, res, next) {
  try {
    const parseData = debateValidator.SchemaEditarDebate.parse({
      idDebate: Number(req.params.id),
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      tema: req.body.tema,
      descricoes: req.body.descricoes,
      imagem: req.body.imagem 
    });

    await debateService.editarDebate({ idUsuario: req.usuario.id, ...parseData });
    return res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}

export async function removerDebateController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;
    const { idDebate } = debateValidator.SchemaDebateId.parse({ idDebate: Number(req.params.id) });
    if (isNaN(idDebate)) return res.status(400).json({ error: 'ID inválido' });

    await debateService.deletarDebate({ idUsuario, idDebate });
    return res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}
