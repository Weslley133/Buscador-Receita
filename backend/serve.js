const express = require('express');
const cors = require('cors');
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/receita", async (req, res) => {
    try {
        const { prato } = req.body;

        if (!prato) {
            return res.status(400).json({
                erro: "Informe o nome de um prato."
            });
        }
        const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.CHAVE}`
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",

                    messages: [
                        {
                            role: "system",
                            content: `Você é um chef de cozinha.
                            Retorne somente um JSON válido neste formato:
                            {
                            "ingredientes": ["ingrediente 1", "ingrediente 2"],
                            "preparo": ["passo 1", "passo 2"]
                        }
                            Não escreva nenhum texto fora do JSON.`
                        },
                        {
                            role: "user", 
                            content: `Gere uma receita de ${prato}.`

                        }
                    ],
                    response_format: {
                        type:"json_object"
                    }
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.log("Erro da Groq:", dados);
            return res.status(resposta.status).json({
                erro: "Erro ao consultar a inteligência artificial."
            });

        }

        const receita = JSON.parse(
            dados.choices[0].message.content
        );

        res.json(receita);

    } catch (erro) {
        console.error("Erro no servidor:", erro);

        res.status(500).json({
            erro: "erro interno do servidor."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

                    
            