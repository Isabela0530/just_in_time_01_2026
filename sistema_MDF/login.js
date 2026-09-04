const loginForm = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    mensagem.textContent = "";

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = dados.mensagem || "E-mail ou senha inválidos.";
            return;
        }

        localStorage.setItem("usuario", JSON.stringify(dados.usuario));

        window.location.href = "home.html";

    } catch (erro) {
        console.error(erro);

        mensagem.textContent =
            "Não foi possível conectar ao servidor.";
    }
});

