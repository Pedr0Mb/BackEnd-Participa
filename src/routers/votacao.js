import express from 'express';
import * as votacaoController from '../controllers/votacaoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarVotacao', votacaoController.pesquisarVotacoes)
router.get('/visualizarVotacao/:id', votacaoController.visualizarVotacao)

router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Publicar Votacao'), votacaoController.criarVotacao)

router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), votacaoController.alterarVotacao)

router.delete('/:id', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), votacaoController.deletarVotacao)

export default router;
