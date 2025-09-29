import express from 'express';
import multer from 'multer';
import * as pautaController from './pautaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js';

const upload = multer({ storage: multer.memoryStorage() }); 
const router = express.Router();

router.get('/pesquisarPauta', pautaController.pesquisarPautaController)
router.get('/', pautaController.visualizarPautaController)
router.post('/', autenticarToken, upload.single('foto'), pautaController.criarPautaController)
router.patch('/', autenticarToken, upload.single('foto'), pautaController.editarPautaController)
router.delete('/', autenticarToken, pautaController.deletarPautaController)

export default router;
