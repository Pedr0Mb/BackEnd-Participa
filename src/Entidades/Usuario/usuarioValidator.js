import { z } from 'zod'
import {textoSchema, emailSchema, cpfSchema, senhaSchema, providerSchema, tipoAtividadeSchema, linkSchema, tipoNotificacaoSchema, preferenciaNotificacaoSchema, categoriasSchema, temaSistemaSchema, idSchema, imagemSchema } from '../../utils/commonValidator.js'

export const SchemaCriarUsuario = z.object({
nome: textoSchema,
email: emailSchema,
senha: senhaSchema,
cpf: cpfSchema,
provider: providerSchema
.optional()
.nullable()
})

export const SchemaLogarUsuario = z.object({
cpf: cpfSchema,
senha: senhaSchema,
})

export const SchemaVerHistorico = z.object({
tipoAtividade: tipoAtividadeSchema
.optional()
.nullable(),
})

export const SchemaEditarUsuario = z.object({
nome: textoSchema,
email: emailSchema,
fotoUrl: linkSchema
.optional()
.nullable(),
senha: senhaSchema,
fotoArquivo: imagemSchema.optional().nullable()
})

export const SchemaEditarPreferencia  = z.object({
idPreferencia: idSchema,
temaSistema: temaSistemaSchema
})

export const SchemaEditarNotificacoes = z.object({
idPreferencia: idSchema,
tipoNotificacao: tipoNotificacaoSchema,
preferenciaNotificacao: preferenciaNotificacaoSchema
})

export const SchemaeditarCategoria = z.object({
idPreferencia: idSchema,
categorias: categoriasSchema
})