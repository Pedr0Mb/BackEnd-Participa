import { z } from 'zod'

import { idSchema, textoSchema, temaSchema, textoLongoSchema, linkSchema, imagemSchema} from '../../utils/commonValidator.js'

export const SchemaPesquisarNoticia = z.object({
    titulo: textoSchema
    .nullable()
    .optional(),
})
    
export const SchemaNoticiaId = z.object({
    idNoticia: idSchema
})

export const SchemaCriarNoticia = z.object({
    titulo: textoSchema,
    tema: temaSchema,
    resumo: textoLongoSchema,
    link: linkSchema,
    fonte: textoSchema,
    arquivoFoto: imagemSchema,
})

export const SchemaEditarNoticia = SchemaCriarNoticia.extend({
    idNoticia: idSchema,
    arquivoFoto: imagemSchema.nullable().optional()
})



