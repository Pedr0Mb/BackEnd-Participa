import express from 'express'
import * as pautaController from './pautaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'

const router = express.Router()
router.use(autenticarToken)

router.get('/', pautaController.pesquisarPautaController)
router.get('/:id', pautaController.visualizarPautaController)
router.post('/voto/:idPauta/:idOpcao', pautaController.registrarVotoController)

export default router
