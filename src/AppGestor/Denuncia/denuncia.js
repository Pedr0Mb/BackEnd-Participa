import express from 'express'
import * as denunciaController from './denunciaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()
router.use(autenticarToken, verificarPermissao(['gestor', 'administrador']));

router.get('/:id',  denunciaController.visualizarDenunciaController)
router.get('/',  denunciaController.pesquisarDenunciaController)
router.post('/:id/verificar',   denunciaController.verificarDenunciaController)
router.delete('/:id',  denunciaController.removerDenunciaController)

export default router