import express from 'express';
import * as transmissaoController from '../controllers/transmissaoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarTransmissao', transmissaoController.pesquisarTransmissao)
router.get('/visualizarTransmissao/:id', transmissaoController.visualizarTransmissao)

router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Agendar Transmissao'), transmissaoController.criarTransmissao)

router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), transmissaoController.alterarTransmissao)

router.delete('/:id', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), transmissaoController.deletarTransmissao)

export default router;
