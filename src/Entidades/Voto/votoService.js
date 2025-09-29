import { db } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'

const votacaoRef = db.collection('Votacao')

export async function registrarVoto(data) {
    const votacaoDoc = await votacaoRef.doc(data.idPauta).get() 
    
    if(!votacaoDoc.exists){
        const err = new Error('Votação não encontrada')
        err.status = 404
        throw err
    }

    const votacao = votacaoDoc.data()

    const novasOpcoes = votacao.opcoesResposta.map(opcao => {
        if (opcao.id === data.idOpcaoResposta) {
            return { ...opcao, qtVotos: opcao.qtVotos + 1 };
        }
        return opcao;
    });

    await votacaoRef.update({opcoesResposta: novasOpcoes});

    await registrarAtividade({
        tipo: 'Voto',
        descricao: `Você registrou seu voto`,
        acao: 'Voto registrado',
        payload: `Opção votada id:${data.idOpcaoResposta}`,
        idUsuario: data.idUsuario,
        idAtividade: data.idPauta,
    })

  return novasOpcoes;
}