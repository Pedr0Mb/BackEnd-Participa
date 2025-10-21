import express from 'express'
import * as authController from './authController.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js';

const router = express.Router();

router.post(
    '/', 
    verificarPermissao(['gestor', 'administrador']),
    authController.loginCpfController
)

export default router
