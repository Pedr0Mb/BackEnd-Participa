import admin from "firebase-admin";

export async function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    req.usuario = { id: decoded.uid,}

    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}
