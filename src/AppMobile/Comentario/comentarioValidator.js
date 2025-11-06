import { z } from 'zod'

import { textoLongoSchema, idSchema } from '../../utils/commonValidator.js'

export const SchemaCriarComentario = z.object({
  idDebate: idSchema,
  texto: textoLongoSchema,
  parentComentario: idSchema.nullable().optional()
})

export const SchemaEditarComentario = z.object({
  idComentario: idSchema,
  texto: textoLongoSchema
})

export const SchemaDeletarComentario = z.object({
  idComentario: idSchema
})
