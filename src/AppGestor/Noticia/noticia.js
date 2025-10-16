import express from 'express'
import * as noticiaController from './noticiaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()

router.get(
    '/', 
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    noticiaController.pesquisarNoticiaController
)

router.get(
    '/:id', 
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    noticiaController.visualizarNoticiaController
)

router.post(
    '/',
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    noticiaController.criarNoticiaController
)

router.put(
    '/:id',
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    noticiaController.editarNoticiaController
)

router.patch(
    '/:id/publicar',
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    noticiaController.publicarNoticiaController
)

router.delete(
    '/:id',
    autenticarToken,
    verificarPermissao(['GestorPublico', 'Administrador']),
    noticiaController.deletarNoticiaController
)

export default router
