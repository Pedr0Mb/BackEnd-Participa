import {db,admin} from '../../plugins/bd.js'
import {registrarAtividade} from '../../utils/registroAtividade.js'

const denunciaRef = db.collection('Denuncia')
const comentarioRef = db.collection('Comentario')
const pautaRef = db.collection('Pauta')
const usuarioRef = db.collection('Usuario')

export async function enviarDenuncia(data) {
    const denunciaDoc = denunciaRef.add({
        idAtividade: data.idAtividade,
        tipoAtividade: data.tipoAtividade,
        motivo: data.motivo,
        descricao: data.descricao,
        linkAtividade: data.linkAtividade,
        dataPublicacao: admin.firestore.FieldValue.serverTimestamp(),
        idUsuarioReportado: data.idUsuarioReportado,
        idUsuario: data.idUsuario,
        status: 'Em aberto'
    })    

    await registrarAtividade({
        tipo: 'Denuncia',
        titulo: null,
        descricao: `Você registrou uma denuncia`,
        acao: 'Denuncia registrada ',
        payload: `Atividade denunciada: ${data.idAtividade}`,
        idUsuario: data.idUsuario,
        idAtividade: denunciaDoc.id,
  })

    return {message: 'Denúncia registrada com sucesso'}
}

export async function pesquisarDenuncia(data) {
    let query = denunciaRef.select('idAtividade','tipoAtividade','motivo','idUsuario').where("status","==",'Em aberto')

    if(data.tipoAtividade) query = query.where("tipoAtividade","==",data.tipoAtividade)

    const resultado = await query.get()
    if (resultado.empty) return []

    const denuncia = resultado.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return denuncia
}

export async function visualizarDenuncia(data) {
    const denunciaDoc = await denunciaRef.doc(data.idDenuncia)

    if(!denunciaDoc.exists){
        const err = new Error('Denuncia não encontrada')
        err.status = 404
        throw err
    }

    return denunciaDoc
}

export async function verificarDenuncia(dados) {
    const denunciaDocRef = denunciaRef.doc(dados.idDenuncia)
    const denunciaDoc = await denunciaDocRef.get()

    if (!denunciaDoc.exists) {
      const err = new Error('Denúncia não encontrada')
      err.status = 404
      throw err
    }

    const denunciaData = denunciaDoc.data()

    const data = {
      idAtividade: denunciaData.idAtividade,
      tipoAtividade: denunciaData.tipoAtividade,
      idUsuarioReportado: denunciaData.idUsuarioReportado,
      justificativa: denunciaData.justificativa,
      tipoDenuncia: denunciaData.tipoDenuncia,
      idUsuario: denunciaData.idUsuario, 
    };

    async function registrarAcao(acao, descricao) {
      await registrarAtividade({
        tipo: 'Denuncia',
        titulo: null,
        descricao: descricao,
        acao: acao,
        payload: `Atividade denunciada: ${data.idAtividade}\nUsuário denunciado: ${data.idUsuarioReportado}`,
        idUsuario: data.idUsuario,
        idAtividade: denunciaDoc.id,
      })
    }   

    if (dados.tipoDenuncia === 'remover') {
      await denunciaDocRef.delete()
      
      await registrarAcao('Denúncia removida', 'Você removeu a Denúncia')
      
      return { message: 'Denúncia verificada' }
    }

    await denunciaDocRef.update({ status: 'Verificada', justificativa: data.justificativa })
    
    if (data.tipoAtividade === 'Comentário') {

      const comentarioDoc = comentarioRef.doc(data.idAtividade)
      const comentarioSnap = await comentarioDoc.get()
      
      const Comentario = comentarioSnap.data()
      const pautaId = Comentario.idPauta

      await comentarioDoc.update({ isDeleted: true })
      
      await pautaRef.doc(pautaId).update({ qtComentario: admin.firestore.FieldValue.increment(-1) })

      await usuarioRef.doc(data.idUsuarioReportado).update({ ativo: false })
      
      await registrarAcao('Denuncia Verificada','Voçê verificou a denuncia')

      return { message: 'Denúncia feita' }
    }

    await pautaRef.doc(data.idAtividade).update({ isDeleted: true })

    await usuarioRef.doc(data.idUsuarioReportado).update({ ativo: false })

    await registrarAcao('Denuncia Verificada','Voçê verificou a denuncia')

    return { message: 'Denúncia feita' }
}
