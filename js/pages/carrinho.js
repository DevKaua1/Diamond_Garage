const listaItens = document.getElementById('lista-itens');
const carrinhoCheio = document.getElementById('carrinho-cheio');
const carrinhoVazio = document.getElementById('carrinho-vazio');
const contador = document.getElementById('contador-carrinho');
const qtdItens = document.getElementById('qtd-itens');
const subtotal = document.getElementById('subtotal');
const total = document.getElementById('total');
const parcelas = document.getElementById('parcelas');
const pix = document.getElementById('pix');


function pegarCarrinho() {
  const guardado = localStorage.getItem('carrinho');

  if (guardado) {
    return JSON.parse(guardado);
  }
  return [];
}


function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}


function formatar(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


function mostrarCarrinho() {
  const carrinho = pegarCarrinho();
  let html = '';
  let soma = 0;
  let quantidadeTotal = 0;

  for (let i = 0; i < carrinho.length; i++) {
    const item = carrinho[i];
    const totalItem = item.preco * item.quantidade;

    soma = soma + totalItem;
    quantidadeTotal = quantidadeTotal + item.quantidade;

    html = html + `
      <div class="item">
        <img src="${item.imagem}" alt="${item.nome}">

        <div>
          <h3>${item.nome}</h3>
          <p class="preco-unidade">${formatar(item.preco)} cada</p>
          <div class="quantidade">
            <button onclick="diminuir(${i})">-</button>
            <span>${item.quantidade}</span>
            <button onclick="aumentar(${i})">+</button>
          </div>
        </div>

        <div class="direita">
          <p class="preco-item">${formatar(totalItem)}</p>
          <button class="remover" onclick="remover(${i})">Remover</button>
        </div>
      </div>
    `;
  }

  listaItens.innerHTML = html;
  contador.innerText = quantidadeTotal;

  if (carrinho.length == 0) {
    carrinhoCheio.style.display = 'none';
    carrinhoVazio.style.display = 'block';
    return;
  }

  carrinhoCheio.style.display = 'grid';
  carrinhoVazio.style.display = 'none';

  qtdItens.innerText = quantidadeTotal;
  subtotal.innerText = formatar(soma);
  total.innerText = formatar(soma);
  parcelas.innerText = 'ou em até 10x de ' + formatar(soma / 10);
  pix.innerText = 'No Pix: ' + formatar(soma * 0.95) + ' (5% de desconto)';
}


function aumentar(posicao) {
  const carrinho = pegarCarrinho();

  carrinho[posicao].quantidade++;
  salvarCarrinho(carrinho);
  mostrarCarrinho();
}


function diminuir(posicao) {
  const carrinho = pegarCarrinho();

  if (carrinho[posicao].quantidade > 1) {
    carrinho[posicao].quantidade--;
  }

  salvarCarrinho(carrinho);
  mostrarCarrinho();
}


function remover(posicao) {
  const carrinho = pegarCarrinho();

  carrinho.splice(posicao, 1);
  salvarCarrinho(carrinho);
  mostrarCarrinho();
}


mostrarCarrinho();