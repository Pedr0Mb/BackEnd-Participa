import express from 'express';
import * as debateController from './debateController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js';

const  router = express.Router();

router.get(
    '/', 
    autenticarToken,
    debateController.pesquisarDebateController
)

router.get(
    '/:id', 
    autenticarToken,
    debateController.visualizarDebateController
)

router.put(
    '/:id', 
    autenticarToken, 
    debateController.editarDebateController
)

router.delete(
    '/:id', 
    autenticarToken, 
    debateController.removerDebateController
)

export default router;
