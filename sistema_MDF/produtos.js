verificarLogin();


const produtoForm = document.getElementById("produtoForm");
const listaProdutos = document.getElementById("listaProdutos");
const pesquisa = document.getElementById("pesquisa");
const btnCancelar = document.getElementById("btnCancelar");


function obterProdutos() {

    const produtos = localStorage.getItem("produtos");

    if (!produtos) {
        return [];
    }

    return JSON.parse(produtos);
}


function salvarProdutos(produtos) {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );
}


function listarProdutos(filtro = "") {

    const produtos = obterProdutos();

    listaProdutos.innerHTML = "";

    const produtosFiltrados = produtos.filter(produto =>
        produto.nome
            .toLowerCase()
            .includes(filtro.toLowerCase())
    );


    if (produtosFiltrados.length === 0) {

        listaProdutos.innerHTML = `
            <tr>
                <td colspan="7" class="sem-dados">
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;

        return;
    }


    produtosFiltrados.forEach(produto => {

        const estoqueBaixo =
            Number(produto.quantidade_estoque) <=
            Number(produto.estoque_minimo);


        const linha = document.createElement("tr");


        linha.innerHTML = `

            <td>${produto.id}</td>

            <td>
                <strong>${produto.nome}</strong>
            </td>

            <td>
                ${produto.descricao}
            </td>

            <td>
                ${formatarMoeda(produto.custo)}
            </td>

            <td class="${estoqueBaixo ? "estoque-baixo" : ""}">
                ${produto.quantidade_estoque}
            </td>

            <td>
                ${produto.estoque_minimo}
            </td>

            <td>

                <button
                    class="btn-editar"
                    onclick="editarProduto(${produto.id})"
                >
                    Editar
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirProduto(${produto.id})"
                >
                    Excluir
                </button>

            </td>

        `;


        listaProdutos.appendChild(linha);

    });

}


produtoForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const id = document.getElementById("produtoId").value;

    const nome =
        document.getElementById("nome").value.trim();

    const descricao =
        document.getElementById("descricao").value.trim();

    const custo =
        Number(document.getElementById("custo").value);

    const quantidadeEstoque =
        Number(document.getElementById("quantidadeEstoque").value);

    const estoqueMinimo =
        Number(document.getElementById("estoqueMinimo").value);

    if (!nome || !descricao) {

        mostrarMensagem(
            "Preencha todos os campos obrigatórios.",
            "erro"
        );

        return;
    }


    if (custo < 0) {

        mostrarMensagem(
            "O custo não pode ser negativo.",
            "erro"
        );

        return;
    }


    if (quantidadeEstoque < 0 || estoqueMinimo < 0) {

        mostrarMensagem(
            "As quantidades não podem ser negativas.",
            "erro"
        );

        return;
    }


    const produtos = obterProdutos();


    if (id) {

        const produto = produtos.find(
            produto => produto.id == id
        );


        if (produto) {

            produto.nome = nome;
            produto.descricao = descricao;
            produto.custo = custo;
            produto.quantidade_estoque = quantidadeEstoque;
            produto.estoque_minimo = estoqueMinimo;

        }

    }


    else {

        const novoProduto = {

            id: Date.now(),

            nome: nome,

            descricao: descricao,

            custo: custo,

            quantidade_estoque: quantidadeEstoque,

            estoque_minimo: estoqueMinimo

        };


        produtos.push(novoProduto);

    }


    salvarProdutos(produtos);

    limparFormulario();

    listarProdutos();

    mostrarMensagem(
        "Produto salvo com sucesso!",
        "sucesso"
    );

});

function editarProduto(id) {

    const produtos = obterProdutos();

    const produto = produtos.find(
        produto => produto.id == id
    );


    if (!produto) {
        return;
    }


    document.getElementById("produtoId").value =
        produto.id;

    document.getElementById("nome").value =
        produto.nome;

    document.getElementById("descricao").value =
        produto.descricao;

    document.getElementById("custo").value =
        produto.custo;

    document.getElementById("quantidadeEstoque").value =
        produto.quantidade_estoque;

    document.getElementById("estoqueMinimo").value =
        produto.estoque_minimo;


    document.getElementById("tituloFormulario").textContent =
        "Editar Produto";


    btnCancelar.style.display = "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function excluirProduto(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );


    if (!confirmar) {
        return;
    }


    let produtos = obterProdutos();


    produtos = produtos.filter(
        produto => produto.id != id
    );


    salvarProdutos(produtos);

    listarProdutos();


    mostrarMensagem(
        "Produto excluído com sucesso!",
        "sucesso"
    );

}

btnCancelar.addEventListener("click", function() {

    limparFormulario();

});

function limparFormulario() {

    produtoForm.reset();

    document.getElementById("produtoId").value = "";

    document.getElementById("tituloFormulario").textContent =
        "Novo Produto";

    btnCancelar.style.display = "none";

}

pesquisa.addEventListener("input", function() {

    listarProdutos(this.value);

});

function mostrarMensagem(texto, tipo) {

    const mensagem =
        document.getElementById("mensagemProduto");


    mensagem.textContent = texto;

    mensagem.className = "mensagem";


    if (tipo === "erro") {

        mensagem.classList.add("mensagem-erro");

    } else {

        mensagem.classList.add("mensagem-sucesso");

    }


    setTimeout(() => {

        mensagem.textContent = "";

    }, 3000);

}

listarProdutos();
