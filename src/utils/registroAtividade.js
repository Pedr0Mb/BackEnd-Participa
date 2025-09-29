import { db,admin } from '../plugins/bd.js'

const registroAtividadeRef = db.collection('RegistroAtividade')

export async function registrarAtividade({idAtividade = null, tipo, acao, descricao , idUsuario, titulo = null, payload = null}) {
    try {
        await registroAtividadeRef.add({
            idAtividade,
            acao,
            idUsuario,
            tipo,
            titulo,
            payload,
            descricao,
            dataAtividade: admin.firestore.FieldValue.serverTimestamp()
        })
    } catch (error) {
        console.error('Erro ao registrar atividade:', error);
    }
}