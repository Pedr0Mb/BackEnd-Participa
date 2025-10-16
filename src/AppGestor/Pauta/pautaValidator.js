import { z } from 'zod'
import { 
  idSchema, 
  textoSchema, 
  statusVotacaoSchema, 
  dataFuturaSchema, 
  opcoesRespostaSchema, 
  linkSchema, 
  descricoesSchema
} from '../../utils/commonValidator.js'

// ================= Pesquisar pauta =================
export const SchemaPesquisarPauta = z.object({
  titulo: textoSchema.nullable().optional(),
  status: statusVotacaoSchema.nullable().optional(),
})

// ================= ID da pauta =================
export const SchemaPautaID = z.object({
  idPauta: idSchema
})

// ================= Criar pauta =================
export const SchemaCriarPauta = z.object({
  titulo: textoSchema,
  descricoes: descricoesSchema, 
  opcoes: opcoesRespostaSchema, 
  inicioVotacao: dataFuturaSchema,
  fimVotacao: dataFuturaSchema,
  imagem: linkSchema,
  tag: textoSchema
})
.refine(
  (data) => data.fimVotacao > data.inicioVotacao,
  { message: "A data de término deve ser posterior à data de início", path: ["fimVotacao"] }
)

// ================= Editar pauta =================
export const SchemaEditarPauta = z.object({
  id: idSchema,
  titulo: textoSchema,
  descricoes: descricoesSchema, // lista de DescricaoEntity
  opcoes: opcoesRespostaSchema, // lista de OpcaoEntity
  inicioVotacao: dataFuturaSchema,
  fimVotacao: dataFuturaSchema,
  imagem: linkSchema,
  tag: textoSchema
})

// ================= Registrar voto =================
export const SchemaRegistrarVoto = z.object({
  idPauta: idSchema,
  idOpcao: idSchema
})
