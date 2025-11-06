import { z } from 'zod'

export const categoriasEnum = z.enum([
    'Saúde', 'Segurança', 'Transporte', 'Educação', 'Cultura',
    'Turismo', 'Meio Ambiente', 'Urbanismo', 'Esportes',
    'Assistência Social', 'Infraestrutura', 'Tecnologia',
    'Economia', 'Emprego', 'Habitação',
], {
    errorMap: () => ({ message: 'Categoria inválida selecionada.' })
})

export const cargoEnum = z.enum(['administrador', 'gestor', 'cidadao'], {
    errorMap: () => ({ message: 'Cargo inválido.' })
})

export const permissaoEnum = z.enum([
    'Publicar Noticia', 'Agendar Transmissao', 'Criar Votacao', 'Moderar Conteudo'
], {
    errorMap: () => ({ message: 'Permissão inválida.' })
})

export const temaSistemaEnum = z.enum(['system', 'claro', 'escuro'], {
    errorMap: () => ({ message: 'Tema inválido.' })
})

export const tipoNotificacaoEnum = z.enum([
    'Nova votação', 'Nova notícia', 'Nova transmissão', 'Comentário em debate'
], {
    errorMap: () => ({ message: 'Tipo de notificação inválido.' })
})

export const preferenciaNotificacaoEnum = z.enum(['Som', 'Vibração'], {
    errorMap: () => ({ message: 'Preferência de notificação inválida.' })
})

export const tipoAtividadeEnum = z.enum(['Debate', 'Comentario', 'Pauta', 'Denuncia', 'Gestão', 'Usuário'], {
    errorMap: () => ({ message: 'Tipo atividade inválido' })
})
export const tipoAtividadeDenunciaEnum = z.enum(['Debate', 'Comentario'], {
    errorMap: () => ({ message: 'Tipo de atividade de denûncia inválido' })
})

export const statusEnum = z.enum(['rascunho', 'publicado'], {
    errorMap: () => ({ message: 'Status inválido' })
})


export const statusVotacaoEnum = z.enum(['rascunho', 'ativa', 'finalizada'], {
    errorMap: () => ({ message: 'Status votação inválido' })
})

export const statusDenunciaEnum = z.enum(['aberta', 'removida', 'verificada'], {
    errorMap: () => ({ message: 'Status denûncia inválido' })
})