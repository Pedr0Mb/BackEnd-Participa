CREATE DATABASE participacaoCidadaBd;
USE participacaoCidadaBd;

DROP TABLE IF EXISTS Usuario;
CREATE TABLE Usuario (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nm_usuario VARCHAR(100) NOT NULL,
  email_usuario VARCHAR(100) NOT NULL,
  senha_usuario TEXT NOT NULL,
  telefone_usuario VARCHAR(11),
  cpf_usuario VARCHAR(11) NOT NULL,
  cargo_usuario ENUM('Administrador','Gestor','cidadao') NOT NULL,
  secretaria_usuario ENUM('Educação','Segurança','Cultura','Saúde'),
  imagem_usuario TEXT,
  PRIMARY KEY (id_usuario),
  UNIQUE (cpf_usuario)
);

CREATE TABLE Permissao (
  id_permissao INT NOT NULL AUTO_INCREMENT,
  nome_permissao ENUM('Publicar Noticia', 'Agendar Transmissao', 'Criar Votacao', 'Moderar Conteudo') NOT NULL,
  PRIMARY KEY (id_permissao)
);

CREATE TABLE PermissaoUsuario (
  id_permissaoUsuario INT NOT NULL AUTO_INCREMENT,
  id_permissao INT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_permissao),
  FOREIGN KEY (id_permissao) REFERENCES Permissao(id_permissao),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

DROP TABLE IF EXISTS Votacao;
CREATE TABLE Votacao (
  id_votacao INT NOT NULL AUTO_INCREMENT,
  titulo_votacao VARCHAR(50) NOT NULL,
  tema_votacao ENUM('Educação','Segurança','Cultura','Saúde') NOT NULL,
  breveDescritivo_votacao VARCHAR(256) NOT NULL,
  publicoAlvo_votacao VARCHAR(256) NOT NULL,
  orçamento_votacao VARCHAR(256) NOT NULL,
  dataPublicação_votacao DATETIME NOT NULL,
  dataFim_votacao DATETIME NOT NULL,
  status_votacao ENUM('Em andamento','Encerrada') NOT NULL,
  imagem_votacao TEXT,
  resultado_votacao VARCHAR(100) DEFAULT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_votacao),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

DROP TABLE IF EXISTS OpcoesResposta;
CREATE TABLE OpcoesResposta (
  id_opcoesResposta INT NOT NULL AUTO_INCREMENT,
  titulo_opcaoResposta VARCHAR(50) NOT NULL,
  qtVotos_opcaoResposta INT NOT NULL DEFAULT 0,
  id_votacao INT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_opcoesResposta),
  FOREIGN KEY (id_votacao) REFERENCES Votacao(id_votacao) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

DROP TABLE IF EXISTS Voto;
CREATE TABLE Voto (
  id_voto INT NOT NULL AUTO_INCREMENT,
  data_voto DATETIME NOT NULL,
  id_usuario INT NOT NULL,
  id_opcoesResposta INT NOT NULL,
  PRIMARY KEY (id_voto),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
  FOREIGN KEY (id_opcoesResposta) REFERENCES OpcoesResposta(id_opcoesResposta) ON DELETE CASCADE
);

DROP TABLE IF EXISTS RegistroAtividade;
CREATE TABLE RegistroAtividade (
  id_registroAtividade INT NOT NULL AUTO_INCREMENT,
  tipo_atividade VARCHAR(50) NOT NULL,
  titulo_atividade VARCHAR(256),
  link_atividade TEXT,
  date_atividade DATETIME NOT NULL,
  id_usuario INT NOT NULL,
  id_atividade INT,
  PRIMARY KEY (id_registroAtividade),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

DROP TABLE IF EXISTS Noticia;
CREATE TABLE Noticia (
  id_noticia INT NOT NULL AUTO_INCREMENT,
  titulo_noticia VARCHAR(50) NOT NULL,
  tema_noticia ENUM('Educação','Segurança','Cultura','Saúde') NOT NULL,
  dataPublicacao_noticia DATETIME NOT NULL,
  dataLimite_noticia DATETIME NOT NULL,
  status_noticia ENUM('Ativo','Inativo') NOT NULL,
  breveDescritivo_noticia VARCHAR(256) NOT NULL,
  link_noticia TEXT NOT NULL,
  imagem_noticia TEXT,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_noticia),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

DROP TABLE IF EXISTS Transmissao;
CREATE TABLE Transmissao (
  id_transmissao INT NOT NULL AUTO_INCREMENT,
  titulo_transmissao VARCHAR(50) NOT NULL,
  tema_transmissao ENUM('Educação','Segurança','Cultura','Saúde') NOT NULL,
  status_transmissao ENUM('Agendada','Ao Vivo','Encerrada') NOT NULL,
  dataPublicacao_transmissao DATETIME NOT NULL,
  dataInicio_transmissao DATETIME NOT NULL,
  breveDescritivo_transmissao VARCHAR(256) NOT NULL,
  link_transmissao TEXT NOT NULL,
  imagem_transmissao TEXT,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_transmissao),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

DROP TABLE IF EXISTS Pauta;
CREATE TABLE Pauta (
  id_pauta INT NOT NULL AUTO_INCREMENT ,
  titulo_pauta VARCHAR(50) NOT NULL,
  descricao_pauta TEXT NOT NULL,
  justificativa_pauta VARCHAR(256) NOT NULL,
  dataPublicacao_pauta DATETIME NOT NULL,
  dataLimite_pauta DATETIME NOT NULL,
  imagem_pauta TEXT,
  status_pauta ENUM('Ativo','Inativo') NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_pauta),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

DROP TABLE IF EXISTS Comentario;
CREATE TABLE Comentario (
  id_comentario INT NOT NULL AUTO_INCREMENT,
  texto_comentario VARCHAR(256) NOT NULL,
  dataPublicacao_comentario DATETIME NOT NULL,
  id_usuario INT NOT NULL,
  id_pauta INT NOT NULL,
  PRIMARY KEY (id_comentario),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
  FOREIGN KEY (id_pauta) REFERENCES Pauta(id_pauta) ON DELETE CASCADE
);
