import { z } from 'zod'
import {
  emailSchema,
  senhaSchema,
} from '../../utils/commonValidator.js'

export const SchemaLoginGoogle = z.object({
  idToken: z.string().min(1, 'ID Token é obrigatório'),
});


export const SchemaLogarUsuarioEmail = z.object({
  email: emailSchema,
  senha: senhaSchema,
})

