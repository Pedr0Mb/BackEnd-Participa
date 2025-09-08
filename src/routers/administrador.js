import express from 'express';
import * as adiministradorController from '../controllers/administradorController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarUsuario', autenticarToken, verificarPermissao('Administrador'), adiministradorController.pesquisarUsuario)
router.get('/visualizarUsuario/:id', autenticarToken, verificarPermissao('Administrador'), adiministradorController.visualizarUsuario)
router.patch('/promoverUsuario', autenticarToken, verificarPermissao('Administrador'), adiministradorController.promoverUsuario)
router.get('/verHistorico', autenticarToken, verificarPermissao('Administrador'), adiministradorController.verHistoricoUsuario)

export default router;
