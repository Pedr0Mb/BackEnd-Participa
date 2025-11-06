import { z } from 'zod'

import {
  idSchema,
  textoSchema,
} from '../../utils/commonValidator.js'

export const SchemaPesquisarNoticia = z.object({
  titulo: textoSchema.nullable().optional(),
})

export const SchemaNoticiaId = z.object({
  idNoticia: idSchema,
})
