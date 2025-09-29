import {z} from 'zod'
import {idSchema, tipoAtividadeDenunciaSchema, textoLongoSchema, motivoDenunciaSchema} from '../../utils/commonValidator'

export const SchemaEnviarDenuncia = z.object({
    idAtividade: idSchema,
    tipoAtividade: tipoAtividadeDenunciaSchema,
    descricao: textoLongoSchema,
    motivo: motivoDenunciaSchema,
    idUsuarioReportado: idSchema
})
    

export const SchemaPesquisarDenuncia = z.object({
    tipoAtividade: tipoAtividadeDenunciaSchema
    .nullable()
    .optional()
})

export const SchemaVerificarDenuncia = z.object({
    idDenuncia: idSchema,
    tipoDenuncia: z.enum(['manter','remover'])
})