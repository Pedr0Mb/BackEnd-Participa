import { string, z } from 'zod'
import {
    textoSchema,
    emailSchema,
    cpfSchema,
    senhaSchema,
    providerSchema,
    tipoAtividadeSchema,
    linkSchema,
    tipoNotificacaoSchema,
    preferenciaNotificacaoSchema,
    categoriasSchema,
    temaSistemaSchema,
} from '../../utils/commonValidator.js'

export const SchemaCriarUsuario = z.object({
    nome: textoSchema,
    email: emailSchema,
    senha: senhaSchema,
    cpf: cpfSchema,
    provider: providerSchema
})

export const SchemaVerHistorico = z.object({
    tipoAtividade: tipoAtividadeSchema.optional().nullable(),
})

export const SchemaEditarUsuario = z.object({
    nome: textoSchema,
    email: emailSchema,
    fotoUrl: linkSchema,
    senha: senhaSchema,
})

export const SchemaEditarPreferencia = z.object({
    tema: temaSistemaSchema
})

export const SchemaEditarNotificacoes = z.object({
    tipoNotificacao: tipoNotificacaoSchema,
    preferenciaNotificacao: preferenciaNotificacaoSchema
})

export const SchemaeditarCategoria = z.object({
    categorias: categoriasSchema
})