import { z } from 'zod'
import { idSchema, textoSchema, cargoSchema, cpfSchema, tipoAtividadeSchema, emailSchema } from '../../utils/commonValidator.js';

export const SchemaPesquisarUsuario = z.object({
  nome: textoSchema
    .nullable()
    .optional(),

  role: cargoSchema
    .nullable()
    .optional(),

  cpf: cpfSchema
    .nullable()
    .optional()
})


export const SchemaEditarUsuario = z.object({
  id: idSchema,
  nome: textoSchema.optional().nullable(),
  email: emailSchema.optional().nullable(),
  role: cargoSchema.optional().nullable(),
  ativo: z.boolean().optional().nullable()
})

export const SchemaUsuarioID = z.object({
  id: idSchema,
})
