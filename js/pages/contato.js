// =====================================================
// contato.js — Validação do formulário de contato
// Diamond Garage
// =====================================================

// 1) Pegando os elementos da página ------------------
const formulario = document.querySelector("form");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoAssunto = document.getElementById("assunto");
const campoMensagem = document.getElementById("mensagem");

// Lista com todos os campos, na mesma ordem em que aparecem na tela.
// Usamos essa ordem para saber qual é o "primeiro campo com erro".
const campos = [campoNome, campoEmail, campoAssunto, campoMensagem];


// 2) Regras de validação -----------------------------
// Cada função recebe o texto digitado e devolve:
//   - uma mensagem de erro (texto), se algo estiver errado
//   - "" (texto vazio), se estiver tudo certo
const regras = {
  nome(valor) {
    if (valor === "") return "Digite seu nome completo.";
    if (valor.length < 3) return "O nome precisa ter pelo menos 3 letras.";
    return "";
  },

  email(valor) {
    if (valor === "") return "Digite seu e-mail.";
    // Formato básico: algo@dominio.com
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!formatoEmail.test(valor)) {
      return "Digite um e-mail válido, por exemplo voce@exemplo.com";
    }
    return "";
  },

  assunto(valor) {
    if (valor === "") return "Informe o assunto da sua mensagem.";
    return "";
  },

  mensagem(valor) {
    if (valor === "") return "Escreva sua mensagem.";
    if (valor.length < 10) {
      return "A mensagem está muito curta. Escreva pelo menos 10 caracteres.";
    }
    return "";
  },
};


// 3) Funções que mostram e removem os erros ----------

// Mostra a mensagem de erro embaixo do campo e destaca ele em vermelho
function mostrarErro(campo, mensagem) {
  const caixa = campo.parentElement; // a <div class="field"> do campo

  // Procura o <span> de erro; se ainda não existir, cria um
  let erro = caixa.querySelector(".mensagem-erro");
  if (!erro) {
    erro = document.createElement("span");
    erro.className = "mensagem-erro";
    erro.id = "erro-" + campo.id;
    caixa.appendChild(erro);
  }

  erro.textContent = mensagem;
  caixa.classList.add("erro");

  // Acessibilidade: avisa leitores de tela que o campo está inválido
  campo.setAttribute("aria-invalid", "true");
  campo.setAttribute("aria-describedby", erro.id);
}

// Remove a mensagem de erro e a borda vermelha do campo
function limparErro(campo) {
  const caixa = campo.parentElement;
  const erro = caixa.querySelector(".mensagem-erro");

  if (erro) erro.remove();
  caixa.classList.remove("erro");
  campo.removeAttribute("aria-invalid");
  campo.removeAttribute("aria-describedby");
}

// Valida UM campo. Devolve true se estiver correto, false se tiver erro.
function validarCampo(campo) {
  const valor = campo.value.trim(); // trim() tira espaços do começo e do fim
  const mensagem = regras[campo.id](valor);

  if (mensagem !== "") {
    mostrarErro(campo, mensagem);
    return false;
  }

  limparErro(campo);
  return true;
}


// 4) Comprovante de envio (pop-up) -------------------

// Gera um número de protocolo, por exemplo: DG-20261112-4827
function gerarProtocolo() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const sufixo = Math.floor(1000 + Math.random() * 9000); // número de 4 dígitos
  return "DG-" + ano + mes + dia + "-" + sufixo;
}

// Cria uma linha do comprovante: um título pequeno e o valor embaixo
function criarLinha(titulo, valor) {
  const linha = document.createElement("div");
  linha.className = "comprovante-linha";

  const rotulo = document.createElement("small");
  rotulo.textContent = titulo;

  const conteudo = document.createElement("span");
  conteudo.textContent = valor; // textContent é seguro: não interpreta HTML digitado

  linha.append(rotulo, conteudo);
  return linha;
}

