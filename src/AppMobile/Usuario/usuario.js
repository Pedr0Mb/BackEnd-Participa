import express from 'express'
import * as userController from './usuariosController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'

const router = express.Router();

router.post(
    '/', 
    userController.criarUsuarioController
)

router.get(
    '/', 
    autenticarToken, 
    userController.verUsuarioController
)

router.get(
    '/historico', 
    autenticarToken, 
    userController.verHistoricoController
)

router.put(
    '/', 
    autenticarToken, 
    userController.editarUsuarioController
)

router.get(
    '/preferencia', 
    autenticarToken, 
    userController.visualizarPreferencias
)

router.put(
    '/preferencia',
     autenticarToken, 
     userController.editarPreferenciasController
)

router.put(
    '/notificacao', 
    autenticarToken,
    userController.editarNotificacoesController
)

router.put(
    '/categoria', 
    autenticarToken, 
    userController.editarCategoriasController
)

export default router
