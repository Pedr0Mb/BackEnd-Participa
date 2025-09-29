import {db,admin} from '../plugins/bd.js'

const descricoesRef = db.collection('Descricao')

export async function atualizarDecricoes(descricoes,tipo,idItem) {
     const antigasSnapshot = await descricoesRef
    .where('tipo', '==', tipo)
    .where('idItem', '==', idItem)
    .get();

  const deletos = antigasSnapshot.docs.map(doc => doc.ref.delete());
  await Promise.all(deletos);

  const novos = descricoes.map(desc => {
    return descricoesRef.doc().set({
      ...desc,
      tipo,
      idItem,
      dataCriacao: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  await Promise.all(novos);

}

