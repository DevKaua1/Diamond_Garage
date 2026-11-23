const produtos = [
  {
    id: 1,
    nome: 'Escapamento Dore Esportivo Titan Fan 160',
    categoria: 'Escapamentos',
    preco: 567.99,
    imagem: '../Images/produto-escapamento-sem-fundo.png',
    descricao: 'Escapamento esportivo pensado para quem quer dar mais personalidade à moto, tanto no visual quanto no som. O desenho esportivo muda a aparência da lateral e deixa o conjunto com cara de moto preparada, e o som fica mais marcante do que o do escapamento original. É indicado para as motos Titan e Fan 160, mas confira a compatibilidade com o seu modelo e ano antes de comprar. Em caso de dúvida sobre a instalação, fale com a gente no WhatsApp.'
  },
  {
    id: 2,
    nome: 'Aerofólio Traseiro Universal estilo GT',
    categoria: 'Aerofólios',
    preco: 999.99,
    imagem: '../Images/produto-aerofolio-sem-fundo.png',
    descricao: 'Aerofólio traseiro universal no estilo GT, inspirado nos carros de pista, que deixa a traseira do carro mais imponente e esportiva. Por ser universal, ele pode ser usado em vários modelos, mas o encaixe e a posição de fixação dependem do formato da tampa do porta-malas. Por isso, confira as medidas do seu carro antes de comprar. Para um resultado bonito e seguro, recomendamos fazer a instalação em uma oficina de confiança.'
  },
  {
    id: 3,
    nome: 'Volante Esportivo Gti Grafite Renault Clio',
    categoria: 'Volantes',
    preco: 896.43,
    imagem: '../Images/produto-volante-sem-fundo.png',
    descricao: 'Volante esportivo na cor grafite, que renova o interior do carro e deixa a direção com um toque mais esportivo. O acabamento diferenciado muda o visual do painel e faz diferença toda vez que você senta para dirigir. Ele foi pensado para o Renault Clio, então confira o ano e a versão do seu carro antes de comprar. Na instalação, tenha cuidado com o airbag e com os comandos do volante original, e faça o serviço com um profissional.'
  },
  {
    id: 4,
    nome: 'Estrela Emblema Do Capô Mercedes',
    categoria: 'Emblemas',
    preco: 323.87,
    imagem: '../Images/produto-emblema-sem-fundo.png',
    descricao: 'Estrela emblema para o capô, que dá um toque de sofisticação ao visual frontal do carro e valoriza o acabamento de quem cuida de cada detalhe. É uma forma simples de mudar a identidade da dianteira sem precisar trocar peças grandes. Antes de comprar, confira o tamanho e o tipo de fixação para o seu veículo. Se tiver qualquer dúvida sobre o encaixe, é só chamar a gente no WhatsApp.'
  },
  {
    id: 5,
    nome: 'Retrovisor Kawasaki Z400 Rosca Honda',
    categoria: 'Retrovisores',
    preco: 37.96,
    imagem: '../Images/produto-retrovisor-sem-fundo.png',
    descricao: 'Par de retrovisores com visual esportivo inspirado na Kawasaki Z400, para quem quer trocar o espelho original por algo mais estiloso. Além de melhorar a aparência da moto, ele mantém a função principal de dar boa visão traseira ao piloto. A rosca é do padrão Honda, então confira a medida da rosca da sua moto antes de comprar. Se precisar de ajuda para ter certeza do encaixe, fale com a gente no WhatsApp.'
  },
  {
    id: 6,
    nome: 'Spoiler Dianteiro Universal Ajustável',
    categoria: 'Aerofólios',
    preco: 448.91,
    imagem: '../Images/Lip%20splitter%20dianteiro.png',
    descricao: 'Spoiler dianteiro universal e ajustável, que deixa a frente do carro com um visual mais baixo, esportivo e agressivo. Por ser ajustável, ele se adapta a diferentes modelos, o que ajuda a conseguir um encaixe melhor no para-choque. É uma ótima opção para quem quer um kit mais completo, combinando com um aerofólio traseiro. Como a peça fica na parte baixa do carro, tome cuidado com lombadas e rampas, e faça a instalação com atenção.'
  },
  {
    id: 7,
    nome: 'New Ponteiras De Escapamento',
    categoria: 'Escapamentos',
    preco: 55.79,
    imagem: '../Images/New_Ponteiras_HD_sem_fundo.png',
    descricao: 'Ponteiras de escapamento disponíveis em vários modelos e cores, para dar um acabamento esportivo à saída do escape e deixar a traseira do carro com mais presença. É uma forma simples e barata de renovar o visual sem trocar o escapamento inteiro. Antes de comprar, confira o diâmetro do seu escapamento para garantir o encaixe. Se ficar na dúvida sobre qual modelo escolher, fale com a gente no WhatsApp.'
  },
  {
    id: 8,
    nome: 'Grade Frontal Esportiva Civic G10',
    categoria: 'Grades',
    preco: 949.00,
    imagem: '../Images/Civic_HD_sem_fundo%20(1).png',
    descricao: 'Grade frontal esportiva feita para o Honda Civic G10, que renova o visual da dianteira e dá ao carro um ar mais esportivo e moderno. Como a grade é a primeira coisa que as pessoas veem, é uma das trocas que mais mudam a aparência do carro. Ela serve para a geração G10 do Civic, então confira o ano e a versão do seu carro antes de comprar. Para um bom acabamento, recomendamos a instalação em uma oficina de confiança.'
  },
  {
    id: 9,
    nome: 'Rodas Aro 17 Eclipse 4x100 Kr Krmai K63 Esportivas',
    categoria: 'Rodas',
    preco: 1299.90,
    imagem: '../Images/produto-roda.png',
    descricao: 'Jogo de rodas esportivas aro 17, furação 4x100, modelo Eclipse K63 da Kr Krmai, para quem quer renovar por completo o visual do carro. Rodas novas mudam a aparência do conjunto e combinam com quem busca um estilo mais esportivo. Antes de comprar, confira se o seu carro usa furação 4x100 e se o aro 17 é compatível com o seu modelo, incluindo a medida dos pneus. Se precisar de ajuda para conferir, fale com a gente no WhatsApp.'
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