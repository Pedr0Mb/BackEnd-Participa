import  {db} from '../plugins/bd.js'

export async function getNextId(collectionName) {
  const counterRef = db.collection("Counters").doc(collectionName);

  const newId = await db.runTransaction(async (t) => {
    const counterDoc = await t.get(counterRef);

    let nextId = 1;
    if (counterDoc.exists) {
      nextId = counterDoc.data().lastId + 1;
    }

    t.set(counterRef, { lastId: nextId }, { merge: true });
    return nextId;
  });

  return newId;
}