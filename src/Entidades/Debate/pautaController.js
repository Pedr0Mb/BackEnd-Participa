import * as pautaService from './pautaService.js'
import * as pautaValidation from './pautaValidator.js'

export async function pesquisarPautaController(req, res, next) {  
  try {
    const data = {
      idUsuario: req.body.idUsuario || null,
      titulo: req.body.titulo || null,
    }

    const parseData = pautaValidation.SchemaPesquisarPauta.parse(data);
    const pautas = await pautaService.pesquisarPauta(parseData);

    return res.status(200).json(pautas);

  } catch(err) {
    next(err);
  }
}

export async function visualizarPautaController(req, res, next) {
  try {
    const data = { idPauta: req.query.idPauta }

    const { idPauta } = pautaValidation.SchemaPautaId.parse(data);
    const resultado = await pautaService.visualizarPauta(idPauta);

    return res.status(200).json(resultado);

  } catch (err) {
    next(err);
  }
}

export async function criarPautaController(req, res, next) {  
  try {
    const idUsuario = req.usuario.id;

    const data = {
      idUsuario: req.usuario.id,
      titulo: req.body.titulo,
      descricoes: req.body.descricoes,
      arquivoFoto: req.file
    }

    const parseData = pautaValidation.SchemaCriarPauta.parse(data);
    const resultado = await pautaService.criarPauta({idUsuario, ...parseData});

    return res.status(201).json(resultado);

  } catch(err) {
    next(err);
  }
}

export async function editarPautaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = {
      idPauta: req.body.idPauta,
      titulo: req.body.titulo,
      descricoes: req.body.descricoes,
      arquivoFoto: req.file
    }

    const parseData = pautaValidation.SchemaEditarPauta.parse(data);
    const resultado = await pautaService.alterarPauta({idUsuario, ...parseData});

    return res.status(200).json(resultado);

  } catch(err) {
    next(err);
  }
}

export async function deletarPautaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = {
      idPauta: req.query.idPauta
    }

    const parseData = pautaValidation.SchemaPautaId.parse({ idPauta: data.idPauta });
    await pautaService.deletarPauta({ idUsuario, ...parseData });

    return res.status(200).json({ message: 'Pauta deletada com sucesso' });

  } catch(err) {
    next(err);
  }
}
