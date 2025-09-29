import { db,admin } from '../../plugins/bd.js'
import { registrarAtividade } from '../../utils/registroAtividade.js'

const votacaoRef = db.collection('Votacao')
const resultadoRef = db.collection('Resultado')

export async function pesquisarVotacao(data) {
    let query = votacaoRef.select('titulo','status', 'dataInicio','dataFim','imagem','tituloLower','dataInicio')

    if(data.titulo) { query = query.where('tituloLower','==',data.titulo.toLowerCase())}
    if(data.status) { query = query.where('status','==',data.status)}

    const resultado = await query.orderBy('dataInicio','asc').get()
    if(resultado.empty){ return [] }
    const votacao = resultado.docs.map(doc => ({id: doc.id, ...doc.data()})) 

    return votacao
}

export async function visualizarVotacao(idVotacao) {
    const votacaoDoc = await votacaoRef.doc(idVotacao).get()

    if(!votacaoDoc.exists){
        const err = new Error('Votação não encontrada')
        err.status = 404
        throw err
    }

    const votacaoData = votacaoDoc.data();
    const dataFim = votacaoData.dataFim.toDate();
    const dataInico = votacaoData.dataInicio.toDate()
    const agora = new Date();

    const descricaoQuery = await descricaoRef.where('tipoAtividade','==','Descrição').where('idItem','==',idVotacao).get()

    if(agora >= dataInico && agora <= dataFim && votacao.status !==  'Rascunho') await votacaoRef.doc(idVotacao).update({status: 'Em andamento'})
    if (agora >= dataFim && votacaoData.status !== "Encerrada") await encerrarVotacao(votacaoDoc)

    const votacao = {
         id: votacaoDoc.id,
          ...votacaoData,
        descricoes: descricaoQuery.docs.map(doc => ({id: doc.id, ...doc.data() }))
    }

    return votacao
}

export async function criarVotacao(data) {
     const urlFoto = await salvarFoto( data.arquivoFoto.buffer,`noticia/${Date.now()}/foto`,data.arquivoFoto.mimetype);

    const votacaoDoc = await votacaoRef.add({
        titulo: data.titulo,
        descricao: data.descricao,
        publicoAlvo: data.publicoAlvo,
        orcamento: data.orcamento,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        imagem: urlFoto,
        opcoesResposta: data.opcoesResposta.map((opcao, index) => ({
            id: index+1,
            titulo: opcao.titulo,
            qtVotos: 0 
        })),
        tituloLower: data.titulo.toLowerCase(),
        status: 'Rascunho',
        dataPublicacao: admin.firestore.FieldValue.serverTimestamp(),
    })

    await Promise.all(
        data.descricoes.map(desc => descricaoRef.add({
        titulo: desc.titulo,
        info: desc.info,
        tipo: 'Descrição',
        idItem: votacaoDoc.id,
        dataCriacao: admin.firestore.FieldValue.serverTimestamp()
      }))
      )

    await registrarAtividade({
        tipo: 'Votação',
        descricao: `Você criou uma Votação`,
        acao: 'Votação criada',
        idUsuario: data.idUsuario,
        idAtividade: votacaoDoc.id,
    })

  return { message: 'Votação criada com sucesso'}
}

export async function editarVotacao(data) {
    const votacaoDoc =  await votacaoRef.doc(data.idVotacao).get()

    if(!votacaoDoc.exists || votacaoDoc.data().isDeleted){
        const err = new Error('Votação não encontrada')
        err.status = 404
        throw err
    }

    let urlFoto = votacaoDoc.data().imagem

    if(votacaoDoc.data().status !== 'Rascunho'){
        const err = new Error('Votação não pode ser alterada')
        err.status = 400
        throw err
    }
    
    if (data.arquivoFoto) {
      const oldPath = urlFoto.split(`https://storage.googleapis.com/${bucket.name}/`)[1]
      if (oldPath) await bucket.file(oldPath).delete()
      urlFoto = await salvarFoto(data.arquivoFoto.buffer,`noticia/${Date.now()}/foto`,data.arquivoFoto.mimetype)
    }

    const updateData = {
        titulo: data.titulo,
        descricao: data.descricao,
        publicoAlvo: data.publicoAlvo,
        orcamento: data.orcamento,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        imagem: urlFoto,
        opcoesResposta: data.opcoesResposta.map((opcao,index) => ({
            id: index+1,
            titulo: opcao.titulo,
            qtVotos: 0 
        })),
        tituloLower: data.titulo.toLowerCase(),
        dataAtualizacao: admin.firestore.FieldValue.serverTimestamp(),
    }

    await atualizarDecricoes({
        descricoes: data.descricoes,
        tipo: 'Descrição',
        idItem: data.idVotacao
    })

    await votacaoRef.doc(data.idVotacao).update(updateData)

    await registrarAtividade({
        tipo: 'Votação',
        descricao: `Você editou uma Votação`,
        acao: 'Votação editada',
        idUsuario: data.idUsuario,
        idAtividade: data.idVotacao,
    })

    return { message: 'Votação atualizada com sucesso'}
}

export async function deletarVotacao(data) {
    const votacaoDoc =  await votacaoRef.doc(data.idVotacao).get()

    if(!votacaoDoc.exists || votacaoDoc.data().isDeleted){
        const err = new Error('Votação não encontrada')
        err.status = 404
        throw err
    }

    await atualizarDecricoes({ descricoes: [], tipo: 'Descrição', idItem: data.idVotacao})

    await votacaoRef.doc(data.idVotacao).update({isDeleted: true})

    await registrarAtividade({
        tipo: 'Votação',
        descricao: `Você editou uma Votação`,
        acao: 'Votação editou',
        idUsuario: data.idUsuario,
        idAtividade: data.idVotacao,
    })

  return { message: 'Votação atualizada com sucesso'}
}

async function encerrarVotacao(votacaoDoc) {
    const votacao = votacaoDoc.data();
    const opcoes = votacao.opcoesResposta; 

    await votacaoRef.doc(votacaoDoc.id).update({ status: "Encerrada" });

    const vencedorObj = opcoes.reduce((maior, opcaoAtual) => {
        return opcaoAtual.qtVotos > maior.qtVotos ? opcaoAtual : maior;
    }, { qtVotos: -1, titulo: null });

    await resultadoRef.doc(votacaoDoc.id).set({
        id_votacao: votacaoDoc.id,
        titulo: votacao.titulo,
        dataInicio: votacao.dataInicio,
        dataFim: votacao.dataFim,
        opcoes: opcoes.map((opcao, index) => ({
            id_opcao: index + 1,
            titulo: opcao.titulo,
            votos: opcao.qtVotos
        })),
        vencedor: {
            titulo: vencedorObj.titulo,
            votos: vencedorObj.qtVotos
        },
        atualizado_em: admin.firestore.FieldValue.serverTimestamp()
    });

    return { vencedor, votos: vencedorObj.qtVotos };
}
