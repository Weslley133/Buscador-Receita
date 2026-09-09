const btn = document.querySelector(".button");
const receita = document.getElementById("txt");
const pratosBrasileiros = [
    {
        busca: "Feijoada",
        nome: "Feijoada"
    },
    {
        busca: "Pao de queijo",
        nome: "Pão de queijo"
    },
    {
        busca: "Brigadeiro",
        nome: "Brigadeiro"
    },
    {
        busca: "Moqueca",
        nome: "Moqueca"
    },
    {
        busca: "Acaraje",
        nome: "Acarajé"
    },
    {
        busca: "Brazilian carrot cake",
        nome: "Bolo de cenoura"
    },
    {
        busca: "Coconut quindim",
        nome: "Quindim de coco"
    },

];

receita.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        btn.click();
    }
});

btn.addEventListener("click", async () => {
    const valor = receita.value.trim();

    if (valor === "") {
        alert("Digite uma receita");
        return;
    }
btn.textContent = "Gerando...";
btn.disabled = true;
    try {
        const resultado = await fetch("http://localhost:3000/api/receita", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prato: valor
            })
        });

        const dados = await resultado.json();

        if (!resultado.ok) {
            alert(dados.erro || "Ocorreu um erro.");
            return;
        }

        const listaIng = document.getElementById("ingredientes");
        const listaPre = document.getElementById("preparo");

        listaIng.innerHTML = "";
        listaPre.innerHTML = "";
        
        if (!Array.isArray(dados.ingredientes) || !Array.isArray(dados.preparo)) {
    alert("A receita retornou em um formato inesperado.");
    return;
}

        dados.ingredientes.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            listaIng.appendChild(li);
        });

        dados.preparo.forEach((passo) => {
            const li = document.createElement("li");
            li.textContent = passo;
            listaPre.appendChild(li);
        });
        receita.value = "";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar com o servidor.");
    }
    
    finally {
    btn.textContent = "Gerar Receita";
    btn.disabled = false;
}

});

async function buscarPratoAleatorio() {

    try {
   
        const prato =
    pratosBrasileiros[
        Math.floor(Math.random() * pratosBrasileiros.length)
    ];
    const nomeBusca = prato.busca;
const nomeExibicao = prato.nome;
    

       const respostaFoto = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(nomeBusca)}`
);

const dadosFoto = await respostaFoto.json();

if (dadosFoto.meals) {
    const pratoEncontrado = dadosFoto.meals[0];

    document.getElementById("foto-imagem").src = pratoEncontrado.strMealThumb;
    document.getElementById("nomeprato").textContent = nomeExibicao;
} else {
    console.log("Imagem do prato não encontrada.");
}

    } catch (erro) {
        console.error("Erro ao buscar prato:", erro);
    }
}

buscarPratoAleatorio();