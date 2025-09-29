import * as comentarioService from './comentarioService.js'
import * as comentarioValidator from './comentarioValidator.js'

export async function criarComentarioController(req, res, next) {
    try {
        const idUsuario = req.usuario.id;

        const data = {
            texto: req.body.texto,
            idPauta: req.body.idPauta
        };

        const parseData = comentarioValidator.SchemaCriarComentario.parse(data);
        const resultado = await comentarioService.criarComentario({ 
            idUsuario, 
            ...parseData 
        });

        return res.status(201).json(resultado);

    } catch (err) {
        next(err);
    }
}

export async function editarComentarioController(req, res, next) {
    try {
        const idUsuario = req.usuario.id;

        const data = {
            texto: req.body.texto,
            idComentario: req.body.idComentario
        };

        const parseData = comentarioValidator.SchemaEditarComentario.parse(data);

        const resultado = await comentarioService.editarComentario({ 
            idUsuario, 
            ...parseData
        });

        return res.status(200).json(resultado);

    } catch (err) {
        next(err);
    }
}

export async function deletarComentarioController(req, res, next) {
    try {
        const idUsuario = req.usuario.id;

        const data = { 
            idComentario: req.query.idComentario,
            idPauta: req.query.idPauta,
            texto: req.query.texto 
        };

        const parseData = comentarioValidator.SchemaDeletarComentario.parse(data);

        await comentarioService.deletarComentario({ 
            idUsuario, 
            ...parseData
        });

        return res.status(200).json({ message: 'Comentário deletado com sucesso' });

    } catch (err) {
        next(err);
    }
}
