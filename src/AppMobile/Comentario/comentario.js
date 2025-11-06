import express from 'express'
import * as comentarioController from './comentarioController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'

const router = express.Router()
router.use(autenticarToken)

router.post('/', comentarioController.criarComentarioController)
router.put('/:id', comentarioController.editarComentarioController)
router.delete('/:id', comentarioController.deletarComentarioController)

export default router
