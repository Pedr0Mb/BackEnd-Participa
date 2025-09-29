import { z } from 'zod'

import { idSchema, textoSchema, cargoSchema, cpfSchema, permissaoSchema, tipoAtividadeSchema, emailSchema } from '../../utils/commonValidator.js';

export const SchemaPesquisarUsuario = z.object({
    nome: textoSchema
    .nullable()
    .optional(),

    cargo: cargoSchema
    .nullable()
    .optional(),

    cpf: cpfSchema
    .nullable()
    .optional()
})

export const SchemaVisualizarUsuario = z.object({
  id: idSchema
})

export const SchemaEditarUsuario = z.object({
  id: idSchema,
  nome: textoSchema,
  email: emailSchema,
  cargo: cargoSchema,
  permissoes: permissaoSchema
  .nullable().optional(),
})

export const SchemaVerHistorico = z.object({
  id: idSchema,

  tipoAtividade: tipoAtividadeSchema
    .optional()
    .nullable(),
})