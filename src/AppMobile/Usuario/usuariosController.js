import * as usuarioServices from './usuarioServices.js'
import * as validacaoUsuario from './usuarioValidator.js'

export async function criarUsuarioController(req, res, next) {
  try {
    const data = validacaoUsuario.SchemaCriarUsuario.parse({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,  
      cpf: req.body.cpf,
      provider: req.body.provider || 'local',
    });

    await usuarioServices.criarUsuario(data);
    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
}

export async function verUsuarioController(req, res, next) {
  try {
    const resultado = await usuarioServices.verUsuario(Number(req.usuario.id));
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function verHistoricoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;
    const { tipo } = validacaoUsuario.SchemaVerHistorico.parse({ tipo: req.query.tipo || null });
    const historico = await usuarioServices.verHistorico({ idUsuario, tipo });

    return res.status(200).json(historico);
  } catch (err) {
    next(err);
  }
}

export async function visualizarPreferencias(req, res, next) {
  try {
    const resultado = await usuarioServices.verPreferencias({ idUsuario: req.usuario.id });
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function editarUsuarioController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = validacaoUsuario.SchemaEditarUsuario.parse({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      fotoUrl: req.body.fotoUrl
    });

    await usuarioServices.editarUsuario({ idUsuario, ...data });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function editarPreferenciasController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = validacaoUsuario.SchemaEditarPreferencia.parse({
      tema: req.body.tema,
    });

    await usuarioServices.editarPreferencias({ idUsuario, ...data });
    return res.sendStatus(204);
  } catch (err) {
    next(err);    
  }
}

export async function editarNotificacoesController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = validacaoUsuario.SchemaEditarNotificacoes.parse({
      tipoNotificacao: req.body.tema,
      preferenciaNotificacao: req.body.preferenciaNotificacao
    });

    await usuarioServices.editarNotificacoes({ idUsuario, ...data });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function editarCategoriasController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = validacaoUsuario.SchemaeditarCategoria.parse({
      categorias: req.body.categorias
    });

    await usuarioServices.editarCategorias({ idUsuario, ...data });
    return res.sendStatus(204);
  } catch (err) {
    next(err);    
  }
}
