import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

export const SchemaPesquisarUsuario = z.object({
  nome: z
  .string({ required_error: mensagens.campo })
  .max(150, { message:'Nome deve conter no máximo 150 caractéres' })
  .nullable()
  .optional(),

  cpf: z
  .string({ required_error: mensagens.campo })
  .length(11, { message: "CPF deve conter 11 digitos" })
  .regex(/^\d{11}$/, { message: "CPF deve conter apenas números" })
  .nullable()
  .optional(),

  cargo: z
  .string({ required_error: mensagens.campo })
  .enum(['Administrador','Gestor','Cidadao'])
  .nullable()
  .optional(),
})

export const SchemaVisualizarUsuario = z.object({
  id: z
  .number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message:'Id deve ter valor positivo' })
})

export const SchemaPromoverUsuario = z.object({
  cpf: z
  .string({ required_error: mensagens.campo })
  .length(11, { message: "CPF deve conter 11 digitos" })
  .regex(/^\d{11}$/, { message: "CPF deve conter apenas números" }),

  cargo: z
  .string({ required_error: mensagens.campo })
  .enum(['Administrador','Gestor','Cidadao']),

  secretaria: z
  .string({ required_error: mensagens.campo })
  .enum(['Educação','Segurança','Cultura','Saúde']),

  permissao: z
    .array(z.enum(['Publicar Noticia', 'Agendar Transmissao', 'Criar Votacao', 'Moderar Conteudo']))
    .refine(arr => new Set(arr).size === arr.length, {
      message: 'Não é permitido permissões duplicadas'
    }),
})

export const SchemaVerHistorico = z.object({
    id: z
    .number({ required_error: mensagens.campo })
    .int({ message: mensagens.dado })
    .positive({ message:'Id deve ter valor positivo' })
    .optional()
    .nullable(),

    dataInicio: z
    .date({ required_error: mensagens.campo })
    .max(new Date(), { message: "Data de início não pode ser no futuro" })
    .optional()
    .nullable(),

    tipoAtividade: z
    .string({ required_error: mensagens.campo })
    .max(50, { message: "Tipo de atividade deve conter no máximo 50 caractéres" })
    .optional()
    .nullable(),
})

