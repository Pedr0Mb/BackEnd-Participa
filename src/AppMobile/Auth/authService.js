import { db } from '../../plugins/bd.js'
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; 
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const usuarioRef = db.collection('Usuario')



export async function loginEmail(data) {
  const snapshot = await usuarioRef.where('email', '==', data.email).get();
  if (snapshot.empty) throw Object.assign(new Error('Usuário não encontrado'), { status: 404 });

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  if(!userData.ativo) throw Object.assign(new Error('Usuário inativo'), { status: 403 });

  const senhaValida = await bcrypt.compare(data.senha, userData.senha);
  if (!senhaValida) throw Object.assign(new Error('Senha incorreta'), { status: 401 });

  const payload = { idUsuario: Number(userDoc.id) }; 
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  return {
    token,  
    usuario: {
      id: Number(userDoc.id),
      nome: userData.nome,
      cpf: userData.cpf,
      email: userData.email,
      role: userData.role,
    },
  };
}

export async function loginGoogle(idToken) {
  if (!idToken) throw Object.assign(new Error('idToken não fornecido'), { status: 400 });

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw Object.assign(new Error('Token inválido'), { status: 401 });

  const email = payload.email;

  const snapshot = await usuarioRef.where('email', '==', email).get();
  if (snapshot.empty) throw Object.assign(new Error('Usuário não encontrado'), { status: 404 });

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  const tokenPayload = { idUsuario: Number(userDoc.id) };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

  return {
    token,
    usuario: {
      id: Number(userDoc.id),
      nome: userData.nome,
      email: userData.email,
      role: userData.role || 'Cidadao',
    },
  };
}






