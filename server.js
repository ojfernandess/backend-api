const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

// Caminho para o arquivo JSON onde os dados serão armazenados
const dataFilePath = path.join(__dirname, "data.json");

// Função para ler os dados de data.json
const readData = () => {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, "utf8");
        return JSON.parse(data);
    }
    return { users: {} };
};

// Função para salvar os dados no arquivo data.json
const saveData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
};

// Endpoint para receber os dados do ganho
app.post("/api/profit", (req, res) => {
    const { userId, planId, profit, startTime } = req.body;

    // Carregar os dados atuais
    let data = readData();

    // Verificar se o usuário existe, caso contrário, criar o usuário
    if (!data.users[userId]) {
        data.users[userId] = {};
    }

    // Adicionar ou atualizar os ganhos do plano
    data.users[userId][planId] = {
        profit: profit,
        startTime: startTime
    };

    // Salvar os dados atualizados
    saveData(data);

    // Responder com os dados salvos
    res.json({ message: "Dados salvos com sucesso!", data });
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
