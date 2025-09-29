import { z } from 'zod'

import {idSchema, textoSchema, textoLongoSchema, linkSchema, imagemSchema} from '../../utils/commonValidator.js'

export const SchemaPesquisarTransmissao = z.object({
    titulo: textoSchema
    .nullable()
    .optional(),
})

export const SchemaTransmissaoID = z.object({
    idTransmissao: idSchema
})

export const SchemaCriarTransmissao = z.object({
    titulo: textoSchema,
    subTitulo: textoSchema,
    descricao: textoLongoSchema,
    link: linkSchema,
    fonte: textoSchema,
    tempo: textoSchema,
    fotoArquivo: imagemSchema
})

export const SchemaEditarTransmissao = SchemaCriarTransmissao.extend({
    idTransmissao: idSchema,
    fotoArquivo: imagemSchema.optional().nullable()
})
