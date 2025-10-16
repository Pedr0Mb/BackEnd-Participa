import * as comentarioService from './comentarioService.js'
import * as comentarioValidator from './comentarioValidator.js'

export async function criarComentarioController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const data = comentarioValidator.SchemaCriarComentario.parse({
      texto: req.body.texto,
      idDebate: Number(req.body.idDebate),
      parentComentario: req.body.parentComentario || null
    })

    await comentarioService.criarComentario({ idUsuario, ...data })
    return res.sendStatus(201)
  } catch (err) {
    next(err)
  }
}

export async function editarComentarioController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const data = comentarioValidator.SchemaEditarComentario.parse({
      idComentario: Number(req.params.id),
      texto: req.body.texto
    })

    await comentarioService.editarComentario({ idUsuario, ...data })
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

export async function deletarComentarioController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const data = comentarioValidator.SchemaDeletarComentario.parse({
      idComentario: Number(req.params.idComentario)
    })

    await comentarioService.deletarComentario({ idUsuario, ...data })
    return res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}
