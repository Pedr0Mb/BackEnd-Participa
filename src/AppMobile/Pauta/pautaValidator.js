import { z } from 'zod'
import { 
  idSchema, 
  textoSchema, 
  statusVotacaoSchema, 
} from '../../utils/commonValidator.js'

export const SchemaPesquisarPauta = z.object({
  titulo: textoSchema.nullable().optional(),
  status: statusVotacaoSchema.nullable().optional(), 
})

export const SchemaPautaID = z.object({
  idPauta: idSchema
})

export const SchemaRegistrarVoto = z.object({
  idPauta: idSchema,
  idOpcao: idSchema
})
