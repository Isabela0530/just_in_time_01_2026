const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const banco = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

async function testarBanco() {
    try {
        const conexao = await banco.getConnection();
        console.log("Banco de dados conectado com sucesso!");
        conexao.release();
    } catch (erro) {
        console.error("Erro ao conectar ao banco de dados:");
        console.error(erro);
    }
}

app.get("/", (req, res) => {
    res.json({
        mensagem: "Servidor Just in Time MDF funcionando!"
    });
});

app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "E-mail e senha são obrigatórios."
            });
        }

        const [usuarios] = await banco.execute(
            "SELECT id, nome, email FROM usuario WHERE email = ? AND senha = ?",
            [email, senha]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
        }

        const usuario = usuarios[0];

        res.json({
            mensagem: "Login realizado com sucesso!",
            usuario: usuario
        });

    } catch (erro) {
        console.error("Erro no login:", erro);

        res.status(500).json({
            mensagem: "Erro interno do servidor."
        });
    }
});

app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    await testarBanco();
});