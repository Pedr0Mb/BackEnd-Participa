import express from 'express'
import * as debateController from './debateController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'

const router = express.Router()
router.use(autenticarToken)

router.get('/', debateController.pesquisarDebateController)
router.get('/:id', debateController.visualizarDebateController)
router.post('/', debateController.criarDebateController)
router.put('/:id', debateController.editarDebateController)
router.delete('/:id', debateController.removerDebateController)

export default router
