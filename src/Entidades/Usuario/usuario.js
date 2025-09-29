import express from 'express'
import multer from 'multer'
import * as userController from './usuariosController.js'
import { autenticarToken } from '../../middlewares/autenticarToken.js'

const upload = multer({ storage: multer.memoryStorage() }); 
const router = express.Router();

router.post('/', userController.criarUsuarioController)
router.get('/', autenticarToken, userController.verUsuarioController)
router.get('/historico', autenticarToken, userController.verHistoricoController)
router.patch('/', autenticarToken, upload.single('foto'), userController.editarUsuarioController)

export default router
