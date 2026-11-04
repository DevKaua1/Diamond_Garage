/* ---------- Mostrar / ocultar senha ---------- */
const campoSenha = document.getElementById('senha');
const botaoMostrar = document.getElementById('mostrar-senha');

botaoMostrar.addEventListener('click', function () {

    if (campoSenha.type === 'password') {
        campoSenha.type = 'text';
        botaoMostrar.textContent = 'Ocultar';
    } else {
        campoSenha.type = 'password';
        botaoMostrar.textContent = 'Mostrar';
    }
});

/* ---------- Requisitos da senha ---------- */
/* Pega os 3 <li> da lista, na ordem do HTML: [0] 8 caracteres, [1] letra, [2] número */
const requisitos = document.querySelectorAll('.requisito');

/* O evento 'input' dispara a cada letra digitada (diferente do 'click') */
campoSenha.addEventListener('input', function () {
    const senha = campoSenha.value;

    /* Cada variável guarda true ou false */
    const temTamanho = senha.length >= 8;
    const temLetra = /[A-Za-zÀ-ÿ]/.test(senha);
    const temNumero = /[0-9]/.test(senha);

    /* Liga a classe 'cumprido' se for true, desliga se for false */
    requisitos[0].classList.toggle('cumprido', temTamanho);
    requisitos[1].classList.toggle('cumprido', temLetra);
    requisitos[2].classList.toggle('cumprido', temNumero);
});