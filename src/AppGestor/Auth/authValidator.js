import { z } from 'zod'
import {
    cpfSchema, 
    senhaSchema, 
} from '../../utils/commonValidator.js'

export const AuthUserSchema = z.object({
cpf: cpfSchema,
senha: senhaSchema,
})

