import express from 'express'
import * as denunciaController from './denunciaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()

router.post('/' , autenticarToken, denunciaController.enviarDenunciaController)
router.get('/', autenticarToken, verificarPermissao('GestorPublico','Adiministrador','Moderar Conteúdo'), denunciaController.pesquisarDenunciaController)
router.post('/VerificarDenuncia', autenticarToken,  verificarPermissao('GestorPublico','Adiministrador','Moderar Conteúdo'), denunciaController.verificarDenunciaController)

export default router