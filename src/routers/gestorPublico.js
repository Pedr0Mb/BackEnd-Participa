import express from 'express';
import * as gestorController from '../controllers/gestorPublicoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarUsuario', autenticarToken, verificarPermissao('Administrador'), gestorController.pesquisarUsuario)
router.get('/visualizarUsuario', autenticarToken, verificarPermissao('Administrador'), gestorController.visualizarUsuario)
router.patch('/promoverUsuario', autenticarToken, verificarPermissao('Administrador'), gestorController.promoverUsuario)

export default router;
