import { admin, db } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'

const userRef = db.collection('Usuario')
const atividadeRef = db.collection('RegistroAtividade')
function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}

export async function pesquisarUsuario(data) {
  const { nome, role, cpf } = data

  let query = userRef.select('id','nome','email','role','cpf')
  if (nome) query = query.where('nome', '==', nome)
  if (role) query = query.where('role', '==', role)
  if (cpf) query = query.where('cpf', '==', cpf)

  const userQuery = await query.get()
  if (userQuery.empty) return []

  return userQuery.docs.map(doc => ({ id: Number(doc.id), ...doc.data() }))
}

export async function visualizarUsuario(idUsuario) {
  const userDoc = await userRef.doc(String(idUsuario)).get();
  
  if (!userDoc.exists) 
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 });

  const data = userDoc.data();

  if (data.dataCriacao) data.dataCriacao = formatarData(data.dataCriacao);
  if (data.atualizadoEm) data.atualizadoEm = formatarData(data.atualizadoEm);

  return {  
    id: Number(userDoc.id),
    ...data
  };
}

export async function editarUsuario(data) {
  const usuarioDoc = await userRef.doc(String(data.id)).get();

  if (!usuarioDoc.exists)  
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 });

  await userRef.doc(String(data.id)).update({
    nome: data.nome,
    email: data.email,
    role: data.role,
    ativo: data.ativo,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  await registrarAtividade({
    tipo: 'Gestão',
    titulo: data.titulo,
    descricao: 'Você editou um usuario',
    acao: 'Usuario editado',
    idUsuario: data.idAdm,
    idAtividade: data.id,
  });
}

export async function verHistorico(idUsuario) {
  const usuarioDoc = await userRef.doc(String(idUsuario)).get();

  if (!usuarioDoc.exists)  
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 });

  let query = atividadeRef
    .where('idUsuario', '==', String(idUsuario))
    .orderBy('dataAtividade', 'desc');

  const historicoQuery = await query.get();

  const historico = historicoQuery.docs.map(doc => {
    const data = doc.data();
    if (data.dataAtividade) {
      data.dataAtividade = formatarData(data.dataAtividade);
    }
    return {
      id: Number(doc.id),
      ...data
    };
  });

  return {
    data: historico
  };
}

export async function promoverUsuario(idUsuario) {
  const usuarioDoc = await userRef.doc(String(idUsuario)).get()

  if(!usuarioDoc.exists)
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 });
    await userRef.doc(String(idUsuario)).update({
      role: 'Gestor',
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    })

  await registrarAtividade({
    tipo: 'Gestão',
    titulo: data.titulo,
    descricao: 'Você promoveu um usuario',
    acao: 'Usuario promovido',
    idUsuario: data.idUsuario,
    idAtividade: usuarioDoc.id,
  });
}

export async function desativarUser(idUsuario) {
  const usuarioDoc = await userRef.doc(String(idUsuario)).get()

  if(!usuarioDoc.exists)
    throw Object.assign(new Error('Usuario não encontrado'), { status: 404 });

    await userRef.doc(String(idUsuario)).update({
      ativo: false,
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    })

  await registrarAtividade({
    tipo: 'Gestão',
    titulo: data.titulo,
    descricao: 'Você promoveu um usuario',
    acao: 'Usuario promovido',
    idUsuario: data.idUsuario,
    idAtividade: usuarioDoc.id,
  });
}