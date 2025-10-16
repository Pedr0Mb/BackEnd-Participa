import express from 'express'
import * as transmissaoController from './transmissaoController.js'

const router = express.Router()

router.get('/', transmissaoController.pesquisarTransmissaoController)
router.get('/:id', transmissaoController.visualizarTransmissaoController)

export default router
