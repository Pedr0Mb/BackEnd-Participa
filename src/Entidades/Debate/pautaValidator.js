import { z } from 'zod'

import {idSchema, textoSchema, descricoesSchema,imagemSchema} from '../../utils/commonValidator.js'

export const SchemaPautaId = z.object({
idPauta: idSchema
})

export const SchemaPesquisarPauta = z.object({
titulo: textoSchema
.nullable()
.optional(),
      
idUsuario: idSchema
.nullable()
.optional()
})

export const SchemaCriarPauta = z.object({
titulo: textoSchema,
descricoes: descricoesSchema,
fotoArquivo: imagemSchema
})

export const SchemaEditarPauta = SchemaCriarPauta.extend({
idPauta: idSchema,
fotoArquivo: imagemSchema.optional().nullable()
})



