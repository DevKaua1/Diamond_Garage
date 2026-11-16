/* ---------- Elementos da página ---------- */
const formulario = document.querySelector('form');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoSenha = document.getElementById('senha');
const botaoMostrar = document.getElementById('mostrar-senha');
const campoTermos = document.getElementById('termos');
const requisitos = document.querySelectorAll('.requisito');

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

/* ---------- Regras da senha ---------- */
/* Devolve um objeto com 3 true/false, um para cada requisito */
function verificarSenha(senha) {
    return {
        tamanho: senha.length >= 8,
        letra: /[A-Za-zÀ-ÿ]/.test(senha),
        numero: /[0-9]/.test(senha)
    };
}

/* A cada tecla, acende os requisitos cumpridos */
campoSenha.addEventListener('input', function () {
    const regras = verificarSenha(campoSenha.value);

    requisitos[0].classList.toggle('cumprido', regras.tamanho);
    requisitos[1].classList.toggle('cumprido', regras.letra);
    requisitos[2].classList.toggle('cumprido', regras.numero);
});

/* ---------- Mensagens de erro ---------- */
/* 'campo' é opcional: se vier, pinta a borda do input de vermelho */
function mostrarErro(idErro, mensagem, campo) {
    document.getElementById(idErro).textContent = mensagem;

    if (campo) {
        campo.closest('.campo').classList.add('com-erro');
    }
}

function limparErro(idErro, campo) {
    document.getElementById(idErro).textContent = '';

    if (campo) {
        campo.closest('.campo').classList.remove('com-erro');
    }
}

/* Ao voltar a digitar, a mensagem de erro daquele campo some */
campoNome.addEventListener('input', function () { limparErro('erro-nome', campoNome); });
campoEmail.addEventListener('input', function () { limparErro('erro-email', campoEmail); });
campoSenha.addEventListener('input', function () { limparErro('erro-senha', campoSenha); });
campoTermos.addEventListener('change', function () { limparErro('erro-termos'); });

/* ---------- Envio do formulário ---------- */
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); /* impede a página de recarregar */

    /* Começa achando que está tudo certo; cada erro muda para false */
    let valido = true;

    /* Nome: pelo menos 3 letras (sem contar espaços nas pontas) */
    if (campoNome.value.trim().length < 3) {
        mostrarErro('erro-nome', 'Digite seu nome completo.', campoNome);
        valido = false;
    }

    /* E-mail: texto + @ + texto + . + texto */
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!padraoEmail.test(campoEmail.value.trim())) {
        mostrarErro('erro-email', 'Digite um e-mail válido.', campoEmail);
        valido = false;
    }

    /* Senha: os 3 requisitos precisam ser true */
    const regras = verificarSenha(campoSenha.value);
    if (!(regras.tamanho && regras.letra && regras.numero)) {
        mostrarErro('erro-senha', 'A senha precisa cumprir todos os requisitos.', campoSenha);
        valido = false;
    }

    /* Termos: a caixinha precisa estar marcada */
    if (!campoTermos.checked) {
        mostrarErro('erro-termos', 'Aceite os termos para continuar.');
        valido = false;
    }

    /* Se algo falhou, para aqui e não redireciona */
    if (!valido) {
        return;
    }

    sessionStorage.setItem('emailCadastro', campoEmail.value.trim());

    /* Novo cadastro = zera a espera do reenvio */
    sessionStorage.removeItem('pedidosCodigo');
    sessionStorage.removeItem('liberadoEm');

    window.location.href = 'codigo-verificacao.html';
});