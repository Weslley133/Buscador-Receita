require('dotenv').config();
const api = "https://api.groq.com/openai/v1/chat/completions"

const btn = document.querySelector('.button');
const receita = document.getElementById('txt');
const foto = document.querySelector('.prato');
const sujestao = document.getElementById('nomeprato');
const tempo = document.querySelector('.item');
const ingrediente = document.querySelectorAll('.receita')




btn.addEventListener("click", async () => {
  const valor = receita.value; console.log(valor);

  if (valor === "") {
    alert("Digita uma Receita"); return;
  }
  const resultado = await fetch(api, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${process.env.MINHA_CHAVE_SECRETA}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Atue como um chef de cozinha. Retorne uma receita de ${receita.value} estritamente no formato JSON. O JSON deve ter exatamente esta estrutura:
          {"Ingredientes": [
          "1. item", 
           2. item"
          ],
          "preparo": [
          "passo 1", 
          "passo 2"
          ]}
          Não adicione nenhum texto antes ou depois do JSON.`
                }
      
      ]

    })
  }
  )
 const dados = await resultado.json()
const retorno = dados.choices[0].message.content;
const voltou = JSON.parse(retorno);
const listaIng = document.getElementById("ingredientes");
const listaPre = document.getElementById("preparo");

listaIng.innerHTML = ""
listaPre.innerHTML = ""

listaIng.innerText = voltou.Ingredientes;
listaPre.innerText = voltou.preparo;

} 
)


