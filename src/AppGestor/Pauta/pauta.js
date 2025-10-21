import express from 'express'
import * as pautaController from './pautaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router();
router.use(autenticarToken, verificarPermissao(['gestor', 'administrador']));

router.get('/', pautaController.pesquisarPautaController)
router.get('/:id', pautaController.visualizarPautaController)
router.post('/', pautaController.criarPautaController)
router.put('/:id', pautaController.editarPautaController)
router.patch('/:id/publicar',pautaController.publicarPautaController)
router.delete('/:id', pautaController.deletarPautaController)

export default router;
