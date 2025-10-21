import * as noticiaService from './noticiaService.js';
import * as noticiaValidation from './noticiaValidator.js';

export async function pesquisarNoticiaController(req, res, next) {
  try {
    const filters = noticiaValidation.SchemaPesquisarNoticia.parse({
      titulo: req.query.titulo || null,
      status: req.query.status || null,
    });

    const noticias = await noticiaService.pesquisarNoticia(filters);
    return res.status(200).json(noticias);
  } catch (err) {
    next(err);
  }
}

export async function visualizarNoticiaController(req, res, next) {
  try {
    const { idNoticia } = noticiaValidation.SchemaNoticiaId.parse({
      idNoticia: Number(req.params.id),
    });

    const noticia = await noticiaService.visualizarNoticia(idNoticia);
    return res.status(200).json(noticia);
  } catch (err) {
    next(err);
  }
}

export async function criarNoticiaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = noticiaValidation.SchemaCriarNoticia.parse({
      titulo: req.body.titulo,
      tema: req.body.tema,
      fonte: req.body.fonte,
      resumo: req.body.resumo,
      linkExterno: req.body.linkExterno,
      imagem: req.body.imagem,
    });

    await noticiaService.criarNoticia({ idUsuario, ...data });
    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
}

export async function editarNoticiaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = noticiaValidation.SchemaEditarNoticia.parse({
      idNoticia: Number(req.params.id),
      titulo: req.body.titulo,
      tema: req.body.tema,
      fonte: req.body.fonte,
      resumo: req.body.resumo,
      linkExterno: req.body.linkExterno,
      imagem: req.body.imagem,
    });

    await noticiaService.editarNoticia({ idUsuario, ...data });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function publicarNoticiaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const { idNoticia } = noticiaValidation.SchemaNoticiaId.parse({
      idNoticia: Number(req.params.id),
    });

    await noticiaService.publicarNoticia({ idUsuario, idNoticia });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function deletarNoticiaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const { idNoticia } = noticiaValidation.SchemaNoticiaId.parse({
      idNoticia: Number(req.params.id),
    });

    await noticiaService.deletarNoticia({ idUsuario, idNoticia });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
