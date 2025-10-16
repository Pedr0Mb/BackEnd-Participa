import * as transmissaoService from './transmissaoService.js'
import * as validacaoTransmissao from './transmissaoValidator.js'

export async function pesquisarTransmissaoController(req, res, next) {
  try {
    const filters = validacaoTransmissao.SchemaPesquisarTransmissao.parse({
      titulo: req.query.titulo || null,
      status: req.query.status || null
    })

    const resultado = await transmissaoService.pesquisarTransmissao(filters)
    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

export async function visualizarTransmissaoController(req, res, next) {
  try {
    const { idTransmissao } = validacaoTransmissao.SchemaTransmissaoID.parse({ 
      idTransmissao: Number(req.params.id) 
    })

    const resultado = await transmissaoService.visualizarTransmissao(idTransmissao)
    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

export async function criarTransmissaoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const data = validacaoTransmissao.SchemaCriarTransmissao.parse({
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      descricao: req.body.descricao,
      linkExterno: req.body.linkExterno,
      tema: req.body.tema,
      fonte: req.body.fonte,
      tempo: req.body.tempo,
      foto: req.body.foto,
      imagem: req.body.imagem
    })

    await transmissaoService.criarTransmissao({ idUsuario, ...data })
    return res.sendStatus(201)
  } catch (err) {
    next(err)
  }
}

export async function editarTransmissaoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = validacaoTransmissao.SchemaEditarTransmissao.parse({
      idTransmissao: Number(req.params.idTransmissao),
      titulo: req.body.titulo ,
      subtitulo: req.body.subtitulo ,
      descricao: req.body.descricao ,
      linkExterno: req.body.linkExterno ,
      tema: req.body.tema ,
      fonte: req.body.fonte ,
      tempo: req.body.tempo ,
      foto: req.body.foto ,
      imagem: req.body.imagem 
    });

    await transmissaoService.editarTransmissao({ idUsuario, ...data });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function publicarTransmissaoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id
    const { idTransmissao } = validacaoTransmissao.SchemaTransmissaoID.parse({ 
      idTransmissao: Number(req.params.idTransmissao) 
    })

    await transmissaoService.publicarTransmissao({ idUsuario, idTransmissao })
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export async function deletarTransmissaoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id
    const { idTransmissao } = validacaoTransmissao.SchemaTransmissaoID.parse({ 
      idTransmissao: Number(req.params.idTransmissao) 
    })
    
    await transmissaoService.deletarTransmissao({ idUsuario, idTransmissao })
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}
