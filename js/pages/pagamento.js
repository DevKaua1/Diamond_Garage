
// =====================================================
// 1. LÊ O CARRINHO E MOSTRA NO RESUMO
// =====================================================
var itens = JSON.parse(localStorage.getItem('carrinho') || '[]').map(function (i) {
  return {
    nome:  i.nome,
    preco: parseFloat(i.preco),
    img:   i.imagem || i.img,
    qtd:   i.quantidade || i.qtd || 1
  };
});

if (itens.length === 0) {
  window.location.href = 'produto.html';   
}

function moeda(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',')
                  .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

var SUBTOTAL = itens.reduce(function (s, i) { return s + i.preco * i.qtd; }, 0);
var FRETE = 0;
var DESCONTO_PIX = 0.05;

var resumo = document.querySelector('.resumo');
resumo.querySelectorAll('.item').forEach(function (e) { e.remove(); });

var linhaSubtotal = resumo.querySelector('.ln');   // a linha "Subtotal"
itens.forEach(function (i) {
  linhaSubtotal.insertAdjacentHTML('beforebegin',
    '<div class="item">' +
      '<img src="' + i.img + '" alt="">' +
      '<div>' + i.nome + '<br><small>Qtd: ' + i.qtd + '</small></div>' +
      '<b>' + moeda(i.preco * i.qtd) + '</b>' +
    '</div>');
});


// =====================================================
// 2. SUBTOTAL, DESCONTO, TOTAL E PARCELAS
// =====================================================
function atualizarTotais(forma) {
  var desc  = (forma === 'pix') ? SUBTOTAL * DESCONTO_PIX : 0;   
  var total = SUBTOTAL + FRETE - desc;

  document.getElementById('st').textContent = moeda(SUBTOTAL);
  document.getElementById('dv').textContent = '- ' + moeda(desc);
  document.getElementById('tt').textContent = moeda(total);
  document.getElementById('desc').style.display = desc ? 'flex' : 'none';
  document.getElementById('sb').textContent =
    forma === 'card' ? 'em até 10x de ' + moeda(total / 10) + ' sem juros' :
    forma === 'pix'  ? 'à vista no Pix' : 'à vista no boleto';

  
  var sel = document.getElementById('p');
  sel.innerHTML = '';
  for (var n = 1; n <= 10; n++) {
    var op = document.createElement('option');
    op.value = n;
    op.textContent = n + 'x de ' + moeda(total / n) + ' sem juros';
    sel.appendChild(op);
  }
}


// =====================================================
// 3. ALTURAS DA CAIXA "PAGAMENTOS"
// =====================================================
var ALTURA = { pix: '650px', card: '770px', boleto: '490px' };

// aba Cartão: altura conforme os campos que estão FALTANDO
// n = número, m = nome, v = validade, c = CVV
var ALTURA_CARTAO = {
  'n,m,v,c': 880,   // nenhum preenchido
  'm,v,c':   836,   // só o número preenchido
  'n,v,c':   820,   // só o nome preenchido
  'n,m,c':   826,   // só a validade preenchida
  'n,m,v':   820    // só o CVV preenchido
};


var ALTURA_POR_QTD = [770, 790, 805, 825, 880];

var caixa = document.querySelector('.pagamentos');

function ajustarAltura() {
  var aba = document.querySelector('.pagamentos .tab.on').dataset.t;
  var h = parseInt(ALTURA[aba], 10);          // altura normal da aba

  if (aba === 'card') {
    // campo com mensagem de erro = campo que falta preencher
    var faltando = ['n', 'm', 'v', 'c'].filter(function (id) {
      return document.getElementById('erro-' + id);
    });
    if (faltando.length) {
      h = ALTURA_CARTAO[faltando.join(',')] || ALTURA_POR_QTD[faltando.length];
    }
  }

  if (aba === 'boleto' && document.getElementById('erro-cpf')) {
    h += 22;                                  
  }

  caixa.style.height = h + 'px';
}


// =====================================================
// 4. TROCA DE ABAS: Pix / Cartão / Boleto
// =====================================================
var MOSTRAR = 'block';   

var paineis = {
  pix:    document.querySelector('.pagamentos section.pix'),
  card:   document.querySelector('.pagamentos section.card'),
  boleto: document.querySelector('.pagamentos section.boleto')
};

function mostrar(nome) {
  for (var k in paineis) {
    paineis[k].style.display = (k === nome) ? MOSTRAR : 'none';
  }
  document.querySelectorAll('.pagamentos .tab').forEach(function (aba) {
    aba.classList.toggle('on', aba.dataset.t === nome);
  });
  ajustarAltura();
  atualizarTotais(nome);
}

document.querySelectorAll('.pagamentos .tab').forEach(function (aba) {
  aba.onclick = function () { mostrar(aba.dataset.t); };
});

mostrar('pix');   


