import express from 'express';
import * as comentarioController from './comentarioController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js';

const router = express.Router();

router.post('/', autenticarToken, comentarioController.criarComentarioController)

router.patch('/', autenticarToken, comentarioController.editarComentarioController)

router.delete('/', autenticarToken, comentarioController.deletarComentarioController)

export default router;
