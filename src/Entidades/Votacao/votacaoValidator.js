import { z } from 'zod'

import {idSchema, textoSchema, statusVotacaoSchema, textoLongoSchema, dataFuturaSchema, opcoesRespostaSchema, imagemSchema} from '../../utils/commonValidator.js'

  
export const SchemaPesquisarVotacao = z.object({
titulo: textoSchema
.nullable()
.optional(),

status: statusVotacaoSchema
.nullable()
.optional()
})
    
export const SchemaVotacaoID = z.object({
id: idSchema
})

export const SchemaCriarVotacao = z.object({
  titulo: textoSchema,
  descricao: textoLongoSchema,
  publicoAlvo: textoSchema,  
  orcamento: textoSchema,
  dataInicio: dataFuturaSchema,
  dataFim: dataFuturaSchema,
  opcoesResposta: opcoesRespostaSchema,
  fotoArquivo: imagemSchema,
})
.refine(
  (data) =>  data.dataFim > data.dataInicio, 
  {
    path: ["end_date"], 
  }
);

export const SchemaEditarVotacao = SchemaCriarVotacao.extend({
  id: idSchema,
  fotoArquivo: imagemSchema.nullable().optional()
})

export const SchemaRegistrarVoto = z.object ({
  idVotacao: number().min(1).max(4),
  idOpcaoProposta: idSchema
})