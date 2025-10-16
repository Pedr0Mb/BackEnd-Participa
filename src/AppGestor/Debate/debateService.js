import { atualizarDescricoes } from '../../utils/atualizarDescricoes.js'
import { db, admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'
import { obterDadosUsuario } from '../../utils/obterDadosUsuario.js'
import { getNextId } from '../../utils/getNextId.js'

const debateRef = db.collection('Debate')
const comentarioRef = db.collection('Comentario')
const descricaoRef = db.collection('Descricao')

function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}

export async function pesquisarDebate(data) {
  let query = debateRef
    .select('titulo', 'subTitulo', 'idAutor', 'imagem', 'criadoEm','fotoUrlAutor','nomeAutor','qtComentario')
    .orderBy('criadoEm', 'desc');

  if (data.titulo) query = query.where('titulo', '==', data.titulo);
  if (data.idUsuario) query = query.where('idAutor', '==', data.idUsuario);

  const resultado = await query.get();
  if (resultado.empty) return [];

  return resultado.docs.map(doc => {
    const debate = doc.data();
    return {
      id: doc.id,
      ...debate,
      criadoEm: formatarData(debate.criadoEm),
    };
  });
}

export async function visualizardebate(idDebate) {
  const debateDoc = await debateRef.doc(String(idDebate)).get();
  if (!debateDoc.exists)
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 });

  const debateData = debateDoc.data();

  const comentariosQuery = await comentarioRef
    .where('idDebate', '==', idDebate)
    .get();

  const descricaoQuery = await descricaoRef
    .where('tipo', '==', 'Debate')
    .where('idItem', '==', idDebate)
    .get();

  return {
    id: debateDoc.id,
    ...debateData,
    criadoEm: formatarData(debateData.criadoEm),
    atualizadoEm: formatarData(debateData.atualizadoEm),
    comentarios: comentariosQuery.docs.map(doc => {
      const c = doc.data();
      return {
        id: doc.id,
        ...c,
        criadoEm: formatarData(c.criadoEm),
        atualizadoEm: formatarData(c.atualizadoEm),
      };
    }),

   descricoes: descricaoQuery.docs.map(doc => {
     const data = doc.data();
      return {
      id: doc.id,
    ...data,
    criadoEm: formatarData(data.criadoEm),
  };
}),
  };
}

export async function criarDebate(data) {
  const idDebate = await getNextId('Debate');
  const { nome, fotoUrl } = await obterDadosUsuario(data.idAutor);

  await debateRef.doc(String(idDebate)).set({
    idDebate,
    idAutor: data.idAutor,
    nomeAutor: nome,
    fotoUrlAutor: fotoUrl,
    titulo: data.titulo,
    subTitulo: data.subTitulo,
    imagem: data.imagem,
    criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    atualizadoEm: null,
    qtComentario: 0,
  });

  await atualizarDescricoes({
    descricoes: data.descricao,
    tipoAtividade: 'Debate',
    idItem: idDebate,
  });

  await registrarAtividade({
    tipo: 'Debate',
    titulo: data.titulo,
    descricao: `Você criou uma nova Debate`,
    acao: 'Debate criada',
    idUsuario: data.idAutor,
    idAtividade: String(idDebate),
  });
}

export async function editardebate(data) {
  const debateDoc = await debateRef.doc(String(data.idDebate)).get();

  if (!debateDoc.exists)
    throw Object.assign(new Error('Debate não encontrado'), { status: 404 });


  await debateRef.doc(String(data.idDebate)).update({
    titulo: data.titulo,
    subTitulo: data.subTitulo,
    imagem: data.imagem,
    atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
  });

  await atualizarDescricoes({
    descricoes: data.descricoes,
    tipoAtividade: 'Debate',
    idItem: String(data.idDebate),
  });
  
  await registrarAtividade({
    tipo: 'Debate',
    titulo: data.titulo,
    descricao: `Você editou a Debate`,
    acao: 'Debate editada',
    idUsuario: data.idUsuario,
    idAtividade: String(data.idDebate),
  });
}

export async function deletardebate(data) {
  const debateDoc = await debateRef.doc(String(data.idDebate)).get()
  if (!debateDoc.exists) 
    throw Object.assign(new Error('Debate não encontrada'), { status: 404 })

  const debateData = debateDoc.data()

  await debateRef.doc(String(data.idDebate)).delete()
  await atualizarDescricoes([],'debate',String(data.idDebate))

  await registrarAtividade({
    tipo: 'Debate',
    titulo: debateData.titulo,
    descricao: `Você excluiu a Debate`,
    acao: 'Debate excluida',
    idUsuario: data.idUsuario,
    idAtividade: String(data.idDebate),
  })
}
