import { db } from '../plugins/bd.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as validacaoUsuario from '../validacoes/validacaoUsuario.js'
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function criarUsuario(req,res) {
    try{
        const data = {
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,  
            cpfUsuario: req.body.cpfUsuario,
            telefone: req.body.telefone
        }

        const { nome, email, senha, cpfUsuario, telefone } = validacaoUsuario.SchemaCriarUsuario.parse(data);
        
        const senhaCript = await bcrypt.hash(senha, 10);
        
        await db.query(
            `INSERT INTO Usuario (
            nm_usuario,
            email_usuario,
            senha_usuario,
            cpf_usuario,
            cargo_usuario,
            telefone_usuario ) 
            VALUES (?, ?, ?, ?, 'Cidadao',?)`,
            [nome, email, senhaCript, cpfUsuario, telefone]
        );

        return res.status(201).json({ message: 'Usuario Cadastrado Com sucesso'})

    }catch(error){
        console.error('Erro ao criar o usuario: ',error)
        return res.status(500).send({ error: 'Erro interno ao criar Usuario'})
    }
}

export async function logarUsuario(req,res) {
    try{
        const data = {
            cpf: req.body.cpfUsuario,
            senha: req.body.senha
        }

        const { cpf, senha } = validacaoUsuario.SchemaLogarUsuario.parse(data);

         const [resultado] = await db.query('SELECT * FROM Usuario WHERE cpf_usuario = ?', [cpf])
    
        if (resultado.length === 0) return res.status(404).json({ message: 'Usuário não encontrado'});
    
         const usuario = resultado[0]
         
         const VerificarSenha = await bcrypt.compare(senha, usuario.senha_usuario)
         
         if (!VerificarSenha) return res.status(401).json({ message: 'Senha incorreta'})

         const [resultadoPermissao] = await db.query('CALL VerPermissõesUsuario(?)', [usuario.id_usuario])

         const permissoes = resultadoPermissao[0] || [];
        
         const token = jwt.sign(
            { id: usuario.id_usuario, cargo: usuario.cargo_usuario, permissao: permissoes}, 
            JWT_SECRET, 
            { expiresIn: '2h' }
        );
    
        return res.json({token});

    }catch(error){
        console.error('Erro ao logar Usuario: ',error)
        return res.status(500).json({ error: 'Erro interno ao logar Usuario'})
    }
}

export async function verUsaurio(req,res) {
    try{
        const id = req.usuario.id

        const [resultado] = await db.query('CALL visualizarUsuario(?)',[id])

        const usuario = resultado[0] 

        if(!usuario) return res.status(404).json({ message: 'Usuario não encontrado'})
  
        return res.status(200).json(usuario)

    }catch(error){
        console.error('Erro ao Visualizar Usuario: ',error)
        return res.status(400).json({ error: 'Erro interno ao visualizar o Usuario'})
    }
}

export async function verHistorico(req,res) {
    try {
        const id = req.usuario.id

        const data = {
            dataInicio: new Date(req.body.dataInicio),
            tipoAtividade: req.body.tipoAtividade
        }
        
        const { dataInicio, tipoAtividade  } = validacaoUsuario.SchemaVerHistorico.parse(data)

        const [resultado] = await db.query('CALL visualizarHistorico(?.?,?)',[id, dataInicio, tipoAtividade])

        const historico = resultado[0]

        if(!historico) return res.status(404).json({ message: 'Historico vazio'})

        return res.status(200).json(historico)
    } catch (error) {
        console.error('Erro ao visualizar o Historico: ',error)
        return res.status(400).json({ error: 'Erro interno ao visualizar o Historico'})
    }
}