const produtos = [
  {
    id: 1,
    nome: 'Escapamento Dore Esportivo Titan Fan 160',
    categoria: 'Escapamentos',
    preco: 567.99,
    imagem: '../Images/produto-escapamento-sem-fundo.png',
    descricao: 'Escapamento esportivo para dar mais estilo e um som mais marcante à sua moto. Confira a compatibilidade com o seu modelo antes de comprar.'
  },
  {
    id: 2,
    nome: 'Aerofólio Traseiro Universal estilo GT',
    categoria: 'Aerofólios',
    preco: 999.99,
    imagem: '../Images/produto-aerofolio-sem-fundo.png',
    descricao: 'Aerofólio traseiro universal estilo GT, para deixar o visual do carro mais esportivo.'
  },
  {
    id: 3,
    nome: 'Volante Esportivo Gti Grafite Renault Clio',
    categoria: 'Volantes',
    preco: 896.43,
    imagem: '../Images/produto-volante-sem-fundo.png',
    descricao: 'Volante esportivo na cor grafite, com acabamento que muda o visual do interior do carro.'
  },
  {
    id: 4,
    nome: 'Estrela Emblema Do Capô Mercedes',
    categoria: 'Emblemas',
    preco: 323.87,
    imagem: '../Images/produto-emblema-sem-fundo.png',
    descricao: 'Estrela emblema para o capô, para dar um toque de sofisticação ao visual frontal do carro.'
  },
  {
    id: 5,
    nome: 'Retrovisor Kawasaki Z400 Rosca Honda',
    categoria: 'Retrovisores',
    preco: 37.96,
    imagem: '../Images/produto-retrovisor-sem-fundo.png',
    descricao: 'Par de retrovisores esportivos com rosca para moto Honda. Confira a medida da rosca antes de comprar.'
  },
  {
    id: 6,
    nome: 'Spoiler Dianteiro Universal Ajustável',
    categoria: 'Aerofólios',
    preco: 448.91,
    imagem: '../Images/Lip%20splitter%20dianteiro.png',
    descricao: 'Spoiler dianteiro universal e ajustável, para deixar a frente do carro com um visual mais esportivo.'
  },
  {
    id: 7,
    nome: 'New Ponteiras De Escapamento',
    categoria: 'Escapamentos',
    preco: 55.79,
    imagem: '../Images/New_Ponteiras_HD_sem_fundo.png',
    descricao: 'Ponteiras de escapamento em vários modelos e cores, para dar acabamento esportivo na saída do escape.'
  },
  {
    id: 8,
    nome: 'Grade Frontal Esportiva Civic G10',
    categoria: 'Grades',
    preco: 949.00,
    imagem: '../Images/Civic_HD_sem_fundo%20(1).png',
    descricao: 'Grade frontal esportiva para Honda Civic G10, para renovar o visual da frente do carro.'
  },
  {
    id: 9,
    nome: 'Rodas Aro 17 Eclipse 4x100 Kr Krmai K63 Esportivas',
    categoria: 'Rodas',
    preco: 1299.90,
    imagem: '../Images/produto-roda.png',
    descricao: 'Jogo de rodas esportivas aro 17, furação 4x100, acabamento preto com detalhes diamantados. Confira a furação do seu carro antes de comprar.'
  }
];

const detalhe = document.getElementById('detalhe');
const naoEncontrado = document.getElementById('nao-encontrado');
const contador = document.getElementById('contador-carrinho');

let produtoAtual = null;
let quantidade = 1;


function formatar(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


function pegarId() {
  const parametros = new URLSearchParams(window.location.search);
  return Number(parametros.get('id'));
}


function buscarProduto(id) {
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id == id) {
      return produtos[i];
    }
  }
  return null;
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


function mostrarProduto() {
  document.title = produtoAtual.nome + ' | Diamond Garage';
  document.getElementById('caminho-nome').innerText = produtoAtual.nome;
  document.getElementById('imagem').src = produtoAtual.imagem;
  document.getElementById('imagem').alt = produtoAtual.nome;
  document.getElementById('categoria').innerText = produtoAtual.categoria;
  document.getElementById('nome').innerText = produtoAtual.nome;
  document.getElementById('preco').innerText = formatar(produtoAtual.preco);
  document.getElementById('descricao').innerText = produtoAtual.descricao;
  document.getElementById('pix').innerText = 'No Pix: ' + formatar(produtoAtual.preco * 0.95) + ' (5% de desconto)';

  if (produtoAtual.preco >= 100) {
    document.getElementById('parcelas').innerText = 'ou em até 10x de ' + formatar(produtoAtual.preco / 10);
  } else {
    document.getElementById('parcelas').innerText = 'à vista';
  }
}


function aumentar() {
  quantidade++;
  document.getElementById('quantidade').innerText = quantidade;
}


function diminuir() {
  if (quantidade > 1) {
    quantidade--;
  }
  document.getElementById('quantidade').innerText = quantidade;
}


function guardarNoCarrinho() {
  const carrinho = pegarCarrinho();
  let achou = false;

  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome == produtoAtual.nome) {
      carrinho[i].quantidade = carrinho[i].quantidade + quantidade;
      achou = true;
    }
  }

  if (achou == false) {
    carrinho.push({
      nome: produtoAtual.nome,
      preco: produtoAtual.preco,
      imagem: produtoAtual.imagem,
      quantidade: quantidade
    });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContador();
}


function adicionar() {
  const botao = document.getElementById('btn-adicionar');

  guardarNoCarrinho();

  botao.innerText = 'Adicionado ✓';
  setTimeout(function () {
    botao.innerText = 'Adicionar ao carrinho';
  }, 1200);
}


function comprarAgora() {
  guardarNoCarrinho();
  window.location.href = 'carrinho.html';
}


produtoAtual = buscarProduto(pegarId());

if (produtoAtual == null) {
  detalhe.style.display = 'none';
  naoEncontrado.style.display = 'block';
  document.querySelector('.caminho').style.display = 'none';
} else {
  mostrarProduto();
}

atualizarContador();