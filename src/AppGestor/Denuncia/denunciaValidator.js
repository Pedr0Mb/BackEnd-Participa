import {z} from 'zod'
import {idSchema, tipoAtividadeDenunciaSchema, statusDenunciaScchema} from '../../utils/commonValidator.js'

export const SchemaPesquisarDenuncia = z.object({
    tipoAtividade: tipoAtividadeDenunciaSchema
    .nullable()
    .optional(),
    status: statusDenunciaScchema
    .nullable()
    .optional()
})

export const SchemaIdDenuncia = z.object({
    idDenuncia: idSchema
})