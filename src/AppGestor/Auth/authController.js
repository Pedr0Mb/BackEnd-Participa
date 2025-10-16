import * as authService from './authServices.js'
import * as authValidator from './authValidator.js'

export async function loginCpfController(req, res, next) {
  try {
    const data = authValidator.AuthUserSchema.parse({
      cpf: req.body.cpf,
      senha: req.body.senha,
    });

    const resultado = await authService.authGestor(data);
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}
