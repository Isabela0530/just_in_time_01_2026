function verificarLogin() {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        window.location.href = "index.html";
        return null;
    }

    return JSON.parse(usuario);
}

function obterUsuario() {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        return null;
    }

    return JSON.parse(usuario);
}

function sair() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

