import * as usuarioServices from './usuarioServices.js'
import * as validacaoUsuario from './usuarioValidator.js'

export async function criarUsuarioController(req,res,next) {
    try{
        const data = {
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,  
            cpf: req.body.cpf,
            provider: req.body.provider
        }

        const parseData = validacaoUsuario.SchemaCriarUsuario.parse(data);
        const resultado = await usuarioServices.criarUsuario(parseData)

        return res.status(201).json(resultado)

    }catch(err){
       next(err)
    }
}

export async function verUsuarioController(req,res,next) {
    try{
        const idUsuario = req.usuario.id
        const resultado = await usuarioServices.verUsuario(idUsuario)

        return res.status(200).json(resultado)

    }catch(err){
        next(err)
    }
}

export async function verHistoricoController(req,res,next) {
    try {
        const idUsuario = req.usuario.id

        const data = { tipoAtividade: req.query.tipoAtividade || null }

        const parseData = validacaoUsuario.SchemaVerHistorico.parse(data);
        const historico = await usuarioServices.verHistorico({idUsuario,...parseData})

        return res.status(200).json(historico)
    
    } catch (err) {
        next(err)
    }
}

export async function editarUsuarioController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const data = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      fotoUrl: req.body.fotoUrl,
      arquivoFoto: req.file
    };

    const parseData = validacaoUsuario.SchemaEditarUsuario.parse(data);
    const resultado = await usuarioServices.editarUsuario({idUsuario,...parseData});

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function editarPreferenciasController(req,res,next) {
    try {
        const idUsuario = req.usuario.id
    
        const data = {
            idPreferencia: req.body.idPreferencia,
            temaSistema: req.body.temaSistema,
        }
    
        const parsedData = validacaoUsuario.SchemaEditarPreferencia.parse(data)
        const resultado = usuarioServices.editarPreferencias({idUsuario, ...parsedData})
    
        return res.status(200).json(resultado)
    
    } catch (err) {
        next(err)    
    }
}

export async function editarNotificacoesController(req,res,next) {
    try {
        const idUsuario = req.usuario.id
    
        const data = {
            idPreferencia: req.body.idPreferencia,
            tipoNotificacao: req.body.tema,
            preferenciaNotificacao: req.body.preferenciaNotificacao
        }
    
        const parsedData = validacaoUsuario.SchemaEditarNotificacoes.parse(data)
        const resultado = usuarioServices.editarNotificacoes({idUsuario, ...parsedData})
    
        return res.status(200).json(resultado)
    } catch (err) {
        
    }
}

export async function editarCategoriasController(req,res,next) {
    try {
        const idUsuario = req.usuario.id
    
        const data = {
            idPreferencia: req.body.idPreferencia,
            categorias: req.body.categorias
        }
    
        const parsedData = validacaoUsuario.SchemaeditarCategoria.parse(data)
        const resultado = usuarioServices.editarCategorias({idUsuario, ...parsedData})
    
        return res.status(200).json(resultado)
    
    } catch (err) {
        next(err)    
    }
}

export async function visualizarPreferencias(req,res,next) {
    try {
        const idUsuario = req.usuario.id

        const resultado = usuarioServices.verPreferencias(idUsuario)

        return res.status(200).json(resultado)
    } catch (err) {
        next(err)
    }
}