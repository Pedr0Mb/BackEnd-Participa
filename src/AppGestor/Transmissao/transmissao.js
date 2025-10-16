import express from 'express'
import * as transmissaoController from './transmissaoController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()

router.get(
    '/', 
    autenticarToken,
    transmissaoController.pesquisarTransmissaoController
)

router.get(
    '/:id', 
    autenticarToken,
    transmissaoController.visualizarTransmissaoController
)

router.post(
    '/',
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    transmissaoController.criarTransmissaoController
)

router.put(
    '/:id',
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    transmissaoController.editarTransmissaoController
)

router.patch(
    '/:id/publicar',
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    transmissaoController.publicarTransmissaoController
)

router.delete(
    '/:id',
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    transmissaoController.deletarTransmissaoController
)

export default router
