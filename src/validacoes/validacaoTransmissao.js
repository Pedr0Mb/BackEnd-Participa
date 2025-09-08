import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message:'Id deve ter valor positivo' })

export const SchemaPesquisarTransmissao = z.object({
    titulo: z
    .string({ required_error: mensagens.campo }) 
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' })
    .nullable()
    .optional(),
      
     status: z
    .string({ required_error: mensagens.campo })
    .enum(['Ativo','Inativo'])
    .nullable()
    .optional(),
})

export const SchemaVisualizarTransmissao = z.object({
    idPauta: idSchema
})

export const SchemaCriarTransmissao = z.object({
    titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no mínimo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
    
    tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde']),
    
    dataInicio: z
    .date({required_error: mensagens.campo})
    .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

    breveDescritivo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Descricão deve conter no mínimo 10 caractéres' })   
    .max(256, { message: 'Descricão deve conter no máximo 50 caractéres' }),

    link: z
    .string({ required_error: mensagens.campo })
    .url({ message: 'Link com formato invalido' }),

    imagem: z
    .string({ required_error: mensagens.campo })
    .url({ message: 'Link com formato invalido' }),
})

export const SchemaAlterarTransmissao = z.object({
    idTransmissao: idSchema,

    titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no mínimo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
    
    tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde']),
    
    status: z
    .string({ required_error: mensagens.campo })
    .enum(['Agendada','Ao Vivo','Encerrada'], {message: 'Opção de status invalido '}),
    
    dataInicio: z
    .date({required_error: mensagens.campo})
    .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

    breveDescritivo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Breve descritivo deve conter no mínimo 10 caractéres' })   
    .max(256, { message: 'Breve descritivo deve conter no máximo 50 caractéres' }),

    link: z
    .string({ required_error: mensagens.campo })
    .url({ message: 'Link com formato invalido' }),

     imagem: z
    .string({ required_error: mensagens.campo })
    .url({ message: 'Link com formato invalido' }),
})

export const SchemaDeletarTransmissao = z.object({
    idPauta: idSchema
  })
