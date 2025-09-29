import { bucket } from "../plugins/bd.js";

export async function salvarFoto(buffer, caminho, contentType = "image/jpeg") {
  const fileName = `${caminho}-${Date.now()}.jpg`; 
  const file = bucket.file(fileName);

  await file.save(buffer, {
    metadata: { contentType },
  });

  await file.makePublic(); 

  return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
}
