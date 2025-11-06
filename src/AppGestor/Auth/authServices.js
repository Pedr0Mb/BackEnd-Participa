import { db } from '../../plugins/bd.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const usuarioRef = db.collection('Usuario')

export async function authGestor(data) {
  const snapshot = await usuarioRef.where('cpf', '==', data.cpf).get()

  if (snapshot.empty) 
    throw Object.assign(new Error('Usuário não encontrado'), { status: 404 })

  const userDoc = snapshot.docs[0]
  const userData = userDoc.data()

  const senhaValida = await bcrypt.compare(data.senha, userData.senha)

  if (userData.role === 'cidadao')
    throw Object.assign(new Error('Acesso negado para cidadãos'), { status: 403 })

  if (!userData.ativo)
    throw Object.assign(new Error('Usuario inativo'), { status: 403 })

  if (!senhaValida)
    throw Object.assign(new Error('Senha incorreta'), { status: 401 })

  const payload = { idUsuario: Number(userDoc.id) }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })

  return {
    token,
    usuario: {
      id: Number(userDoc.id),
      nome: userData.nome,
      cpf: userData.cpf,
      email: userData.email,
      role: userData.role,
    },
  }
}



