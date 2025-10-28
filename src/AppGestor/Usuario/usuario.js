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
router.patch('/:id/promover',administradorController.promoverUserController)
router.patch('/:id/rebaixar',administradorController.rebaixarUserController)
router.patch('/:id/desativar',administradorController.desativarUserController)
router.patch('/:id/ativar',administradorController.ativarUserController)

export default router;
    