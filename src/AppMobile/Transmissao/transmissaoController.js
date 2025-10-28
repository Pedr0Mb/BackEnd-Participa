import * as transmissaoService from './transmissaoService.js'
import * as validacaoTransmissao from './transmissaoValidator.js'

export async function pesquisarTransmissaoController(req, res, next) {
  try {
    const { titulo } = validacaoTransmissao.SchemaPesquisarTransmissao.parse({titulo: req.query.titulo || null})
    const resultado = await transmissaoService.pesquisarTransmissao(titulo)

    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}

export async function visualizarTransmissaoController(req, res, next) {
  try {
    const { idTransmissao } = validacaoTransmissao.SchemaTransmissaoID.parse({ idTransmissao: Number(req.params.id) })
    const resultado = await transmissaoService.visualizarTransmissao(idTransmissao)

    return res.status(200).json(resultado)
  } catch (err) {
    next(err)
  }
}
