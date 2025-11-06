import { z } from 'zod'
import { idSchema, textoSchema } from '../../utils/commonValidator.js'

export const SchemaPesquisarTransmissao = z.object({
  titulo: textoSchema.optional().nullable(),
})

export const SchemaTransmissaoID = z.object({
  idTransmissao: idSchema,
})
