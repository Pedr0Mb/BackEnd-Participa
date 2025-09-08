/* Usuários */

DROP PROCEDURE IF EXISTS pesquisarUsuarios;
DELIMITER //
CREATE PROCEDURE pesquisarUsuarios(
    IN nomeUsuario VARCHAR(100),
    IN cpfUsuario VARCHAR(11),
    IN cargoUsuario VARCHAR(40)
)
BEGIN
    SELECT 
        id_usuario,
        nm_usuario,
        cpf_usuario,
        email_usuario,
        cargo_usuario,
        telefone_usuario
    FROM Usuario
    WHERE (nomeUsuario   IS NULL OR nm_usuario   LIKE CONCAT('%', nomeUsuario, '%'))
      AND (cpfUsuario    IS NULL OR cpf_usuario   = cpfUsuario)
      AND (cargoUsuario  IS NULL OR cargo_usuario = cargoUsuario)
    ORDER BY nm_usuario;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarUsuario;
DELIMITER //
CREATE PROCEDURE visualizarUsuario(IN idUsuario INT)
BEGIN
    SELECT * 
    FROM Usuario 
    WHERE id_usuario = idUsuario;
END //
DELIMITER ;

/* Votações */

DROP PROCEDURE IF EXISTS visualizarVotacao;
DELIMITER //
CREATE PROCEDURE visualizarVotacao(IN p_idVotacao INT)
BEGIN
    SELECT *
    FROM Votacao
    WHERE id_votacao = p_idVotacao;

    SELECT *
    FROM OpcoesResposta
    WHERE id_votacao = p_idVotacao
    ORDER BY qtVotos_opcaoResposta DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS pesquisarVotacoes;
DELIMITER //
CREATE PROCEDURE pesquisarVotacoes(
    IN statusVotacao VARCHAR(30),
    IN tituloVotacao VARCHAR(50),
    IN temaVotacao   VARCHAR(50)
)
BEGIN
    SELECT 
        id_votacao,
        titulo_votacao,
        tema_votacao,
        dataFim_votacao,
        anexos_votacao,
        status_votacao,
        resultado_votacao
    FROM Votacao
    WHERE (statusVotacao IS NULL OR status_votacao = statusVotacao)
      AND (tituloVotacao IS NULL OR titulo_votacao = tituloVotacao)
      AND (temaVotacao   IS NULL OR tema_votacao   = temaVotacao)
    ORDER BY dataFim_votacao DESC;
END //
DELIMITER ;


/* Notícias */

DROP PROCEDURE IF EXISTS pesquisarNoticias;
DELIMITER //
CREATE PROCEDURE pesquisarNoticias(
    IN titulo       VARCHAR(100),
    IN temaNoticia  VARCHAR(50)
)
BEGIN
    SELECT 
        id_noticia,
        titulo_noticia,
        dataPublicacao_noticia,
        midia_noticia,
        tema_noticia
    FROM Noticia
    WHERE (titulo      IS NULL OR titulo_noticia LIKE CONCAT('%', titulo, '%'))
      AND (temaNoticia IS NULL OR tema_noticia   = temaNoticia)
    ORDER BY dataPublicacao_noticia DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarNoticias;
DELIMITER //
CREATE PROCEDURE visualizarNoticias(IN idNoticia INT)
BEGIN
    SELECT * 
    FROM Noticia 
    WHERE id_noticia = idNoticia;
END //
DELIMITER ;


/* Transmissões */

DROP PROCEDURE IF EXISTS pesquisarTransmissao;
DELIMITER //
CREATE PROCEDURE pesquisarTransmissao(
    IN titulo            VARCHAR(100),
    IN statusTransmissao VARCHAR(30)
)
BEGIN
    SELECT 
        id_transmissao,
        titulo_transmissao,
        dataInicio_transmissao,
        midia_transmissao
    FROM Transmissao
    WHERE (titulo            IS NULL OR titulo_transmissao LIKE CONCAT('%', titulo, '%'))
      AND (statusTransmissao IS NULL OR status_transmissao  = statusTransmissao)
    ORDER BY dataInicio_transmissao DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarTransmissao;
DELIMITER //
CREATE PROCEDURE visualizarTransmissao(IN idTransmissao INT)
BEGIN
    SELECT * 
    FROM Transmissao 
    WHERE id_transmissao = idTransmissao;
END //
DELIMITER ;

/* Registro de Atividade */

DROP PROCEDURE IF EXISTS visualizarHistorico;
DELIMITER //
CREATE PROCEDURE visualizarHistorico(
    IN p_idUsuario  INT,
    IN data_inicio  DATETIME,
    IN tipoAtividade VARCHAR(45)
)
BEGIN
    SELECT 
        id_registroAtividade,
        id_atividade,
        date_atividade,
        tipo_atividade,
        titulo_atividade,
        link_atividade
    FROM RegistroAtividade
    WHERE id_usuario = p_idUsuario
      AND (data_inicio IS NULL OR date_atividade BETWEEN data_inicio AND NOW())
      AND (tipoAtividade IS NULL OR tipo_atividade = tipoAtividade)
    ORDER BY date_atividade DESC;
END //
DELIMITER ;

/* Pautas */

DROP PROCEDURE IF EXISTS pesquisarPautas;
DELIMITER //
CREATE PROCEDURE pesquisarPautas(
    IN tituloPauta VARCHAR(100),
    IN statusPauta VARCHAR(25)
)
BEGIN
    SELECT 
        id_pauta,
        titulo_pauta,
        dataPublicacao_pauta,
        id_usuario,
        imagem_pauta
    FROM Pauta
    WHERE (tituloPauta IS NULL OR titulo_pauta LIKE CONCAT('%', tituloPauta, '%'))
      AND (statusPauta IS NULL OR status_pauta = statusPauta)
    ORDER BY dataPublicacao_pauta DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS visualizarPauta;
DELIMITER //
CREATE PROCEDURE visualizarPauta(IN idPauta INT)
BEGIN
    SELECT 
        id_pauta,
        titulo_pauta,
        descricao_pauta,
        justificativa_pauta,
        dataPublicacao_pauta,
        imagem_pauta,
        status_pauta
    FROM Pauta
    WHERE id_pauta = idPauta;

    SELECT 
        c.id_comentario,
        c.texto_comentario,
        c.dataPublicacao_comentario,
        c.id_usuario AS autor_comentario
    FROM Comentario c
    WHERE c.id_pauta = idPauta
    ORDER BY c.dataPublicacao_comentario DESC;
END //
DELIMITER ;
