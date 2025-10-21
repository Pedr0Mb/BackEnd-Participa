import express from 'express'
import * as transmissaoController from './transmissaoController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()
router.use(autenticarToken, verificarPermissao(['gestor', 'administrador']));

router.get('/', transmissaoController.pesquisarTransmissaoController)
router.get('/:id', transmissaoController.visualizarTransmissaoController)
router.post('/',transmissaoController.criarTransmissaoController)
router.put('/:id',transmissaoController.editarTransmissaoController)
router.patch('/:id/publicar',transmissaoController.publicarTransmissaoController)
router.delete('/:id',transmissaoController.deletarTransmissaoController)

export default router
