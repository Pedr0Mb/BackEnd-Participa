import { object } from 'zod'
import { admin, db } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'

const userRef = db.collection('Usuario')
const atividadeRef = db.collection('RegistroAtividade')
function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null
}

export async function pesquisarUsuario(data) {
  const { nome, role, cpf } = data

  let query = userRef.select('nome', 'email', 'role', 'cpf')

  if (nome) query = query.where('nome', '==', nome)
  if (role) query = query.where('role', '==', role)
  if (cpf) query = query.where('cpf', '==', cpf)

  const userQuery = await query.get()

  if (userQuery.empty) return { data: [] }

  return userQuery.docs.map(doc => ({
    id: Number(doc.id),
    ...doc.data(),
  }))
}

export async function visualizarUsuario(idUsuario) {
  const userDoc = await userRef.doc(String(idUsuario)).get()

  if (!userDoc.exists) throw Object.assign(new Error('Usuário não encontrado'), { status: 404 })

  const data = userDoc.data()

  return {
    id: Number(userDoc.id),
    ...data,
    dataCriacao: formatarData(data.dataCriacao),
    atualizadoEm: formatarData(data.atualizadoEm),
  }
}

export async function editarUsuario(data) {
  const usuarioDoc = await userRef.doc(String(data.id)).get()

  if (!usuarioDoc.exists) throw Object.assign(new Error('Usuario não encontrado'), { status: 404 })

  if (data.id.toString() === usuarioDoc.id.toString()) {
    throw Object.assign(new Error('Administrador não pode editar a si mesmo'), { status: 400 })
  }

  await userRef.doc(String(data.id)).update({
    nome: data.nome,
    email: data.email,
    ativo: data.ativo,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
  })

  await registrarAtividade({
    tipo: 'Gestão',
    titulo: null,
    descricao: 'Você editou um usuario',
    acao: 'Usuario editado',
    idUsuario: data.idAdm,
    idAtividade: data.id,
  })
}

export async function verHistorico(idUsuario) {
  const usuarioDoc = await userRef.doc(String(idUsuario)).get()
  if (!usuarioDoc.exists) {
    throw Object.assign(new Error('Usuário não encontrado'), { status: 404 })
  }

  const querySnapshot = await atividadeRef
    .where('idUsuario', '==', String(idUsuario))
    .orderBy('dataAtividade', 'desc')
    .get()

  const historico = querySnapshot.docs.map(doc => {
    const data = doc.data()

    return {
      id: Number(doc.id),
      ...data,
      idAtividade: data.idAtividade ? Number(data.idAtividade) : null,
      dataAtividade: data.dataAtividade ? formatarData(data.dataAtividade) : null,
    }
  })

  return { data: historico }
}

export async function promoverUsuario(data) {
  const usuarioDoc = await userRef.doc(String(data.idUsuario)).get()

  if (!usuarioDoc.exists) {
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 })
  }

  if (usuarioDoc.id === data.idAdm.toString()) {
    throw Object.assign(new Error('Administrador não pode promover a si mesmo'), { status: 400 })
  }
  if (usuarioDoc.data().ativo !== true) {
    throw Object.assign(new Error('Usuário não pode ser gerenciado pois esta inativo'), { status: 400 })
  }

  if (usuarioDoc.data().role !== 'cidadao') {
    throw Object.assign(new Error('Usuário não pode ser promovido a gestor'), { status: 400 })
  }

  await userRef.doc(String(data.idUsuario)).update({
    role: 'gestor',
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Gestão',
    titulo: data.titulo,
    descricao: 'Você promoveu um usuario',
    acao: 'Usuario promovido',
    idUsuario: data.idUsuario,
    idAtividade: usuarioDoc.id,
  })
}

export async function rebaixarUsuario(data) {
  const usuarioDoc = await userRef.doc(String(data.idUsuario)).get()

  if (!usuarioDoc.exists) {
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 })
  }

  if (usuarioDoc.id === data.idAdm.toString()) {
    throw Object.assign(new Error('Administrador não pode rebaixar a si mesmo'), { status: 400 })
  }

  if (usuarioDoc.data().ativo !== true) {
    throw Object.assign(new Error('Usuário não pode ser gerenciado pois esta inativo'), { status: 400 })
  }

  if (usuarioDoc.data().role !== 'gestor') {
    throw Object.assign(new Error('Usuário não pode ser rebaixado de gestor para cidadão'), { status: 400 })
  }

  await userRef.doc(String(data.idUsuario)).update({
    role: 'cidadao',
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Gestão',
    titulo: data.titulo,
    descricao: 'Você rebaixou um usuario',
    acao: 'Usuario rebaixado',
    idUsuario: data.idUsuario,
    idAtividade: usuarioDoc.id,
  })
}

export async function desativarUser(data) {
  const usuarioDoc = await userRef.doc(String(data.idUsuario)).get()

  if (!usuarioDoc.exists) {
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 })
  }

  if (usuarioDoc.id === data.idAdm.toString()) {
    throw Object.assign(new Error('Administrador não pode desativar a si mesmo'), { status: 400 })
  }

  if (usuarioDoc.data().ativo !== true) {
    throw Object.assign(new Error('Usuário não pode ser inativado pois esta inativo'), { status: 400 })
  }

  if (usuarioDoc.data().role === 'administrador') {
    throw Object.assign(new Error('Administrador não pode ser desativado'), { status: 400 })
  }

  await userRef.doc(String(data.idUsuario)).update({
    ativo: false,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Gestão',
    titulo: data.titulo,
    descricao: 'Você desativou um usuario',
    acao: 'Usuario desativado',
    idUsuario: data.idUsuario,
    idAtividade: usuarioDoc.id,
  })
}

export async function ativarUser(data) {
  const usuarioDoc = await userRef.doc(String(data.idUsuario)).get()

  if (!usuarioDoc.exists)
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 })

  if (usuarioDoc.id === data.idAdm.toString())
    throw Object.assign(new Error('Administrador não pode ativar a si mesmo'), { status: 400 })

  if (usuarioDoc.data().role === 'administrador')
    throw Object.assign(new Error('Administrador não pode ser ativado'), { status: 400 })

  if (usuarioDoc.data().ativo !== false)
    throw Object.assign(new Error('Usuário já ativo'), { status: 400 })

  await userRef.doc(String(data.idUsuario)).update({
    ativo: true,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Gestão',
    titulo: null,
    descricao: 'Você ativou um usuario',
    acao: 'Usuario ativado',
    idUsuario: data.idUsuario,
    idAtividade: usuarioDoc.id,
  })
}