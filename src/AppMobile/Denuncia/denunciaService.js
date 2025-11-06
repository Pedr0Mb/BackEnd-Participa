import { db, admin } from '../../plugins/bd.js';
import { registrarAtividade } from '../../utils/registroAtividade.js';
import { getNextId } from '../../utils/getNextId.js';

const denunciaRef = db.collection('Denuncia');
const comentarioRef = db.collection('Comentario');
const pautaRef = db.collection('Debate');

export async function enviarDenuncia(data) {
  let alvoDoc;

  if (data.tipo === 'Debate') alvoDoc = await pautaRef.doc(String(data.alvoId)).get();
  else if (data.tipo === 'Comentario') alvoDoc = await comentarioRef.doc(String(data.alvoId)).get();
  else throw Object.assign(new Error('Tipo de denúncia inválido'), { status: 400 });

  if (!alvoDoc.exists)
    throw Object.assign(new Error('Alvo não encontrado'), { status: 404 });

  const idNumerico = await getNextId('Denuncia');

  await denunciaRef.doc(String(idNumerico)).set({
    alvoId: data.alvoId,
    tipo: data.tipo,
    motivo: data.motivo,
    descricao: data.descricao || null,
    criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    idReportante: data.idUsuario,
    status: 'aberta',
  });

  await registrarAtividade({
    tipo: 'Denuncia',
    titulo: null,
    descricao: `Você registrou uma denúncia`,
    acao: 'Denúncia registrada',
    payload: `Atividade denunciada: ${data.alvoId}`,
    idUsuario: data.idUsuario,
    idAtividade: idNumerico,
  });
}
