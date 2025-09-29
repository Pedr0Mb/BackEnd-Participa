import express from 'express'
import * as noticiaController from './noticiaController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'
import { verificarPermissao } from '../../middlewares/verificarPermissao.js'
import multer from 'multer'

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.get('/pesquisarNoticia', noticiaController.pesquisarNoticiaController)
router.get('/', noticiaController.visualizarNoticiaController)
router.post('/',autenticarToken,verificarPermissao('GestorPublico','Administrador', 'Publicar Noticia'),upload.single('fotoArquivo'),noticiaController.criarNoticiaController);
router.patch('/',autenticarToken,verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'),upload.single('fotoArquivo'),noticiaController.editarNoticiaController)
router.delete('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), noticiaController.deletarNoticiaController)

export default router;
