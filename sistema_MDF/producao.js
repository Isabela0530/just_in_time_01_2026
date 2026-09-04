const usuarioLogado = verificarLogin();

const producaoForm =
    document.getElementById("producaoForm");

const produtoSelect =
    document.getElementById("produto");

const estoqueLista =
    document.getElementById("estoqueLista");

const historicoLista =
    document.getElementById("historicoLista");

function obterProdutosProducao() {

    const produtos =
        localStorage.getItem("produtos");

    if (!produtos) {
        return [];
    }

    return JSON.parse(produtos);
}


function salvarProdutosProducao(produtos) {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}

function obterMovimentacoes() {

    const movimentacoes =
        localStorage.getItem("movimentacoes");

    if (!movimentacoes) {
        return [];
    }

    return JSON.parse(movimentacoes);

}


function salvarMovimentacoes(movimentacoes) {

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

}

function carregarProdutos() {

    const produtos =
        obterProdutosProducao();

    produtos.sort((a, b) =>
        a.nome.localeCompare(b.nome)
    );


    produtoSelect.innerHTML = `
        <option value="">
            Selecione um produto
        </option>
    `;


    produtos.forEach(produto => {

        const option =
            document.createElement("option");


        option.value = produto.id;

        option.textContent =
            produto.nome;


        produtoSelect.appendChild(option);

    });

}

function listarEstoque() {

    const produtos =
        obterProdutosProducao();


    estoqueLista.innerHTML = "";


    if (produtos.length === 0) {

        estoqueLista.innerHTML = `
            <tr>
                <td colspan="4" class="sem-dados">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;

        return;
    }


    produtos
        .sort((a, b) =>
            a.nome.localeCompare(b.nome)
        )
        .forEach(produto => {

            const estoqueBaixo =
                Number(produto.quantidade_estoque) <=
                Number(produto.estoque_minimo);


            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>
                    <strong>
                        ${produto.nome}
                    </strong>
                </td>

                <td>
                    ${produto.quantidade_estoque}
                </td>

                <td>
                    ${produto.estoque_minimo}
                </td>

                <td>

                    ${
                        estoqueBaixo
                        ?
                        `<span class="status-alerta">
                            ⚠ Estoque baixo
                        </span>`
                        :
                        `<span class="status-ok">
                            ✓ Estoque normal
                        </span>`
                    }

                </td>

            `;


            estoqueLista.appendChild(linha);

        });

}

function listarHistorico() {

    const movimentacoes =
        obterMovimentacoes();


    const produtos =
        obterProdutosProducao();


    historicoLista.innerHTML = "";


    if (movimentacoes.length === 0) {

        historicoLista.innerHTML = `
            <tr>
                <td colspan="6" class="sem-dados">
                    Nenhuma movimentação registrada.
                </td>
            </tr>
        `;

        return;
    }


    movimentacoes
        .slice()
        .reverse()
        .forEach(movimentacao => {


            const produto =
                produtos.find(
                    p => p.id == movimentacao.produto_id
                );


            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>
                    ${movimentacao.id}
                </td>

                <td>
                    ${produto ? produto.nome : "Produto removido"}
                </td>

                <td>

                    ${
                        movimentacao.tipo === "FABRICADO"
                        ?
                        `<span class="tipo-fabricado">
                            FABRICADO
                        </span>`
                        :
                        `<span class="tipo-pedido">
                            PEDIDO
                        </span>`
                    }

                </td>

                <td>
                    ${movimentacao.quantidade}
                </td>

                <td>
                    ${formatarData(movimentacao.data)}
                </td>

                <td>
                    ${movimentacao.usuario_nome}
                </td>

            `;


            historicoLista.appendChild(linha);

        });

}

producaoForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const produtoId =
            document.getElementById("produto").value;


        const tipo =
            document.getElementById("tipo").value;


        const quantidade =
            Number(
                document.getElementById("quantidade").value
            );


        const data =
            document.getElementById("data").value;


        // Validação

        if (!produtoId || !tipo || !quantidade || !data) {

            mostrarMensagemProducao(
                "Preencha todos os campos.",
                "erro"
            );

            return;
        }


        if (quantidade <= 0) {

            mostrarMensagemProducao(
                "A quantidade deve ser maior que zero.",
                "erro"
            );

            return;
        }


        const produtos =
            obterProdutosProducao();


        const produto =
            produtos.find(
                p => p.id == produtoId
            );


        if (!produto) {

            mostrarMensagemProducao(
                "Produto não encontrado.",
                "erro"
            );

            return;
        }

        if (tipo === "PEDIDO") {

            if (
                quantidade >
                Number(produto.quantidade_estoque)
            ) {

                mostrarMensagemProducao(
                    "Quantidade solicitada maior que o estoque disponível.",
                    "erro"
                );

                return;
            }


            produto.quantidade_estoque -= quantidade;

        }

        if (tipo === "FABRICADO") {

            produto.quantidade_estoque += quantidade;

        }


        salvarProdutosProducao(produtos);

        const movimentacoes =
            obterMovimentacoes();


        const novaMovimentacao = {

            id: Date.now(),

            tipo: tipo,

            quantidade: quantidade,

            data: data,

            produto_id: produto.id,

            usuario_id:
                usuarioLogado.id,

            usuario_nome:
                usuarioLogado.nome

        };


        movimentacoes.push(
            novaMovimentacao
        );


        salvarMovimentacoes(
            movimentacoes
        );

        let mensagem =
            "Movimentação registrada com sucesso!";


        if (
            tipo === "PEDIDO" &&
            produto.quantidade_estoque <=
            produto.estoque_minimo
        ) {

            mensagem +=
                ` ⚠ Atenção: o estoque de ${produto.nome} está abaixo ou no limite mínimo.`;

        }

        producaoForm.reset();

        carregarProdutos();

        listarEstoque();

        listarHistorico();


        mostrarMensagemProducao(
            mensagem,
            tipo === "PEDIDO" &&
            produto.quantidade_estoque <=
            produto.estoque_minimo
                ? "alerta"
                : "sucesso"
        );

    }
);

function mostrarMensagemProducao(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagemProducao"
        );


    mensagem.textContent = texto;

    mensagem.className =
        "mensagem";


    if (tipo === "erro") {

        mensagem.classList.add(
            "mensagem-erro"
        );

    }

    else if (tipo === "alerta") {

        mensagem.classList.add(
            "mensagem-alerta"
        );

    }

    else {

        mensagem.classList.add(
            "mensagem-sucesso"
        );

    }


    setTimeout(() => {

        mensagem.textContent = "";

    }, 5000);

}

document.getElementById("data").value =
    new Date().toISOString().split("T")[0];

carregarProdutos();

listarEstoque();

listarHistorico();
