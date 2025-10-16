import * as authService from './authService.js'
import * as authValidator from './authValidator.js'

export async function loginEmailController(req, res, next) {
  try {
    const data = authValidator.SchemaLogarUsuarioEmail.parse({
      email: req.body.email,
      senha: req.body.senha,
    });

    const resultado = await authService.loginEmail(data);
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function loginWithGoogleController(req, res, next) {
  try {
    const {idToken} = authValidator.SchemaLoginGoogle.parse({
      idToken: req.body.idToken,
    });

    const resultado = await authService.loginGoogle(idToken);

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}