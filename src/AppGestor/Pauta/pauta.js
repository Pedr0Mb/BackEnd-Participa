import express from 'express'
import * as votacaoController from './pautaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router();

router.get(
    '/',
    autenticarToken,
     votacaoController.pesquisarPautaController
)

router.get(
    '/:id', 
    autenticarToken,
    votacaoController.visualizarPautaController
)

router.post(
    '/', 
    autenticarToken, 
    verificarPermissao(['GestorPublico','Administrador']),
     votacaoController.criarPautaController
)

router.put(
    '/:id', 
    autenticarToken, 
    verificarPermissao(['GestorPublico','Administrador']), 
    votacaoController.editarPautaController
)

router.patch(
    '/:id/publicar',
     autenticarToken, 
     verificarPermissao(['GestorPublico','Administrador']), 
     votacaoController.publicarPautaController
)

router.delete(
    '/:id', 
    autenticarToken, 
    verificarPermissao(['GestorPublico','Administrador']),
     votacaoController.deletarPautaController
)


export default router;
