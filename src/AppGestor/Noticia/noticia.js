import express from 'express'
import * as noticiaController from './noticiaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()
router.use(autenticarToken, verificarPermissao(['gestor', 'administrador']))

router.get('/', noticiaController.pesquisarNoticiaController)
router.get('/:id', noticiaController.visualizarNoticiaController)
router.post('/', noticiaController.criarNoticiaController)
router.put('/:id', noticiaController.editarNoticiaController)
router.patch('/:id/publicar', noticiaController.publicarNoticiaController)
router.delete('/:id', noticiaController.deletarNoticiaController)

export default router
