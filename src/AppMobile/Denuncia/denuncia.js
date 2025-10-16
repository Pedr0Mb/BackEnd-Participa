import express from 'express'
import * as denunciaController from './denunciaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()

router.post('/' , autenticarToken, denunciaController.enviarDenunciaController)
router.get('/', autenticarToken, verificarPermissao(['GestorPublico','Adiministrador']), denunciaController.visualizarDenunciaController)
router.get('/pesquisar', autenticarToken, verificarPermissao(['GestorPublico','Adiministrador']), denunciaController.pesquisarDenunciaController)
router.post('/verificar', autenticarToken,  verificarPermissao(['GestorPublico','Adiministrado']), denunciaController.verificarDenunciaController)
router.delete('/excluir', autenticarToken,  verificarPermissao(['GestorPublico','Adiministrado']), denunciaController.removerDenunciaController)

export default router