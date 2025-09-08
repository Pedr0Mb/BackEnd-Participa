import { db } from '../plugins/bd.js'
import * as validacaoGestor from '../validacoes/validacaoAdministrador.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function pesquisarUsuario(req,res) {
  try{
    const data = {
      nome: req.query.nome || null,
      cpf: req.query.cpf || null,
      cargo: req.query.cargo || null
    }

    const { nome, cpf, cargo } = validacaoGestor.SchemaPesquisarUsuario.parse(data)

    const [resultado] = await db.query('CALL pesquisarUsuarios(?,?,?)', [nome,cpf,cargo])
   
    const usuarios = resultado[0] || []

    if(usuarios.length === 0) return res.status(404).json({ message: 'Usuario não encontrado'})

    return res.status(200).json(usuarios)

  }catch(error){
    console.error('Erro ao pesquisar usuario: ',error)
    return res.status(500).json({ error: 'Erro ao pesquisar usuario'})
  }
}

export async function visualizarUsuario(req,res) {
  try{
    const data = { id: req.params.id };

    const { id } = validacaoGestor.SchemaVisualizarUsuario.parse(data);

    const [resultado] = await db.query('CALL visualizarUsuario(?)', [id])

    const usuario = resultado[0] || []
  
    return res.status(200).json(usuario)

  }catch(error){
    console.error('Erro ao visualizar usuario: ',error)
    return res.status(500).json({ error: 'Erro ao visualizar o usuario'})
  }
}

export async function promoverUsuario(req,res) {
  try{
    const idAdm = req.usuario.id

    const data = {
      cpf: req.body.cpf,
      cargo: req.body.cargo,
      secretaria: req.body.secretaria,
      permissoes: req.body.permissoes 
    }

    const {cpf, cargo, secretaria, permissoes } = validacaoGestor.SchemaCriarUsuario.parse(data);

    await db.query(`
      UPDATE Usuario 
      SET cargo_usuario = ?,
      secretaria_usuario = ?
      WHERE cpf_usuario = ?`, [cargo , secretaria, cpf]);

    const [usuarios] = await db.query('SELECT id_usuario FROM Usuario WHERE cpf_usuario = ?', [cpf]);

    if (usuarios.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
    
    const idUsuario = usuarios[0].id_usuario;

    await db.query('DELETE FROM PermissaoUsuario WHERE id_usuario = ?', [idUsuario]);

    const values = permissoes.map(permissao => [idUsuario, permissao]);

    await db.query('INSERT INTO PermissaoUsuario (id_usuario, permissao) VALUES ?', [values]);

    await registrarAtividade({
    tipo: 'Gestaão',
    titulo: 'Usuário promovido',
    link: null,
    idUsuario: idAdm,
    idAtividade: idUsuario
  });

    return res.status(200).json({ message: 'Usuario promovido'});

  }catch(error){
    console.error('Erro ao promover usuario: ',error)
    return res.status(500).send({ error: 'Erro ao promover o usuario'})
  }
}

export async function verHistoricoUsuario(req,res) {
    try {
        const data = {
          id: req.body.id,
          dataInicio: new Date(req.body.dataInicio),
          tipoAtividade: req.body.tipoAtividade
        }
        
        const { id, dataInicio, tipoAtividade  } = validacaoGestor.SchemaVerHistorico.parse(data)

        const [resultado] = await db.query('CALL visualizarHistorico(?.?,?)',[id, dataInicio, tipoAtividade])

        const historico = resultado[0]

        if(!historico) return res.status(404).json({ message: 'Historico não encontrado'})

        return res.status(200).json(historico)
    } catch (error) {
        console.error('Erro ao visualizar o Historico: ',error)
        return res.status(400).json({ error: 'Erro interno ao visualizar o Historico'})
    }
}