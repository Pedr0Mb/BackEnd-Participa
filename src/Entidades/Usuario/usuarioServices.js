import { db, admin } from '../../plugins/bd.js'

const usuarioRef = db.collection('Usuario')
const historicoRef = db.collection('RegistroAtividade')
const preferenciaRef = db.collection('Preferencia')

// ================= Criar Usuário =================

export async function criarUsuario(data) {
  const cpfQuery = await db.collection("usuarios").where("cpf", "==", data.cpf).get();
  if (!cpfQuery.empty) {
    const err = new Error("Usuário com o mesmo CPF já cadastrado");
    err.status = 409;
    throw err;
  }

  const userRecord = await auth.createUser({
    email: data.email,
    password: data.senha,
    displayName: data.nome,
  });

  await db.collection("usuarios").doc(userRecord.uid).set({
    nome: data.nome,
    email: data.email,
    cpf: data.cpf,
    cargo: "Cidadao",
    status: true,
    nomeLower: data.nome.toLowerCase(),
    dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
    provider: "firebase-auth",
  });

  await db.collection("preferencias").doc(userRecord.uid).set({
    temaSistema: "system",
    tipoNotificacao: [],
    preferenciaNotificacao: [],
    opcoesCategoria: [],
    dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { message: `Usuário ${data.nome} cadastrado com sucesso` };
}

// ================= Ver Usuário =================

export async function verUsuario(idUsuario) {
  const userDoc = await usuarioRef.doc(idUsuario).get()
  if (!userDoc.exists) return null

  return { id: userDoc.id, ...userDoc.data() }
}

// ================= Ver Preferências =================

export async function verPreferencias(idUsuario) {
  const snapshot = await preferenciaRef.where('idUsuario', '==', idUsuario).get()

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// ================= Ver Histórico =================

export async function verHistorico(data) {
  let query = historicoRef.where('idUsuario', '==', data.idUsuario)
  if (data.tipoAtividade) query = query.where('tipoAtividade', '==', data.tipoAtividade)

  const resultado = await query.get()
  if (resultado.empty) return []

  return resultado.docs.map(doc => {
    const dataAtividade = doc.data()
    return {
      id: doc.id,
      ...dataAtividade,
      dataAtividade: dataAtividade.dataAtividade?.toDate()
    }
  })
}

// ================= Editar Usuário =================

export async function editarUsuario(data) {
  let urlFoto = data.fotoUrl

  const updateAuthData = {
    email: data.email.toLowerCase(),
    displayName: data.nome,
    password: data.senha
  };
  
  await admin.auth().updateUser(data.idUsuario, updateAuthData);

  if (data.arquivoFoto) {
    if (data.fotoUrl) {
        const oldPath = data.fotoUrl.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
        if (oldPath) await bucket.file(oldPath).delete();
    }
    urlFoto = await salvarFoto(data.arquivoFoto.buffer,`usuarios/${data.idUsuario}/foto`,data.arquivoFoto.mimetype);
  }

    await usuarioRef.doc(data.idUsuario).update({
      nome: data.nome,
      email: data.email,
      fotoUsuario: urlFoto,  
      nomeLower: data.nome.toLowerCase(),
      dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
    });

    await registrarAtividade({
      tipo: 'Usuário',
      descricao: `Você editou seus dados pessoais`,
      acao: 'Dados do usuário editados',
      idUsuario: data.idUsuario,
    });

    await Promise.all([
      atualizarPautasDoUsuario(data.idUsuario, data.nome, fotoUrl),
      atualizarComentarioDoUsuario(data.idUsuario, data.nome, fotoUrl)
    ]);

    return { message: `Usuário ${data.nome} editou seus dados pessoais com sucesso` };
}


// ================= Editar Preferências =================

export async function editarPreferencias(data) {
    await preferenciaRef.doc(data.idPreferencia).update({
      temaSistema: data.temaSistema || [],
      dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
    })

    return { message: 'Preferências pessoais do usuário editadas' }
}

// ================= Editar Notificações =================

export async function editarNotificacoes(data) {
    await preferenciaRef.doc(data.idPreferencia).update({
      tipoNotificacao: data.tipoNotificacao || [],
      preferenciaNotificacao: data.preferenciaNotificacao || [],
      dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
    })

    return { message: 'Preferências de notificações do usuário editadas' }
}

// ================= Editar Categorias =================

export async function editarCategorias(data) {
    await preferenciaRef.doc(data.idPreferencia).update({
      categorias: data.categorias || [],
      dataAtualizacao: admin.firestore.FieldValue.serverTimestamp()
    })

    return { message: 'Categorias do usuário editadas' }
}

