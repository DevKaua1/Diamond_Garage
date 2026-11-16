/* ---------- Elementos da página ---------- */
const formulario = document.querySelector('form');
const campoEmail = document.getElementById('email');
const campoSenha = document.getElementById('senha');
const botaoMostrar = document.getElementById('mostrar-senha');

/* ---------- Mostrar / ocultar senha ---------- */
botaoMostrar.addEventListener('click', function () {
    if (campoSenha.type === 'password') {
        campoSenha.type = 'text';
        botaoMostrar.textContent = 'Ocultar';
    } else {
        campoSenha.type = 'password';
        botaoMostrar.textContent = 'Mostrar';
    }
});

/* ---------- Mensagens de erro ---------- */
function mostrarErro(idErro, mensagem, campo) {
    document.getElementById(idErro).textContent = mensagem;
    campo.closest('.campo').classList.add('com-erro');
}

function limparErro(idErro, campo) {
    document.getElementById(idErro).textContent = '';
    campo.closest('.campo').classList.remove('com-erro');
}

/* Ao voltar a digitar, o erro daquele campo some */
campoEmail.addEventListener('input', function () { limparErro('erro-email', campoEmail); });
campoSenha.addEventListener('input', function () { limparErro('erro-senha', campoSenha); });

/* ---------- Envio do formulário ---------- */
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    let valido = true;

    /* E-mail: vazio é um erro, formato errado é outro */
    const email = campoEmail.value.trim();
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
        mostrarErro('erro-email', 'Digite seu e-mail.', campoEmail);
        valido = false;
    } else if (!padraoEmail.test(email)) {
        mostrarErro('erro-email', 'Digite um e-mail válido.', campoEmail);
        valido = false;
    }

    /* Senha: só precisa não estar vazia (as regras de força são do cadastro) */
    if (campoSenha.value === '') {
        mostrarErro('erro-senha', 'Digite sua senha.', campoSenha);
        valido = false;
    }

    if (!valido) {
        return;
    }

    /* Provisório: sem servidor ainda não dá para conferir e-mail e senha.
       Por enquanto, qualquer dado no formato certo entra. */
    window.location.href = 'home.html';
});