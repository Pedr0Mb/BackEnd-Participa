import express from 'express'
import * as denunciaController from './denunciaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router()

router.get(
    '/:id', 
    autenticarToken, 
    verificarPermissao(['GestorPublico','Adiministrador']), 
    denunciaController.visualizarDenunciaController
)

router.get(
    '/', 
    autenticarToken, 
    verificarPermissao(['GestorPublico','Adiministrador']), 
    denunciaController.pesquisarDenunciaController
)

router.post(
    '/:id/verificar', 
    autenticarToken,  
    verificarPermissao(['GestorPublico','Adiministrado']),
     denunciaController.verificarDenunciaController
    )

router.delete(
    '/:id', 
    autenticarToken, 
     verificarPermissao(['GestorPublico','Adiministrado']), 
     denunciaController.removerDenunciaController
    )

export default router