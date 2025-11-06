import { db, admin } from '../../plugins/bd.js'
import { getNextId } from '../../utils/getNextId.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { formatarData } from '../../utils/formatarData.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const usuarioRef = db.collection('Usuario')
const preferenciaRef = db.collection('Preferencia')

export async function criarUsuario(data) {
  const cpfQuery = await usuarioRef.where('cpf', '==', data.cpf).get()
  
  if (!cpfQuery.empty) 
    throw Object.assign(new Error("Usuário com o mesmo CPF já cadastrado"), { status: 409 })

  const emailQuery = await usuarioRef.where('email', '==', data.email).get();

  if (!emailQuery.empty) 
    throw Object.assign(new Error("E-mail já cadastrado"), { status: 409 });

  const senhaHash = await bcrypt.hash(data.senha, 10);
  const idUsuario = await getNextId('Usuario')

  await usuarioRef.doc(String(idUsuario)).set({
    nome: data.nome,
    email: data.email,
    cpf: data.cpf,
    role: "cidadao",
    fotoUrl: null,
    ativo: true,
    senha: senhaHash,
    dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
    provider: data.provider,
    atualizadoEm: null
  })

  await preferenciaRef.doc(String(idUsuario)).set({
    idUsuario,
    temaSistema: "system",
    tipoNotificacao: [],
    preferenciaNotificacao: [],
    opcoesCategoria: [],
    dataAlteracao: null,
  })
}

export async function verUsuario(idUsuario) {
  const userDoc = await usuarioRef.doc(String(idUsuario)).get()
  const data = userDoc.data();

  if (data.dataCriacao) data.dataCriacao = formatarData(data.dataCriacao);
  if (data.atualizadoEm) data.atualizadoEm = formatarData(data.atualizadoEm);

  return {
    id: Number(userDoc.id),
    ...data
  };
}

export async function verPreferencias(idUsuario) {
  const snapshot = await preferenciaRef.where('idUsuario', '==', idUsuario).get();
  const preferencias = snapshot.docs.map(
    doc => ({
      id: doc.id,
      ...doc.data(),
      dataAlteracao: formatarData(doc.data().dataAlteracao)
    }))[0];

  return preferencias;
}


export async function verHistorico(data) {
  const historicoRef = db.collection('RegistroAtividade')
  let query = historicoRef.where('idUsuario', '==', data.idUsuario)
  if (data.tipo) query = query.where('tipo', '==', data.tipo)

  const resultado = await query.get()
  if (resultado.empty) return []

  const resul = resultado.docs.map(doc => {
    const dataAtividade = doc.data()
    return {
      id: doc.id,
      ...dataAtividade,
      dataAtividade: dataAtividade.dataAtividade?.toDate()
    }
  })
  return {
    data: resul
  }
}

export async function editarUsuario(data) {
  await usuarioRef.doc(String(data.idUsuario)).update({
    nome: data.nome,
    email: data.email,
    fotoUrl: data.fotoUrl,
    dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Usuário',
    descricao: `Você editou seus dados pessoais`,
    acao: 'Dados do usuário editados',
    idUsuario: data.idUsuario,
  })
}

export async function editarPreferencias(data) {
  await preferenciaRef.doc(String(data.idUsuario)).update({
    temaSistema: data.tema || [],
    dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Usuário',
    descricao: `Você editou suas Preferências`,
    acao: 'Preferências do usuário editados',
    idUsuario: data.idUsuario,
  })
}

export async function editarNotificacoes(data) {
  await preferenciaRef.doc(String(data.idUsuario)).update({
    tipoNotificacao: data.tipoNotificacao || [],
    preferenciaNotificacao: data.preferenciaNotificacao || [],
    dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Usuário',
    descricao: `Você editou suas notificações`,
    acao: 'Notificações do usuário editados',
    idUsuario: data.idUsuario,
  })
}

export async function editarCategorias(data) {
  await preferenciaRef.doc(String(data.idUsuario)).update({
    categorias: data.categorias || [],
    dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
  })

  await registrarAtividade({
    tipo: 'Usuário',
    descricao: `Você editou suas categorias`,
    acao: 'categorias do usuário editados',
    idUsuario: data.idUsuario,
  })
}
