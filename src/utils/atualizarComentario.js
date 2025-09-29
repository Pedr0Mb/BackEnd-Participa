import {db,admin} from '../plugins/bd.js';

const comentarioRef = db.collection('Comentario')

export async function atualizarPautasDoUsuario(idUsuario, nome, foto) {
  const comentarioSnapshot = await comentarioRef.where('idUsuario', '==', idUsuario).get();
  
  const batch = admin.firestore().batch();
  comentarioSnapshot.forEach(doc => {
    batch.update(doc.ref, {
      nomeUsuario: nome,
      fotoUsuario: foto
    });
  });

  return batch.commit();
}
