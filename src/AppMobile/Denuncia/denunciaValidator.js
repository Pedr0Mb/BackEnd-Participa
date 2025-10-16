import {z} from 'zod'
import {idSchema, tipoAtividadeDenunciaSchema, textoLongoSchema, textoSchema} from '../../utils/commonValidator.js'

export const SchemaEnviarDenuncia = z.object({
    alvoId: idSchema,
    tipo: tipoAtividadeDenunciaSchema,
    descricao: textoLongoSchema,
    motivo: textoSchema,
    alvoId: idSchema
})
    