import { z } from 'zod'
import { idSchema, textoSchema, textoLongoSchema, linkSchema, statusSchema } from '../../utils/commonValidator.js'

export const SchemaPesquisarTransmissao = z.object({
  titulo: textoSchema.optional().nullable(),
  status: statusSchema.optional().nullable()
})

export const SchemaTransmissaoID = z.object({
  idTransmissao: idSchema,
})

export const SchemaCriarTransmissao = z.object({
  titulo: textoSchema,
  subtitulo: textoSchema.optional().nullable(),
  descricao: textoLongoSchema.optional().nullable(),
  linkExterno: linkSchema.optional().nullable(),
  fonte: textoSchema.optional().nullable(),
  tempo: textoSchema.optional().nullable(),
  foto: linkSchema.optional().nullable(),
  imagem: linkSchema.optional().nullable(),
  tema: textoSchema.optional().nullable(),
})

export const SchemaEditarTransmissao = SchemaCriarTransmissao.safeExtend({
  idTransmissao: idSchema,
})
