import { z } from 'zod'

import {
  idSchema,
  textoSchema,
  temaSchema,
  textoLongoSchema,
  linkSchema,
  statusSchema
} from '../../utils/commonValidator.js'

export const SchemaPesquisarNoticia = z.object({
  titulo: textoSchema.nullable().optional(),
  status: statusSchema.nullable().optional()
})

export const SchemaNoticiaId = z.object({
  idNoticia: idSchema,
})

export const SchemaCriarNoticia = z.object({
  titulo: textoSchema,
  tema: temaSchema,
  resumo: textoLongoSchema,
  linkExterno: linkSchema,
  fonte: textoSchema,
  imagem: linkSchema,
})

export const SchemaEditarNoticia = SchemaCriarNoticia.safeExtend({
  idNoticia: idSchema,
})


