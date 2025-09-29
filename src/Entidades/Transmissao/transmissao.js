import express from 'express';
import multer from 'multer';
import * as transmissaoController from './transmissaoController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js';
import { verificarPermissao } from '../../middlewares/verificarPermissao.js';

const upload = multer({ storage: multer.memoryStorage() }); 
const router = express.Router();

router.get('/pesquisarTransmissao', transmissaoController.PesquisarTransmissaoController)
router.get('/', transmissaoController.VisualizarTransmissaoController)
router.post('/',autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Agendar Transmissao'), upload.single('foto'), transmissaoController.CriarTransmissaoController, )
router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'),  upload.single('foto'), transmissaoController.editarTransmissaoController)
router.delete('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), transmissaoController.deletarTransmissaoController)

export default router;
