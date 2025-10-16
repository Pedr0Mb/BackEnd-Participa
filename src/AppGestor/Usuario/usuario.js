import express from 'express';
import * as administradorController from './usuarioController.js';
import { autenticarToken } from '../../middlewares/autenticarToken.js';
import { verificarPermissao } from '../../middlewares/verificarPermissao.js';

const router = express.Router();

router.get(
  '/',
  autenticarToken,
  verificarPermissao(['Administrador']),
  administradorController.pesquisarUsuarioController
);

router.get(
  '/:id',
  autenticarToken,
  verificarPermissao(['Administrador']),
  administradorController.visualizarUsuarioController
);

router.put(
  '/:id',
  autenticarToken,
  verificarPermissao(['Administrador']),
  administradorController.editarUsuarioController
);

router.get(
  '/:id/historico',
  autenticarToken,
  verificarPermissao(['Administrador']),
  administradorController.verHistoricoController
);

router.patch(
  '/:id/promover',
  autenticarToken,
  verificarPermissao(['Administrador']),
  administradorController.promoverUser
)

router.patch(
  '/:id/desativar',
  autenticarToken,
  verificarPermissao(['Administrador']),
  administradorController.promoverUser
)

export default router;
    