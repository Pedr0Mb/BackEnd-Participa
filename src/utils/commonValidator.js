import { z } from 'zod'

// ===================== ENUMS =====================
export const categoriasEnum = z.enum([
  "Educação", "Saúde", "Política", "Meio Ambiente",
  "Transporte", "Cultura", "Segurança", "Esportes",
  "Tecnologia", "Economia", "Moradia", "Lazer"
])

export const cargoEnum = z.enum(['Administrador','Gestor','Cidadao'])

export const permissaoEnum = z.enum([
  'Publicar Noticia', 'Agendar Transmissao', 'Criar Votacao', 'Moderar Conteudo'
])

export const temaSistemaEnum = z.enum(['system','claro','escuro'])

export const tipoNotificacaoEnum = z.enum([
  'Nova votação','Nova notícia','Nova transmissão','Comentário em pautas'
])

export const preferenciaNotificacaoEnum = z.enum(['Som','Vibração'])

export const tipoAtividadeEnum = z.enum(['Pauta','Comentário','Votação','Denúncia'])
export const tipoAtividadeDenunciaEnum = z.enum(['Pauta','Comentário'])

export const statusEnum = z.enum(['Ativo','Inativo'])
export const statusVotacaoEnum = z.enum(['rascunho','Em andamento','Encerrada'])

export const motivoDenunciaEnum = z.enum([
  'Conteúdo ofensivo','Spam / Publicidade',
  'Discurso de ódio','Informação falsa','Outro'
])

// ===================== ID =====================

export const idSchema = z.string().regex(/^[A-Za-z0-9]{20}$/)

// ===================== Usuário - Info Básicas =====================

export const senhaSchema = z.string().min(6)
export const emailSchema = z.string().email().max(256)
export const providerSchema = z.string().max(50)
export const cpfSchema = z.string().regex(/^\d{11}$/)

// ===================== Usuário - Admin =====================
export const cargoSchema = cargoEnum

export const permissaoSchema = z.array(permissaoEnum)
  .max(4)
  .refine(arr => new Set(arr).size === arr.length)

// ===================== Preferências =====================

export const temaSistemaSchema = temaSistemaEnum

// ===================== Notificação =====================

export const tipoNotificacaoSchema = z.array(tipoNotificacaoEnum)
  .max(4)
  .refine(arr => new Set(arr).size === arr.length)

export const preferenciaNotificacaoSchema = z.array(preferenciaNotificacaoEnum)
  .max(4)
  .refine(arr => new Set(arr).size === arr.length)

// ===================== Categoria =====================

export const categoriasSchema = z.array(categoriasEnum)
  .max(12)
  .refine(arr => new Set(arr).size === arr.length)

// ===================== Texto genérico =====================

export const textoSchema = z.string().max(256)
export const textoLongoSchema = z.string().max(512)
export const linkSchema = z.string().url()

// ===================== Datas =====================

export const dataFuturaSchema = z.date().refine(date => date > new Date())
export const dataPassadaSchema = z.date().refine(date => date < new Date())

// ===================== Histórico / Denúncia =====================

export const tipoAtividadeSchema = tipoAtividadeEnum
export const tipoAtividadeDenunciaSchema = tipoAtividadeDenunciaEnum
export const motivoDenunciaSchema = motivoDenunciaEnum

// ===================== Status =====================

export const statusSchema = statusEnum
export const statusVotacaoSchema = statusVotacaoEnum

// ===================== Descrições =====================

export const descricoesSchema = z.array(z.object({
  tituloSecao: z.string().max(255),
  infoSecao: z.string()
})).min(1)

// ===================== Opções Resposta =====================

export const opcoesRespostaSchema = z.array(z.object({
  titulo: z.string(),
})).min(2).max(4)

// ===================== Tema =====================

export const temaSchema = categoriasEnum

// ==================== Imagem =====================

export const imagemSchema = z.any().refine(file => file != null)
