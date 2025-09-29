import { db } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'

const userRef = db.collection('Usuario')
const atividadeRef = db.collection('Atividade')

export async function pesquisarUsuario(data) {
    const { nome, cargo, cpf } = data

    let query = userRef.select('nome','email','cargo','nomeLower','cpf')
    if (nome) { query = query.where('nomeLower', '==', nome.toLowerCase()) }
    if (cargo) { query = query.where('cargo', '==', cargo)}
    if(cpf) {query = query.where('cpf','==',cpf)}

    const userQuery = await query.get()

    if (userQuery.empty) { return [] }

    return userQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function visualizarUsuario(id) {
    const userDoc = await userRef.doc(id).get()
    const usuario = { id: userDoc.id, ...userDoc.data() }

    return usuario
}

export async function editarUsuario(data) {

  const usuarioDoc = await userRef.doc(data.id).get()

  if (!usuarioDoc.exists) {
    const err = new Error('Usuário não encontrado');
    err.status = 404; 
    throw err;
  }
  
  await userRef.doc(data.id).update({
    nome: data.nome,
    email: data.email,
    cargo: data.cargo,
    secretaria: data.secretaria,
    permissoes: data.permissoes,
    nomeLower: data.nome.toLowerCase()
  })

  await registrarAtividade({
    tipo: 'Gestão',
    acao: 'Usuário editado',
    link: null,
    idUsuario: data.idAdm,
    idAtividade: data.id
  })

  return { message: 'Usuario editado com sucesso' }
}

export async function verHistorico(data) {

  const { id, dataInicio, tipoAtividade } = data

  const usuarioDoc = await usuarioRef.doc(id).get()
  
  if (!usuarioDoc.exists) {
    const err = new Error('Usuário não encontrado');
    err.status = 404; 
    throw err;
  }

  let query = atividadeRef

  if (id) query = query.where('idUsuario', '==', id)
  if (dataInicio) query = query.where('data', '>=', dataInicio)
  if (tipoAtividade) query = query.where('tipoAtividade', '==', tipoAtividade)

  query = query.orderBy('data', 'desc')

  const historicoQuery = await query.get()

  return historicoQuery.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}