// Monta e abre o pop-up. Recebe um objeto com os dados do envio.
function mostrarComprovante(dados) {
  // Se já existir um comprovante aberto, remove antes de criar outro
  const antigo = document.getElementById("comprovante");
  if (antigo) antigo.remove();

  // <dialog> é o elemento nativo de pop-up: ele já cuida do fundo escuro,
  // da tecla Esc para fechar e de manter o foco dentro da janela.
  const janela = document.createElement("dialog");
  janela.id = "comprovante";
  janela.className = "comprovante";
  janela.setAttribute("aria-labelledby", "comprovante-titulo");

  const conteudo = document.createElement("div");
  conteudo.className = "comprovante-conteudo";

  const titulo = document.createElement("h2");
  titulo.id = "comprovante-titulo";
  titulo.textContent = "Mensagem enviada!";

  const intro = document.createElement("p");
  intro.className = "comprovante-intro";
  intro.textContent = "Recebemos sua mensagem e responderemos em breve no e-mail informado.";

  const botaoFechar = document.createElement("button");
  botaoFechar.type = "button"; // "button" para não enviar o formulário
  botaoFechar.textContent = "Fechar";
  botaoFechar.addEventListener("click", function () {
    janela.close();
  });

  conteudo.append(
    titulo,
    intro,
    criarLinha("Protocolo", dados.protocolo),
    criarLinha("Data e hora", dados.dataHora),
    criarLinha("Nome", dados.nome),
    criarLinha("E-mail", dados.email),
    criarLinha("Assunto", dados.assunto),
    criarLinha("Mensagem", dados.mensagem),
    botaoFechar
  );
  janela.appendChild(conteudo);

  // Clicar no fundo escuro (fora da janela) também fecha
  janela.addEventListener("click", function (evento) {
    if (evento.target === janela) janela.close();
  });

  // Quando fechar (botão, Esc ou fundo), remove o pop-up da página
  janela.addEventListener("close", function () {
    janela.remove();
  });

  document.body.appendChild(janela);
  janela.showModal(); // abre como pop-up por cima de tudo
}


// 5) O que acontece quando o usuário clica em "Enviar" ----
formulario.addEventListener("submit", function (evento) {
  // Impede o envio automático da página. Nós decidimos se envia ou não.
  evento.preventDefault();

  // Valida todos os campos e guarda o primeiro que estiver errado
  let primeiroComErro = null;

  campos.forEach(function (campo) {
    const campoValido = validarCampo(campo);
    if (!campoValido && primeiroComErro === null) {
      primeiroComErro = campo;
    }
  });

  // Se existe algum erro, leva o cursor até o primeiro campo errado e para aqui
  if (primeiroComErro !== null) {
    primeiroComErro.focus();
    return;
  }

  // Tudo certo!
  // IMPORTANTE: guardamos os dados ANTES de limpar o formulário,
  // senão o comprovante apareceria vazio.
  const dados = {
    protocolo: gerarProtocolo(),
    dataHora: new Date().toLocaleString("pt-BR"),
    nome: campoNome.value.trim(),
    email: campoEmail.value.trim(),
    assunto: campoAssunto.value.trim(),
    mensagem: campoMensagem.value.trim(),
  };

  // Aqui, no futuro, entra o envio real (fetch para um serviço de e-mail ou back-end).
  formulario.reset(); // limpa os campos
  mostrarComprovante(dados);
});


// 6) Validação em tempo real -------------------------
campos.forEach(function (campo) {

  // blur = o usuário saiu do campo. Nesse momento conferimos o que ele digitou.
  campo.addEventListener("blur", function () {
    validarCampo(campo);
  });

  // input = o usuário digitou ou apagou algo.
  // Só revalidamos se o campo JÁ está com erro, assim a mensagem some
  // (ou muda) assim que ele corrige.
  campo.addEventListener("input", function () {
    const campoComErro = campo.parentElement.classList.contains("erro");
    if (campoComErro) {
      validarCampo(campo);
    }
  });
});