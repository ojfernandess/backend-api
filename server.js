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
    console.log("Dados recebidos:", req.body); // Verifique os dados recebidos no log do backend
    const { userId, planId, profit, startTime } = req.body;

    // Verifique se todos os dados necessários foram fornecidos
    if (!userId || !planId || profit == null || !startTime) {
        return res.status(400).json({ message: "Dados incompletos." });
    }

    const data = loadData();

    // Verifique se o usuário já existe e, se não, crie um novo usuário
    if (!data.users[userId]) {
        console.log(`Usuário ${userId} não encontrado. Criando novo usuário.`);
        data.users[userId] = {}; // Cria um novo usuário
    }

    // Atualiza os dados do plano do usuário
    data.users[userId][planId] = { profit, startTime };

    // Salva os dados no arquivo
    saveData(data);

    console.log(`Dados de lucro salvos para o usuário ${userId} no plano ${planId}`);

    // Retorna uma resposta de sucesso
    res.status(200).json({ message: "Dados salvos com sucesso." });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
