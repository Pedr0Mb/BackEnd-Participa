import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message: 'Id deve ter valor positivo' })

export const SchemaVisualizarComentario = z.object({
  idComentario: idSchema
})

export const SchemaCriarComentario = z.object({
  texto: z
    .string({ required_error: mensagens.campo })
    .max(256, { message: 'Texto deve conter no máximo 256 caractéres' }),

  idPauta: idSchema
})

export const SchemaAlterarComentario = z.object({
  texto: z
    .string({ required_error: mensagens.campo })
    .max(256, { message: 'Texto deve conter no máximo 256 caractéres' }),
  
  idComentario: idSchema
})

export const SchemaDeletarComentario = z.object({
  idComentario: idSchema
})
