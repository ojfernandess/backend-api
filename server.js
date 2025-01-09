const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

// Middleware para interpretar o corpo das requisições como JSON
app.use(express.json());

// Rota principal para verificar se o servidor está funcionando
app.get("/", (req, res) => {
    res.send("API está funcionando corretamente!");
});

// Endpoint para salvar os ganhos do usuário
app.post("/api/profit", (req, res) => {
    const { userId, planId, profit, startTime } = req.body;

    // Lê os dados atuais do arquivo data.json
    fs.readFile("./data.json", "utf8", (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).json({ message: "Erro ao ler o arquivo." });
        }

        let usersData = JSON.parse(data);

        // Verifica se o usuário existe e cria o usuário caso não exista
        if (!usersData.users[userId]) {
            usersData.users[userId] = {};
        }

        // Atualiza ou cria os dados de lucro do plano
        usersData.users[userId][planId] = {
            profit: profit,
            startTime: startTime,
        };

        // Salva os dados atualizados no arquivo data.json
        fs.writeFile("./data.json", JSON.stringify(usersData, null, 2), (err) => {
            if (err) {
                console.error("Erro ao salvar os dados:", err);
                return res.status(500).json({ message: "Erro ao salvar os dados." });
            }
            return res.json({ message: "Dados salvos com sucesso." });
        });
    });
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
