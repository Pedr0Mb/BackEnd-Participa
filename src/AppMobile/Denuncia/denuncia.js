import express from 'express'
import * as denunciaController from './denunciaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'

const router = express.Router()

router.post('/', autenticarToken, denunciaController.enviarDenunciaController)

export default router