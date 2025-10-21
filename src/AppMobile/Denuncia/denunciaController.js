import * as denunciaService from './denunciaService.js';
import * as denunciaValidator from './denunciaValidator.js';

export async function enviarDenunciaController(req, res, next) {
  try {
    const idUsuario = req.usuario.id;

    const data = denunciaValidator.SchemaEnviarDenuncia.parse({
      alvoId: req.body.alvoId,
      tipo: req.body.tipo,
      motivo: req.body.motivo,
      descricao: req.body.descricao,
    });

    await denunciaService.enviarDenuncia({ idUsuario, ...data });

    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
}
