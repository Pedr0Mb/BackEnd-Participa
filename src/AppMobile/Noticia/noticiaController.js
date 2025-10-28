import * as noticiaService from './noticiaService.js';
import * as noticiaValidation from './noticiaValidator.js';

export async function pesquisarNoticiaController(req, res, next) {
  try {
    const filters = noticiaValidation.SchemaPesquisarNoticia.parse({
      titulo: req.query.titulo || null,
    });

    const noticias = await noticiaService.pesquisarNoticia({ ...filters });

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
