/* ---------- Caixinhas do código ---------- */
/* Pega as 5 caixinhas de uma vez (vira uma lista) */
const digitos = document.querySelectorAll('.digito');

/* Já deixa o cursor na primeira caixinha ao abrir a página */
digitos[0].focus();

/* forEach repete o bloco para cada caixinha.
   'digito' é a caixinha da vez e 'indice' é a posição dela (0, 1, 2, 3, 4) */
digitos.forEach(function (digito, indice) {

    /* Ao digitar: aceita só números e pula para a próxima caixinha */
    digito.addEventListener('input', function () {
        digito.value = digito.value.replace(/[^0-9]/g, '');

        if (digito.value !== '' && indice < digitos.length - 1) {
            digitos[indice + 1].focus();
        }
    });

    /* Ao apertar Backspace numa caixinha vazia: volta para a anterior e apaga */
    digito.addEventListener('keydown', function (evento) {
        if (evento.key === 'Backspace' && digito.value === '' && indice > 0) {
            digitos[indice - 1].value = '';
            digitos[indice - 1].focus();
        }
    });

    /* Ao colar (Ctrl + V): espalha o código colado pelas caixinhas */
    digito.addEventListener('paste', function (evento) {
        evento.preventDefault();

        const colado = evento.clipboardData.getData('text').replace(/[^0-9]/g, '');

        for (let i = 0; i < colado.length && indice + i < digitos.length; i++) {
            digitos[indice + i].value = colado[i];
        }

        const proximo = Math.min(indice + colado.length, digitos.length - 1);
        digitos[proximo].focus();
    });
});

/* ---------- Contagem regressiva do "Reenviar" ---------- */
/* ---------- Reenvio com espera crescente ---------- */
const contador = document.getElementById('contador');
const textoEspera = document.getElementById('texto-espera');
const textoReenvio = document.getElementById('texto-reenvio');
const botaoReenviar = document.getElementById('reenviar');

/* Tempo de espera (em segundos) a cada pedido. Depois do último, repete o último */
const esperas = [30, 60, 120, 300, 600];

/* Quantos códigos já foram pedidos (o primeiro envio conta como 1) */
let pedidos = Number(sessionStorage.getItem('pedidosCodigo')) || 1;
let relogio;

/* Transforma 90 em "1:30", 9 em "0:09", etc. */
function formatar(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;
    return minutos + ':' + String(resto).padStart(2, '0');
}

/* Roda a contagem até o horário em que o reenvio será liberado */
function rodarContador(liberadoEm) {
    textoEspera.hidden = false;
    textoReenvio.hidden = true;
    clearInterval(relogio);

    function atualizar() {
        const restante = Math.ceil((liberadoEm - Date.now()) / 1000);

        if (restante <= 0) {
            clearInterval(relogio);
            textoEspera.hidden = true;
            textoReenvio.hidden = false;
            return;
        }
        contador.textContent = formatar(restante);
    }

    atualizar();
    relogio = setInterval(atualizar, 1000);
}

/* Calcula quanto esperar neste pedido, guarda e começa a contar */
function iniciarEspera() {
    const indice = Math.min(pedidos - 1, esperas.length - 1);
    const liberadoEm = Date.now() + esperas[indice] * 1000;

    sessionStorage.setItem('pedidosCodigo', pedidos);
    sessionStorage.setItem('liberadoEm', liberadoEm);
    rodarContador(liberadoEm);
}

/* Ao abrir a página: retoma a espera que já estava rodando ou começa a primeira */
const liberadoSalvo = Number(sessionStorage.getItem('liberadoEm'));

if (liberadoSalvo) {
    rodarContador(liberadoSalvo);
} else {
    iniciarEspera();
}

/* Ao clicar em "Reenviar": um pedido a mais, então a espera sobe */
botaoReenviar.addEventListener('click', function () {
    pedidos++;
    iniciarEspera();
    /* Aqui, depois, entra o envio do novo código pelo Resend */
});

/* Lendo o e-mail do usuario na pagina em que foi realizado o cadastro para exibir na pagina de codigo-verificacao */
const emailDestino = document.getElementById('email-destino');
const emailSalvo = sessionStorage.getItem('emailCadastro');

if (emailSalvo) {
    emailDestino.textContent = emailSalvo;
}