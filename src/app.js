import express from 'express';
import appUser from './AppMobile/appUser.js';
import appGestor from './AppGestor/appGestor.js';

const app = express();
app.use(express.json());

const apiRouter = express.Router();

apiRouter.use('/app', appUser);
apiRouter.use('/gestor', appGestor);

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.error('Erro capturado:', err);

  if (err.name === 'ZodError') {
    const mensagens = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);

    console.error('Erros de validação Zod:', mensagens);

    return res.status(400).json({
      success: false,
      message: 'Erro de validação nos dados enviados.',
      errors: mensagens
    });
  }

  if (err.status) {
    console.error(`⚠️ Erro com status ${err.status}: ${err.message}`);
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }

  console.error('Erro inesperado:', err.stack || err);

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor. Tente novamente mais tarde.'
  });
});

export default app;
