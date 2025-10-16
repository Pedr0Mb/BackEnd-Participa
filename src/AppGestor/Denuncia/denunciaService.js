import { db } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'

const denunciaRef = db.collection('Denuncia')
const comentarioRef = db.collection('Comentario')
const pautaRef = db.collection('Pauta')
const usuarioRef = db.collection('Usuario')

function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}

export async function pesquisarDenuncia(data) {
  let query = denunciaRef.select('alvoId', 'tipo', 'motivo', 'idReportante')

  if (data.tipo) query = query.where('tipo', '==', data.tipo)
  if (data.status) query = query.where('status', '==', data.status)

  const resultado = await query.get()
  if (resultado.empty) return []

  return resultado.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function visualizarDenuncia(idDenuncia) {
  const denunciaDoc = await denunciaRef.doc(String(idDenuncia)).get();

  if (!denunciaDoc.exists) 
    throw Object.assign(new Error('Denuncia não encontrada'), { status: 404 });
  
  const data = denunciaDoc.data();

  return {
    id: denunciaDoc.id,
    ...data,
    criadoEm: formatarData(data.criadoEm),
    atualizadoEm: formatarData(data.atualizadoEm),
  };
}

export async function removerDenuncia(idDenuncia) {
  const denunciaDocRef = denunciaRef.doc(String(idDenuncia))
  const denunciaSnap = await denunciaDocRef.get()

  if (!denunciaSnap.exists) 
    throw Object.assign(new Error('Denuncia não encontrada'), { status: 404 });

  const data = denunciaSnap.data()

  if (data.status != 'aberta') 
    throw Object.assign(new Error('Denuncia não pde ser removida'), { status: 403 });

  await denunciaDocRef.update({ status: 'removida' })

 await registrarAtividade({
    tipo: 'Denuncia',
    titulo: null,
    descricao: `Denuncia ${idDenuncia} removida`,
    acao: 'Denuncia removida',
    payload: null,
    idUsuario: data.idReportante,
    idAtividade: idDenuncia,
  })
}

export async function verificarDenuncia(idDenuncia) {
  const denunciaDocRef = denunciaRef.doc(String(idDenuncia));
  const denunciaSnap = await denunciaDocRef.get();

  if (!denunciaSnap.exists) 
    throw Object.assign(new Error('Denuncia não encontrada'), { status: 404 });

  const denunciaData = denunciaSnap.data();

  if (data.status != 'aberta') 
    throw Object.assign(new Error('Denuncia não pode ser verificada'), { status: 403 });

  const alvoId = denunciaData.alvoId;
  await denunciaDocRef.update({ status: 'verificada'});

  let idUsuarioDenunciado = null;

  if (denunciaData.tipo === 'Comentario') {
    const comentarioDoc = await comentarioRef.doc(String(alvoId)).get();
    const comentarioData = comentarioDoc.data();
    idUsuarioDenunciado = comentarioData.idUsuario;
    await comentarioRef.doc(String(alvoId)).delete();
  } 

   if (denunciaData.tipo === 'Debate') {
    const pautaDoc = await pautaRef.doc(String(alvoId)).get();
    const pautaData = pautaDoc.data();
    idUsuarioDenunciado = pautaData.idAutor;
    await pautaRef.doc(String(alvoId)).delete();
  } 

  await usuarioRef.doc(String(idUsuarioDenunciado)).update({ ativo: false });

  await registrarAtividade({
    tipo: 'Denuncia',
    titulo: null,
    descricao: `Denuncia ${idDenuncia} verificada`,
    acao: 'Denuncia',
    payload: null,
    idUsuario: denunciaData.idReportante,
    idAtividade: idDenuncia,
  })
}

