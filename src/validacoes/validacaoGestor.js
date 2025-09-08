import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message: 'Id deve ter valor positivo' })

export const SchemaPesquisarUsuario = z.object({
    nomeUsuario: z
    .string({ required_error: mensagens.campo })
    .max(150, { message:'Nome deve conter no máximo 150 caractéres' })
    .nullable()
    .optional(),

    cpfUsuario: z
    .string({ required_error: mensagens.campo })
    .length(11, { message: "CPF deve conter 11 digitos" })
    .regex(/^\d{11}$/, { message: "CPF deve conter apenas números" })
    .nullable()
    .optional(),

    cargoUsuario: z
    .string({ required_error: mensagens.campo })
    .enum(['Administrador','Gestor','cidadao'])
    .nullable()
    .optional(),
})

export const SchemaVisualizarUsuario = z.object({
  idUsuario: idSchema
})

export const SchemaPromoverUsuario = z.object({
  cpfUsuario: z
  .string({ required_error: mensagens.campo })
  .length(11, { message: "CPF deve conter 11 digitos" })
  .regex(/^\d{11}$/, { message: "CPF deve conter apenas números" }),

  cargoUsuario: z
  .string({ required_error: mensagens.campo })
  .enum(['Administrador','Gestor','cidadao']),

  secretaria: z
  .string({ required_error: mensagens.campo })
  .enum(['Educação','Segurança','Cultura','Saúde']),

  permissao: z
  .array(z.enum(['Publicar Noticia', 'Agendar Transmissao', 'Criar Votacao', 'Moderar Conteudo'])),
})

