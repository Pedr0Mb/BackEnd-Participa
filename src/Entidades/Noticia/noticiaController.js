import * as noticiaService from './noticiaService.js'
import * as noticiaValidation from './noticiaValidator.js'

export async function pesquisarNoticiaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const data = { titulo: req.query.titulo || null,}

    const parseData = noticiaValidation.SchemaPesquisarNoticia.parse(data)
    const noticias = await noticiaService.pesquisarNoticia({idUsuario, ...parseData})

    return res.status(200).json(noticias)
  } catch (err) {
    next(err)
  }
}

export async function visualizarNoticiaController(req, res, next) {
  try {
    const data = { idNoticia: req.query.idNoticia }

    const { idNoticia } = noticiaValidation.SchemaNoticiaId.parse(data)
    const noticia = await noticiaService.visualizarNoticia(idNoticia) 

    return res.status(200).json(noticia)

  } catch (err) {
    next(err)
  }
}

export async function criarNoticiaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = {
      titulo: req.body.titulo,
      tema: req.body.tema,
      fonte: req.body.fonte,
      resumo: req.body.resumo,
      link_externo: req.body.link_externo,
      arquivoFoto: req.file 
    };

    const parseData = noticiaValidation.SchemaCriarNoticia.parse(data);
    const resultado = await noticiaService.criarNoticia({ idUsuario, ...parseData });

    return res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function editarNoticiaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = {
      idNoticia: req.body.idNoticia,
      titulo: req.body.titulo,
      tema: req.body.tema,
      fonte: req.body.fonte,
      resumo: req.body.resumo,
      link_externo: req.body.link_externo,
      arquivoFoto: req.file 
    };

    const parseData = noticiaValidation.SchemaEditarNoticia.parse(data);
    const resultado = await noticiaService.editarNoticia({ idUsuario, ...parseData });

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

      
export async function deletarNoticiaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const data = { idNoticia: req.query.idNoticia }

    const { idNoticia } = noticiaValidation.SchemaNoticiaId.parse(data)
    const resultado = await noticiaService.deletarNoticia({ idUsuario, idNoticia, })

    return res.status(200).json(resultado)

  } catch (err) {
    next(err)  
  }
}