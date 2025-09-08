import express from 'express';
import * as noticiaController from '../controllers/noticiaController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarNoticia', noticiaController.pesquisarNoticia)
router.get('/visualizarNoticia/:id', noticiaController.visualizarNoticia)

router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Publicar Noticia'), noticiaController.criarNoticia)

router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), noticiaController.alterarNoticia)

router.delete('/:id', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), noticiaController.deletarNoticia)

export default router;
