import express from 'express';
import * as adiministradorController from './administradorController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js';
import { verificarPermissao } from '../../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarUsuario', autenticarToken, verificarPermissao('Administrador'), adiministradorController.pesquisarUsuarioController)
router.get('/visualizarUsuario', autenticarToken, verificarPermissao('Administrador'), adiministradorController.visualizarUsuarioController)
router.patch('/editarUsuario', autenticarToken, verificarPermissao('Administrador'), adiministradorController.editarUsuarioController)
router.get('/verHistorico', autenticarToken, verificarPermissao('Administrador'), adiministradorController.verHistoricoController)

export default router;
