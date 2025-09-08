import { db } from '../plugins/bd.js'

export async function registrarAtividade(idAtividade = null, tipo, titulo = null, link = null, idUsuario) {
    try {
        await db.query(
            `INSERT INTO RegistroAtividade 
            (tipo_atividade, titulo_atividade, link_atividade, date_atividade, id_usuario, id_atividade)
            VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
            [tipo, titulo, link, idUsuario, idAtividade]
        );
    } catch (error) {
        console.error('Erro ao registrar atividade:', error);
    }
}