// =====================================================
// 5. DADOS DO CARTÃO APARECEM NA IMAGEM
// =====================================================
document.getElementById('n').oninput = function () {
  var d = this.value.replace(/\D/g, '').slice(0, 16);        
  this.value = d.replace(/(.{4})/g, '$1 ').trim();           
  document.getElementById('pn').textContent =
    d.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();      
};

document.getElementById('m').oninput = function () {
  // só letras e espaços (aceita acentos: á, ã, ç, é...)
  this.value = this.value.replace(/[^\p{L}\s]/gu, '');
  document.getElementById('pm').textContent =
    this.value.toUpperCase() || 'NOME NO CARTÃO';
};

document.getElementById('v').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 4);
  if (s.length > 2) s = s.slice(0, 2) + '/' + s.slice(2);   
  this.value = s;
  document.getElementById('pv').textContent = s || 'MM/AA';
};

document.getElementById('c').oninput = function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 3);    
};


// =====================================================
// 6. BOTÃO COPIAR DO PIX E MÁSCARA DO CPF
// =====================================================
document.getElementById('cp').onclick = function () {
  var botao = this;
  navigator.clipboard.writeText(document.getElementById('pc').value);
  botao.textContent = 'Copiado ✓';
  setTimeout(function () { botao.textContent = 'Copiar'; }, 1500);
};

document.getElementById('cpf').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 11);
  this.value = s.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};


// =====================================================
// 7. VALIDAÇÃO
// =====================================================
function erro(input, msg) {
  input.classList.add('erro');
  var aviso = document.getElementById('erro-' + input.id);
  if (!aviso) {
    aviso = document.createElement('small');
    aviso.id = 'erro-' + input.id;
    aviso.className = 'msg-erro';
    input.insertAdjacentElement('afterend', aviso);
  }
  aviso.textContent = msg;
  ajustarAltura();                 // a caixa cresce quando aparece um erro
}

function limpar(input) {
  input.classList.remove('erro');
  var aviso = document.getElementById('erro-' + input.id);
  if (aviso) aviso.remove();
  ajustarAltura();                 // a caixa encolhe quando o erro some
}

// tira o erro assim que a pessoa começa a corrigir o campo
document.querySelectorAll('#n, #m, #v, #c, #cpf').forEach(function (campo) {
  campo.addEventListener('input', function () { limpar(campo); });
});

function validarCartao() {
  var ok = true;
  var n = document.getElementById('n');
  var m = document.getElementById('m');
  var v = document.getElementById('v');
  var c = document.getElementById('c');
  [n, m, v, c].forEach(limpar);

  if (n.value.replace(/\D/g, '').length !== 16) {
    erro(n, 'Digite os 16 números do cartão');
    ok = false;
  }

  if (m.value.trim().split(/\s+/).length < 2) {
    erro(m, 'Digite o nome completo, como está no cartão');
    ok = false;
  }

  var validadeOk = false;
  if (v.value.length === 5) {
    var mes = parseInt(v.value.slice(0, 2), 10);
    var ano = 2000 + parseInt(v.value.slice(3), 10);
    var hoje = new Date();
    var vencido = ano < hoje.getFullYear() ||
                  (ano === hoje.getFullYear() && mes < hoje.getMonth() + 1);
    validadeOk = mes >= 1 && mes <= 12 && !vencido;
  }
  if (!validadeOk) {
    erro(v, 'Validade inválida ou cartão vencido');
    ok = false;
  }

  if (c.value.length !== 3) {
    erro(c, 'Digite os 3 números do CVV');
    ok = false;
  }

  return ok;
}

function cpfValido(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;   // 111.111.111-11 não vale
  for (var t = 9; t < 11; t++) {
    var soma = 0;
    for (var i = 0; i < t; i++) soma += cpf[i] * (t + 1 - i);
    if ((soma * 10) % 11 % 10 != cpf[t]) return false;
  }
  return true;
}

function validarBoleto() {
  var cpf = document.getElementById('cpf');
  limpar(cpf);
  if (!cpfValido(cpf.value)) {
    erro(cpf, 'Digite um CPF válido');
    return false;
  }
  return true;
}


// =====================================================
// 8. FINALIZAR COMPRA
// =====================================================
document.querySelector('.pay').onclick = function () {
  var forma = document.querySelector('.pagamentos .tab.on').dataset.t;

  var liberado = true;
  if (forma === 'card')   liberado = validarCartao();
  if (forma === 'boleto') liberado = validarBoleto();
  // Pix não tem campos para preencher

  if (!liberado) {
    var primeiro = [].find.call(document.querySelectorAll('.erro'), function (e) {
      return e.offsetParent !== null;
    });
    if (primeiro) {
      primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
      primeiro.focus();
    }
    return;                                               
  }

  localStorage.removeItem('carrinho');
  
 
  pedido = document.getElementById("pedidoPopup").style.display = "flex";
function feito() {
  pedido.style.display = "flex";
}



}