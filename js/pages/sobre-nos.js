const contador = document.getElementById("contador-carrinho");

function pegarCarrinho() {
  const guardado = localStorage.getItem("carrinho");

  if (guardado) {
    return JSON.parse(guardado);
  }
  return [];
}

function atualizarContador() {
  const carrinho = pegarCarrinho();
  let soma = 0;

  for (let i = 0; i < carrinho.length; i++) {
    soma = soma + carrinho[i].quantidade;
  }

  contador.innerText = soma;
}

atualizarContador();