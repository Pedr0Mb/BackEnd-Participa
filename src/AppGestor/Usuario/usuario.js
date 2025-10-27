import express from 'express';
import * as administradorController from './usuarioController.js';
import { autenticarToken } from '../../middlewares/autenticarToken.js';
import { verificarPermissao } from '../../middlewares/verificarPermissao.js';

const router = express.Router();
router.use(autenticarToken,verificarPermissao(['administrador']));

router.get('/',administradorController.pesquisarUsuarioController);
router.get('/:id',administradorController.visualizarUsuarioController);
router.put('/:id',administradorController.editarUsuarioController);
router.get('/:id/historico',administradorController.verHistoricoController);
router.patch('/:id/promover',administradorController.promoverUser)
router.patch('/:id/desativar',administradorController.promoverUser)

export default router;
    