import express from 'express';
import * as administradorController from './usuarioController.js';
import { autenticarToken } from '../../middlewares/autenticarToken.js';
import { verificarPermissao } from '../../middlewares/verificarPermissao.js';

const router = express.Router();

router.get(
  '/',
  autenticarToken,
  verificarPermissao(['administrador']),
  administradorController.pesquisarUsuarioController
);

router.get(
  '/:id',
  autenticarToken,
  verificarPermissao(['administrador']),
  administradorController.visualizarUsuarioController
);

router.put(
  '/:id',
  autenticarToken,
  verificarPermissao(['administrador']),
  administradorController.editarUsuarioController
);

router.get(
  '/:id/historico',
  autenticarToken,
  verificarPermissao(['administrador']),
  administradorController.verHistoricoController
);

router.patch(
  '/:id/promover',
  autenticarToken,
  verificarPermissao(['administrador']),
  administradorController.promoverUser
)

router.patch(
  '/:id/desativar',
  autenticarToken,
  verificarPermissao(['administrador']),
  administradorController.promoverUser
)

export default router;
    