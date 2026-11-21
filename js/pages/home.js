const campoBusca = document.getElementById('campo-busca');
const botaoBusca = document.getElementById('botao-busca');
const ordenar = document.getElementById('ordenar');
const lista = document.getElementById('lista-produtos');
const total = document.getElementById('total');
const vazio = document.getElementById('vazio');
const contador = document.getElementById('contador-carrinho');
const botoesFiltro = document.querySelectorAll('.filtro');
const produtos = Array.from(document.querySelectorAll('.produto'));
const ordemOriginal = produtos.slice();

var nav    = document.getElementById('menu-mobile');
var toggle = document.getElementById('menu-toggle');

var ICONE_ABRIR  = '../Images/menu-hamburger.svg';
var ICONE_FECHAR = '../Images/menu-fechar.svg';

function abrir(aberto) {
  nav.classList.toggle('aberto', aberto);
  toggle.src = aberto ? ICONE_FECHAR : ICONE_ABRIR;       // troca ☰ por ✕
  toggle.alt = aberto ? 'Fechar menu' : 'Abrir menu';
  toggle.setAttribute('aria-expanded', aberto);
}

toggle.addEventListener('click', function (e) {
  e.stopPropagation();
  abrir(!nav.classList.contains('aberto'));
});

toggle.addEventListener('keydown', function (e) {         // teclado
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') abrir(false);
});

document.addEventListener('click', function (e) {         // clicar fora fecha
  if (!nav.contains(e.target)) abrir(false);
});

window.addEventListener('resize', function () {           // tela grande: fecha
  if (window.innerWidth > 1023) abrir(false);
});

// marca a página atual em dourado
var arquivo = location.pathname.split('/').pop() || 'home.html';
document.querySelectorAll('.menu-links a').forEach(function (a) {
  if (a.getAttribute('href') === arquivo) a.classList.add('atual');
});




















let categoriaAtual = 'Todos';


function mostrarProdutos() {
  const texto = campoBusca.value.toLowerCase();
  let quantidade = 0;

  for (let i = 0; i < produtos.length; i++) {
    const nome = produtos[i].querySelector('h3').innerText.toLowerCase();
    const categoria = produtos[i].getAttribute('data-categoria');

    if ((categoriaAtual == 'Todos' || categoria == categoriaAtual) && nome.includes(texto)) {
      produtos[i].style.display = 'flex';
      quantidade++;
    } else {
      produtos[i].style.display = 'none';
    }
  }

  if (quantidade == 1) {
    total.innerText = '1 produto encontrado';
  } else {
    total.innerText = quantidade + ' produtos encontrados';
  }

  if (quantidade == 0) {
    vazio.style.display = 'block';
  } else {
    vazio.style.display = 'none';
  }
}


function ordenarProdutos() {
  const tipo = ordenar.value;
  let novaOrdem = ordemOriginal.slice();

  if (tipo == 'menor') {
    novaOrdem.sort(function (a, b) {
      return a.getAttribute('data-preco') - b.getAttribute('data-preco');
    });
  }

  if (tipo == 'maior') {
    novaOrdem.sort(function (a, b) {
      return b.getAttribute('data-preco') - a.getAttribute('data-preco');
    });
  }

  for (let i = 0; i < novaOrdem.length; i++) {
    lista.appendChild(novaOrdem[i]);
  }
}


function pegarCarrinho() {
  const guardado = localStorage.getItem('carrinho');

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


function adicionarAoCarrinho(produto, botao) {
  const carrinho = pegarCarrinho();
  const nome = produto.querySelector('h3').innerText;
  const preco = Number(produto.getAttribute('data-preco'));
  const imagem = produto.querySelector('img').getAttribute('src');
  let achou = false;

  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome == nome) {
      carrinho[i].quantidade++;
      achou = true;
    }
  }

  if (achou == false) {
    carrinho.push({ nome: nome, preco: preco, imagem: imagem, quantidade: 1 });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContador();

  botao.innerText = 'Adicionado ✓';
  setTimeout(function () {
    botao.innerText = 'Adicionar ao carrinho';
  }, 1200);
}


for (let i = 0; i < botoesFiltro.length; i++) {
  botoesFiltro[i].addEventListener('click', function () {
    for (let j = 0; j < botoesFiltro.length; j++) {
      botoesFiltro[j].classList.remove('ativo');
    }

    botoesFiltro[i].classList.add('ativo');
    categoriaAtual = botoesFiltro[i].innerText;
    mostrarProdutos();
  });
}

for (let i = 0; i < produtos.length; i++) {
  const botao = produtos[i].querySelector('.comprar');
  const link = produtos[i].querySelector('a').getAttribute('href');

  botao.addEventListener('click', function () {
    adicionarAoCarrinho(produtos[i], botao);
  });

  produtos[i].addEventListener('click', function (evento) {
    if (evento.target != botao) {
      window.location.href = link;
    }
  });
}

ordenar.addEventListener('change', ordenarProdutos);
campoBusca.addEventListener('keyup', mostrarProdutos);
botaoBusca.addEventListener('click', mostrarProdutos);

atualizarContador();

