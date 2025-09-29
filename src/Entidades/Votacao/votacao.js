import express from 'express'
import multer from 'multer'
import * as votacaoController from './votacaoController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.get('/pesquisarVotacao', votacaoController.pesquisarVotacaoController)
router.get('/', votacaoController.visualizarVotacaoController)
router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Publicar Votacao'), upload.single('fotoArquivo'),  votacaoController.criarVotacaoController)
router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), upload.single('fotoArquivo'), votacaoController.editarVotacaoController)
router.delete('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), votacaoController.deletarVotacaoController)

export default router;
