import express from 'express'
import authRoutes from './Auth/auth.js'
import comentarioRoutes from './Comentario/comentario.js'
import debateRoutes from './Debate/debate.js'
import denunciaRoutes from './Denuncia/denuncia.js'
import noticiaRoutes from './Noticia/noticia.js'
import pautasRoutes from './Pauta/pauta.js'
import transmissaoRoutes from './Transmissao/transmissao.js'
import usuariosRoutes from './Usuario/usuario.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/comentarios', comentarioRoutes)
router.use('/debates', debateRoutes)
router.use('/denuncias', denunciaRoutes)
router.use('/noticias', noticiaRoutes)
router.use('/pautas', pautasRoutes)
router.use('/transmissoes', transmissaoRoutes)
router.use('/usuarios', usuariosRoutes)


export default router
