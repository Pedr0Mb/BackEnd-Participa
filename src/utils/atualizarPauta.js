import {db,admin} from '../plugins/bd.js'

const pautaRef = db.collection('Pauta')

export async function atualizarPautasDoUsuario(idUsuario, nome, foto) {
  const pautasSnapshot = await pautaRef.where('idUsuario', '==', idUsuario).get()
  
  const batch = admin.firestore().batch()
  pautasSnapshot.forEach(doc => {
    batch.update(doc.ref, {
      nomeUsuario: nome,
      fotoUsuario: foto
    });
  });

  return batch.commit()
}
