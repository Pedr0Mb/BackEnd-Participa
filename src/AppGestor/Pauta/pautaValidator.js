import { z } from 'zod';
import { 
  idSchema, 
  textoSchema, 
  statusVotacaoSchema, 
  dataFuturaSchema, 
  opcoesRespostaSchema, 
  linkSchema, 
  descricoesSchema
} from '../../utils/commonValidator.js';

// ================= Pesquisar pauta =================
export const SchemaPesquisarPauta = z.object({
  titulo: textoSchema.nullable().optional(),
  status: statusVotacaoSchema.nullable().optional(),
});

// ================= ID da pauta =================
export const SchemaPautaID = z.object({
  idPauta: idSchema,
});

// ================= Criar pauta =================
// SchemaCriarPauta já existente
export const SchemaCriarPauta = z.object({
  titulo: textoSchema,
  descricoes: descricoesSchema,
  opcoes: opcoesRespostaSchema,
  inicioVotacao: dataFuturaSchema,
  fimVotacao: dataFuturaSchema,
  imagem: linkSchema.optional(),
  tema: textoSchema.optional(),
}).refine(
  (data) => data.fimVotacao > data.inicioVotacao,
  { message: "A data de término deve ser posterior à data de início", path: ["fimVotacao"] }
);

// SchemaEditarPauta usando safeExtend
export const SchemaEditarPauta = SchemaCriarPauta.safeExtend({
  id: idSchema,
});


// ================= Registrar voto =================

