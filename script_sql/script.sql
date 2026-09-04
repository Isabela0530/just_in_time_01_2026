CREATE DATABASE IF NOT EXISTS preparacao_db;

USE preparacao_db;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    custo DECIMAL(10,2) NOT NULL,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0
);

CREATE TABLE movimentacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('FABRICADO', 'PEDIDO') NOT NULL,
    quantidade INT NOT NULL,
    data DATE NOT NULL,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,

    CONSTRAINT fk_movimentacao_produto
        FOREIGN KEY (produto_id)
        REFERENCES produto(id),

    CONSTRAINT fk_movimentacao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);

INSERT INTO usuario (nome, email, senha) VALUES
('João Silva', 'joao@email.com', '123456'),
('Maria Oliveira', 'maria@email.com', '123456'),
('Carlos Santos', 'carlos@email.com', '123456');


INSERT INTO produto
(nome, descricao, custo, quantidade_estoque, estoque_minimo)
VALUES
('Porta-retrato MDF', 'Porta-retrato decorativo produzido em MDF', 15.50, 20, 5),
('Prateleira MDF', 'Prateleira de parede produzida em MDF', 35.90, 12, 4),
('Caixa Organizadora MDF', 'Caixa organizadora decorativa em MDF', 28.75, 8, 3);


INSERT INTO movimentacao
(tipo, quantidade, data, produto_id, usuario_id)
VALUES
('FABRICADO', 10, '2026-09-01', 1, 1),
('PEDIDO', 5, '2026-09-01', 2, 2),
('FABRICADO', 7, '2026-09-02', 3, 3);


SELECT * FROM usuario;

SELECT * FROM produto;

SELECT * FROM movimentacao;