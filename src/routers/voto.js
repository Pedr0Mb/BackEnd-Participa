import express from 'express';
import * as votoController from '../controllers/votoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';

const router = express.Router();

router.post('/', autenticarToken, votoController.registrarVoto)

export default router;
