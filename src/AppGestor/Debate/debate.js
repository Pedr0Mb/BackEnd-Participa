import express from 'express'
import * as debateController from './debateController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()
router.use(autenticarToken, verificarPermissao(['gestor', 'administrador']))

router.get('/', debateController.pesquisarDebateController)
router.get('/:id', debateController.visualizarDebateController)
router.put('/:id', debateController.editarDebateController)
router.delete('/:id', debateController.removerDebateController)

export default router
