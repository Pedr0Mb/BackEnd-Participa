import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message:'Id deve ter valor positivo' })
  
export const SchemaPesquisarVotacao = z.object({
    titulo: z
    .string({ required_error: mensagens.campo })
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' })
    .nullable()
    .optional(),
      
     tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde'])
    .nullable()
    .optional(),

     status: z
    .string({ required_error: mensagens.campo })
    .enum(['Agendada','Em andamento','Encerrada'])
    .nullable()
    .optional(),
})
    
export const SchemaVisualizarVotacao = z.object({
    idVotacao: idSchema
})

export const SchemaCriarVotacao = z.object({
   titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no mínimo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
      
    tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde']),

    breveDescritivo: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Breve descritivo deve conter no mínimo 30 caractéres' })   
    .max(256, { message: 'Breve descritivo deve conter no máximo 256 caractéres' }),

    publicoAlvo: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Público Alvo deve conter no mínimo 30 caractéres' })   
    .max(256, { message: 'Público Alvo deve conter no máximo 256 caractéres' }),
    
    orcamento: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Orçamento deve conter no mínimo 30 caractéres' })   
    .max(256, { message: 'Orçamento deve conter no máximo 256 caractéres' }),

    dataFim: z
    .date({required_error: mensagens.campo})
    .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

    imagem: z
    .string({ required_error: mensagens.campo })
    .url({ message: 'Link com formato invalido' }),
    
    opcoesResposta: z.array(z.object({
      titulo: z.string({ required_error: mensagens.campo }).min(2, { message: 'Título da opção é obrigatório' })
    })).min(2, { message: 'Deve haver pelo menos 1 opção' }).max(4, { message: 'Máximo de 4 opções permitidas' }),
})

export const SchemaAlterarVotacao = z.object({
  idVotacao: idSchema,
  
   titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no mínimo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
      
    tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde']),

    breveDescritivo: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Breve descritivo deve conter no mínimo 30 caractéres' })   
    .max(256, { message: 'Breve descritivo deve conter no máximo 256 caractéres' }),

    publicoAlvo: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Público Alvo deve conter no mínimo 30 caractéres' })   
    .max(256, { message: 'Público Alvo deve conter no máximo 256 caractéres' }),
    
    orcamento: z
    .string({ required_error: mensagens.campo })
    .min(30, { message: 'Orçamento deve conter no mínimo 30 caractéres' })   
    .max(256, { message: 'Orçamento deve conter no máximo 256 caractéres' }),

    dataFim: z
    .date({required_error: mensagens.campo})
    .refine(date => date > new Date(),{message: 'Data deve ser futura '}),
    
    status: z
    .string({ required_error: mensagens.campo })
    .enum(['Agendada','Em andamento','Encerrada']),

    resultado: z
    .string({ required_error: mensagens.campo})
    .max(100, {message: 'Resultado deve conter no maximo 100 caracteres'}),

    imagem: z
    .string({ required_error: mensagens.campo })
    .url({ message: 'Link com formato invalido' }),
    
    opcoesResposta: z.array(z.object({
      titulo: z.string({ required_error: mensagens.campo }).min(2, { message: 'Título da opção é obrigatório' })
    })).min(1, { message: 'Deve haver pelo menos 1 opção' }).max(4, { message: 'Máximo de 4 opções permitidas' }),
})

export const SchemaDeletarVotacao = z.object({
  idVotacao: idSchema
})


export const schemaOpcoesResposta = z.object({
  idVotacao: idSchema,

  titulo: z
  .string({ required_error: mensagens.campo })
  .min(10, { message: 'Titulo deve conter no mínimo 10 caractéres' })   
  .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' })
})

export const SchemaRegistrarVoto = z.object ({
  idOpcaoProposta: idSchema
})