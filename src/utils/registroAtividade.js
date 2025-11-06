import { db, admin } from '../plugins/bd.js'
import { getNextId } from './getNextId.js'

const registroAtividadeRef = db.collection('RegistroAtividade')

export async function registrarAtividade({ idAtividade = null, tipo, acao, descricao, idUsuario, titulo = null, payload = null }) {
    try {
        const novoId = await getNextId('RegistroAtividade')
        await registroAtividadeRef.doc(String(novoId)).set({
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
        console.error('Erro ao registrar atividade:', error)
    }
}
