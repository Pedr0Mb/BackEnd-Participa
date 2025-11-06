import express from 'express';
import appUser from './AppMobile/appUser.js';
import appGestor from './AppGestor/appGestor.js';
import { ZodError } from 'zod';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rotas principais
const apiRouter = express.Router();
apiRouter.use('/app', appUser);
apiRouter.use('/gestor', appGestor);

// Prefixo /api
app.use('/api', apiRouter);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro capturado:', err);

  // Erros do Zod
  if (err instanceof ZodError) {
    const mensagens = Array.isArray(err.errors)
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      : [err.message];

    console.error('Erros de validação Zod:', mensagens);

    return res.status(400).json({
      success: false,
      message: 'Erro de validação nos dados enviados.',
    });
  }

  // Erros lançados com status customizado
  if (err.status) {
    console.error(`⚠️ Erro com status ${err.status}: ${err.message}`);
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }

  // Erros inesperados
  console.error('Erro inesperado:', err.stack || err);

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor. Tente novamente mais tarde.'
  });
});

export default app;
