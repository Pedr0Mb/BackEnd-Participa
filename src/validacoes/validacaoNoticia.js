import { z } from 'zod'

const mensagens = {
  campo: "Campo obrigatório",
  dado: "Dado inválido"
}

const idSchema = z.number({ required_error: mensagens.campo })
  .int({ message: mensagens.dado })
  .positive({ message:'Id deve ter valor positivo' })
  
export const SchemaPesquisarNoticia = z.object({
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
    .enum(['Ativo','Inativo'])
    .nullable()
    .optional(),
})
    
export const SchemaVisualizarNoticia = z.object({
    id: idSchema
})

export const SchemaCriarNoticia = z.object({
   titulo: z
    .string({ required_error: mensagens.campo })
    .min(10, { message: 'Titulo deve conter no minímmo 10 caractéres' })   
    .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
      
    tema: z
    .string({ required_error: mensagens.campo })
    .enum(['Educação','Segurança','Cultura','Saúde']),

    dataLimite: z
    .date({required_error: mensagens.campo})
    .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

    breveDescritivo: z
    .string({ required_error: mensagens.campo})
    .min(30, {message: 'Breve descritivo deve conter no minímo 30 caracteres'})
    .max(256, {message: 'Breve descritivo deve conter no maximo 256 caracteres'}),

    link: z
    .string({required_error: mensagens.campo})
    .url({message: 'Link com formato invalido'}),

    imagem: z
    .string({required_error: mensagens.campo})
    .url({message: 'Link com formato invalido'}),
})

export const SchemaAlterarNoticia = z.object({
  idNoticia: idSchema,
  
  titulo: z
  .string({ required_error: mensagens.campo })
  .min(10, { message: 'Titulo deve conter no máximo 10 caractéres' })   
  .max(50, { message: 'Titulo deve conter no máximo 50 caractéres' }),
    
  tema: z
  .string({ required_error: mensagens.campo })
  .enum(['Educação','Segurança','Cultura','Saúde']),

  dataLimite: z
  .date({required_error: mensagens.campo})
  .refine(date => date > new Date(),{message: 'Data deve ser futura '}),

  status: z
  .string({ required_error: mensagens.campo })
  .enum(['Ativo','Inativo']),
  
  breveDescritivo: z
  .string({ required_error: mensagens.campo})
  .min(30, {message: 'Breve descritivo deve conter no minímo 30 caracteres'})
  .max(256, {message: 'Breve descritivo deve conter no maximo 256 caracteres'}),

  link: z
  .string({required_error: mensagens.campo})
  .url({message: 'Link com formato invalido'}),

  imagem: z
  .string({required_error: mensagens.campo})
  .url({message: 'Link com formato invalido'}),
})

export const SchemaDeletarNoticia = z.object({
  idNoticia: idSchema
})
