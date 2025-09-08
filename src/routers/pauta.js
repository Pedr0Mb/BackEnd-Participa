import express from 'express';
import * as pautaController from '../controllers/pautaController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';

const router = express.Router();

router.get('/pesquisarPauta', pautaController.pesquisarPauta)
router.get('/visualizarPauta/:id', pautaController.visualizarPauta)

router.post('/', autenticarToken, pautaController.criarPauta)

router.patch('/', autenticarToken, pautaController.alterarPauta)

router.delete('/:id', autenticarToken, pautaController.deletarPauta)

export default router;
