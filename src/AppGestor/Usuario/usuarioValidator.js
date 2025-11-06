import { z } from 'zod'
import { idSchema, textoSchema, cargoSchema, cpfSchema, emailSchema } from '../../utils/commonValidator.js';

export const SchemaPesquisarUsuario = z.object({
  nome: textoSchema.nullable().optional(),
  role: cargoSchema.nullable().optional(),
  cpf: cpfSchema.nullable().optional()
})

export const SchemaEditarUsuario = z.object({
  id: idSchema,
  nome: textoSchema,
  email: emailSchema,
  ativo: z.boolean()
})

export const SchemaUsuarioID = z.object({
  idUsuario: idSchema,
})
