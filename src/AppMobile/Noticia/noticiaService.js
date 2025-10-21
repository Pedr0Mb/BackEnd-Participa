import { db } from '../../plugins/bd.js';
import { obterCategoriaUsuario } from '../../utils/obterCategoriasUsuario.js';

const noticiaRef = db.collection('Noticia');

function formatarData(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null;
}

export async function pesquisarNoticia(filters) {
  // Recebe o idUsuario pelo filters
  const categorias = await obterCategoriaUsuario(filters.idUsuario);

  let query = noticiaRef
    .select('titulo', 'tema', 'imagem', 'fonte', 'resumo', 'linkExterno', 'criadoEm', 'publicadoEm', 'status')
    .where('status', '==', 'publicado')
    .orderBy('criadoEm', 'desc');

  if (filters.titulo) query = query.where('titulo', '==', filters.titulo);

  const resultado = await query.get();
  if (resultado.empty) return [];

  // Filtrar por categorias do usuário
  const filtrado = resultado.docs.filter(doc => {
    const tema = doc.data().tema;
    return categorias.includes('todos') || categorias.includes(tema);
  });

  return filtrado.map(doc => ({
    id: Number(doc.id),
    ...doc.data(),
    criadoEm: formatarData(doc.data().criadoEm),
    publicadoEm: formatarData(doc.data().publicadoEm),
  }));
}

export async function visualizarNoticia(id) {
  const noticiaDoc = await noticiaRef.doc(String(id)).get();

  if (!noticiaDoc.exists)
    throw Object.assign(new Error('Noticia não encontrada'), { status: 404 });

  const data = noticiaDoc.data();
  return {
    id: Number(noticiaDoc.id),
    ...data,
    criadoEm: formatarData(data.criadoEm),
    publicadoEm: formatarData(data.publicadoEm),
  };
}
