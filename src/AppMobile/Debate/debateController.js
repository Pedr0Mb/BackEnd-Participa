import * as debateService from './debateService.js'
import * as debateValidator from './debateValidator.js'

export async function pesquisarDebateController(req, res, next) {  
  try {
    const data = debateValidator.SchemaPesquisarPauta.parse({
      idUsuario: req.query.idUsuario ? Number(req.query.idUsuario) : null,
      titulo: req.query.titulo || null,
    });

    const pautas = await debateService.pesquisarPauta(data);
    return res.status(200).json(pautas);
  } catch(err) {
    next(err);
  }
}

export async function visualizarDebateController(req, res, next) {
  try {
    const { idDebate } = debateValidator.SchemaPautaId.parse({ idDebate: Number(req.params.id) });
    const pauta = await debateService.visualizarPauta(idDebate);
    return res.status(200).json(pauta);
  } catch (err) {
    next(err);
  }
}

export async function criarDebateController(req, res, next) {  
  try {
    const data = debateValidator.SchemaCriarPauta.parse({
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      tema: req.body.tema,
      descricoes: req.body.descricoes,
      imagem: req.body.imagem
    });

    await debateService.criarPauta({ idAutor: req.usuario.id, ...data });
    return res.sendStatus(201);
  } catch(err) {
    next(err);
  }
}

export async function editarDebateController(req, res, next) {
  try {
    const data = debateValidator.SchemaEditarPauta.parse({
      idDebate: Number(req.params.id),
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      tema: req.body.tema,
      descricoes: req.body.descricoes,
      imagem: req.body.imagem 
    });

    await debateService.editarPauta({ idUsuario: req.usuario.id, ...data });
    return res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}

export async function removerDebateController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;
    const { idDebate } = debateValidator.SchemaPautaId.parse({ idDebate: Number(req.params.id) });
    await debateService.deletarPauta({ idUsuario, idDebate });
    return res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}
