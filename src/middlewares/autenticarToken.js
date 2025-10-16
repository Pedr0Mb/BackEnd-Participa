import { db } from '../plugins/bd.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const userRef = db.collection('Usuario');

export async function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

  const token = authHeader.split(' ')[1];

    try {
      const decodedJWT = jwt.verify(token, JWT_SECRET); 
      const doc = await userRef.doc(String(decodedJWT.idUsuario)).get();
      if (!doc.exists) return res.status(404).json({ error: 'Usuário não encontrado.' });

      req.usuario = { id: doc.id };
      return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.', detalhes: err.message });
  }
}
