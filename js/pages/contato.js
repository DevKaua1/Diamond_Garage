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
 
 
// 4) Mensagem de sucesso -----------------------------
function mostrarSucesso() {
  let aviso = document.querySelector(".mensagem-sucesso");
 
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.className = "mensagem-sucesso";
    aviso.setAttribute("role", "status"); // leitores de tela anunciam o aviso
    formulario.prepend(aviso); // coloca no topo do formulário
  }
 
  aviso.textContent = "Mensagem enviada! Responderemos em breve.";
}
 
function removerSucesso() {
  const aviso = document.querySelector(".mensagem-sucesso");
  if (aviso) aviso.remove();
}
 
 
// 5) O que acontece quando o usuário clica em "Enviar" ----
formulario.addEventListener("submit", function (evento) {
  // Impede o envio automático da página. Nós decidimos se envia ou não.
  evento.preventDefault();
 
  removerSucesso();
 
  // Valida todos os campos e guarda o primeiro que estiver errado
  let primeiroComErro = null;
 
  campos.forEach(function (campo) {
    const campoValido = validarCampo(campo);
    if (!campoValido && primeiroComErro === null) {
      primeiroComErro = campo;
    }
  });

  // 6) Validação em tempo real
campos.forEach(function (campo) {

  campo.addEventListener("blur", function () {
    validarCampo(campo);
  });

  campo.addEventListener("input", function () {
    const campoComErro = campo.parentElement.classList.contains("erro");
    if (campoComErro) {
      validarCampo(campo);
    }
  });
});
 
  // Se existe algum erro, leva o cursor até o primeiro campo errado e para aqui
  if (primeiroComErro !== null) {
    primeiroComErro.focus();
    return;
  }
 
  // Tudo certo!
  // Aqui, no futuro, entra o envio real (fetch para um serviço de e-mail ou back-end).
  mostrarSucesso();
  formulario.reset(); // limpa os campos
});