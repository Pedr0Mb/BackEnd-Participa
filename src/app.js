import express from 'express'
import usuariosRoutes from './Entidades/Administrador/administrador.js'
import adiministradorRoutes from './Entidades/Administrador/administrador.js'
import noticiaRoutes from './Entidades/Noticia/noticia.js'
import transmissaoRoutes from './Entidades/Transmissao/transmissao.js'
import pautaRoutes from './Entidades/Debate/pauta.js'
import comentarioRoutes from './Entidades/Comentario/comentario.js'
import votacaoRoutes from './Entidades/Votacao/votacao.js'
import votoRoutes from './Entidades/Voto/voto.js'
import denunciaRoutes from './Entidades/Denuncia/denuncia.js'


const app = express()

app.use(express.json())

app.use('/usuario', usuariosRoutes);
app.use('/administrador', adiministradorRoutes);  
app.use('/noticias', noticiaRoutes)
app.use('/transmissao', transmissaoRoutes)
app.use('/pauta', pautaRoutes)
app.use('/comentario', comentarioRoutes)
app.use('/votacao', votacaoRoutes)
app.use('/voto', votoRoutes)
app.use('denuncia', denunciaRoutes)

app.use((err, req, res, next) => {
  console.error('Erro capturado:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      details: err.errors
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

export default app