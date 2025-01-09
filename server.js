const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simulação de banco de dados com arquivo JSON
const DATABASE = "data.json";

// Função para carregar os dados
function loadData() {
    if (!fs.existsSync(DATABASE)) {
        fs.writeFileSync(DATABASE, JSON.stringify({ users: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATABASE));
}

// Função para salvar os dados
function saveData(data) {
    fs.writeFileSync(DATABASE, JSON.stringify(data, null, 2));
}

// Rota para salvar ou atualizar lucros
app.post("/api/profit", (req, res) => {
    const { userId, planId, profit, startTime } = req.body;

    if (!userId || !planId || profit == null || !startTime) {
        return res.status(400).json({ message: "Dados incompletos." });
    }

    const data = loadData();

    // Atualiza os dados do usuário
    if (!data.users[userId]) {
        data.users[userId] = {};
    }
    data.users[userId][planId] = { profit, startTime };

    saveData(data);
    res.status(200).json({ message: "Dados salvos com sucesso." });
});

// Rota para recuperar lucros
app.get("/api/profit/:userId", (req, res) => {
    const { userId } = req.params;
    const data = loadData();

    if (!data.users[userId]) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json(data.users[userId]);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
