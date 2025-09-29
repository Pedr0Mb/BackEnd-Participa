import * as transmissaoService from './transmissaoService.js'
import * as validacaoTransmissao from './transmissaoValidator.js'

// ================= Pesquisar transmissões =================
export async function PesquisarTransmissaoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id
    const data = { titulo: req.body.titulo || null }

    const parseData = validacaoTransmissao.SchemaPesquisarTransmissao.parse(data)
    const resultado = await transmissaoService.pesquisarTransmissao({ idUsuario, ...parseData })

    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

// ================= Visualizar transmissão =================
export async function VisualizarTransmissaoController(req, res, next) {
  try {
    const data = { idTransmissao: req.query.idTransmissao }
    const { idTransmissao } = validacaoTransmissao.SchemaTransmissaoID.parse(data)

    const resultado = await transmissaoService.visualizarTransmissao(idTransmissao)
    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

// ================= Criar transmissão =================
export async function CriarTransmissaoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id

    const data = {
      titulo: req.body.titulo,
      subTitulo: req.body.subTitulo,
      descricao: req.body.descricao,
      link: req.body.link,
      tema: req.body.tema,
      fonte: req.body.fonte,
      tempo: req.body.tempo,
      arquivoFoto: req.file
    }
    
    const parseData = validacaoTransmissao.SchemaCriarTransmissao.parse(data)
    const resultado = await transmissaoService.criarTransmissao({ idUsuario, ...parseData})
    
    return res.status(201).json(resultado)
  } catch (err) {
    next(err)
  }
}

// ================= Editar transmissão =================
export async function editarTransmissaoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id
    
    const data = {
      idTransmissao: req.body.idTransmissao,
      titulo: req.body.titulo,
      subTitulo: req.body.subTitulo,
      descricao: req.body.descricao,
      link: req.body.link ,
      tema: req.body.tema,
      fonte: req.body.fonte,
      tempo: req.body.tempo,
      arquivoFoto: req.file
    }

    const parseData = validacaoTransmissao.SchemaEditarTransmissao.parse(data)
    const resultado = await transmissaoService.editarTransmissao({ idUsuario, ...parseData})

    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

// ================= Deletar transmissão =================
export async function deletarTransmissaoController(req, res, next) {
  try {
    const idUsuario = req.usuario.id
    const data = { idTransmissao: req.query.idTransmissao }

    const { idTransmissao } = validacaoTransmissao.SchemaTransmissaoID.parse(data)
    const resultado = await transmissaoService.deletarTransmissao({ idUsuario, idTransmissao })

    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}
