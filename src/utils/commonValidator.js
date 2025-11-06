import { z } from 'zod'
import {
  categoriasEnum,
  cargoEnum,
  permissaoEnum,
  temaSistemaEnum,
  tipoNotificacaoEnum,
  preferenciaNotificacaoEnum,
  tipoAtividadeEnum,
  tipoAtividadeDenunciaEnum,
  statusEnum,
  statusVotacaoEnum,
  statusDenunciaEnum
} from './enums.js'

// ===================== ID =====================

export const idSchema = z.number().int().positive({
  message: 'ID deve ser um número inteiro positivo.'
})

// ===================== Usuário - Info Básicas =====================

export const senhaSchema = z.string().min(3, {
  message: 'A senha deve ter no mínimo 3 caracteres.'
})

export const emailSchema = z.string().email({
  message: 'E-mail inválido.'
}).max(256, {
  message: 'E-mail muito longo (máx. 256 caracteres).'
})

export const providerSchema = z.string().max(50, {
  message: 'Provider muito longo (máx. 50 caracteres).'
})

export const cpfSchema = z.string().regex(/^\d{11}$/, {
  message: 'CPF deve conter 11 dígitos numéricos.'
})

// ===================== Usuário - Admin =====================

export const cargoSchema = cargoEnum

export const permissaoSchema = z.array(permissaoEnum)
  .max(4, { message: 'Máximo de 4 permissões permitidas.' })
  .refine(arr => new Set(arr).size === arr.length, {
    message: 'Permissões duplicadas não são permitidas.'
  })

// ===================== Preferências =====================

export const temaSistemaSchema = temaSistemaEnum

// ===================== Notificação =====================

export const tipoNotificacaoSchema = z.array(tipoNotificacaoEnum)
  .max(4, { message: 'Máximo de 4 tipos de notificação permitidos.' })
  .refine(arr => new Set(arr).size === arr.length, {
    message: 'Tipos de notificação duplicados não são permitidos.'
  })

export const preferenciaNotificacaoSchema = z.array(preferenciaNotificacaoEnum)
  .max(4, { message: 'Máximo de 4 preferências de notificação permitidas.' })
  .refine(arr => new Set(arr).size === arr.length, {
    message: 'Preferências de notificação duplicadas não são permitidas.'
  })

// ===================== Categoria =====================

export const categoriasSchema = z.array(categoriasEnum)
  .max(12, { message: 'Máximo de 12 categorias permitidas.' })
  .refine(arr => new Set(arr).size === arr.length, {
    message: 'Categorias duplicadas não são permitidas.'
  })

// ===================== Texto genérico =====================

export const textoSchema = z.string().max(256, {
  message: 'Texto muito longo (máx. 256 caracteres).'
})

export const textoLongoSchema = z.string().max(512, {
  message: 'Texto muito longo (máx. 512 caracteres).'
})

export const linkSchema = z.string().url({ message: 'URL inválida.' })

// ===================== Datas =====================

export const dataFuturaSchema = z.date().refine(date => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return date >= hoje;
}, {
  message: 'A data deve ser hoje ou no futuro.'
})

export const dataPassada = z.date().refine(date => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return date <= hoje;
}, {
  message: 'A data deve ser hoje ou no passado.'
})

// ===================== Histórico / Denúncia =====================

export const tipoAtividadeSchema = tipoAtividadeEnum
export const tipoAtividadeDenunciaSchema = tipoAtividadeDenunciaEnum
export const statusDenunciaScchema = statusDenunciaEnum

// ===================== Status =====================

export const statusSchema = statusEnum
export const statusVotacaoSchema = statusVotacaoEnum

// ===================== Descrições =====================

export const descricoesSchema = z.array(
  z.object({
    titulo: z.string().max(255, { message: 'Título muito longo (máx. 255 caracteres).' }),
    info: z.string({ required_error: 'O campo info é obrigatório.' })
  })
).min(1, { message: 'Pelo menos uma descrição é obrigatória.' })

// ===================== Opções de Resposta =====================

export const opcoesRespostaSchema = z.array(
  z.object({
    texto: z.string().max(255, { message: 'Texto da opção muito longo (máx. 255 caracteres).' })
  })
).min(2, { message: 'É necessário fornecer pelo menos uma opção.' })
  .max(4, { message: 'Máximo de 4 opções permitidas.' })

// ===================== Tema =====================

export const temaSchema = categoriasEnum
