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
  subtitulo: textoSchema,
  descricao: textoLongoSchema,
  linkExterno: linkSchema,
  fonte: textoSchema,
  tempo: textoSchema,
  foto: linkSchema,
  imagem: linkSchema,
  tema: textoSchema,
})

export const SchemaEditarTransmissao = SchemaCriarTransmissao.safeExtend({
  idTransmissao: idSchema,
})
