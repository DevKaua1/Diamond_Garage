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
  window.location.href = 'produto.html';   // carrinho vazio: volta aos produtos
}

function moeda(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

var $ = function (id) { return document.getElementById(id); };
var SUBTOTAL = itens.reduce(function (s, i) { return s + i.preco * i.qtd; }, 0);

// opções de entrega (troque os valores e prazos pelos da sua loja)
var FRETES = {
  padrao:   { nome: 'Entrega padrão',  valor: 0,     prazo: '5 a 8 dias úteis' },
  expresso: { nome: 'Entrega expressa', valor: 29.90, prazo: '2 a 3 dias úteis' }
};

$('itens').innerHTML = itens.map(function (i) {
  return '<div class="item"><img src="' + i.img + '" alt="">' +
         '<div>' + i.nome + '<br><small>Qtd: ' + i.qtd + '</small></div>' +
         '<b>' + moeda(i.preco * i.qtd) + '</b></div>';
}).join('');

function opcaoEscolhida() {
  return document.querySelector('input[name="frete"]:checked').value;
}

function atualizarResumo() {
  var f = FRETES[opcaoEscolhida()];
  $('st').textContent = moeda(SUBTOTAL);
  $('fr').textContent = f.valor ? moeda(f.valor) : 'Grátis';
  $('tt').textContent = moeda(SUBTOTAL + f.valor);
  $('prazo').textContent = f.prazo;
  document.querySelectorAll('.opcao').forEach(function (o) {
    o.classList.toggle('on', o.querySelector('input').checked);
  });
}

document.querySelectorAll('input[name="frete"]').forEach(function (r) {
  r.onchange = atualizarResumo;
});
atualizarResumo();


// =====================================================
// 2. ESTADOS (lista do campo "Estado")
// =====================================================
var UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
$('uf').innerHTML = '<option value="">UF</option>' + UFS.map(function (u) {
  return '<option value="' + u + '">' + u + '</option>';
}).join('');


// =====================================================
// 3. MÁSCARAS
// =====================================================
$('nome').oninput = function () {
  this.value = this.value.replace(/[^\p{L}\s]/gu, '');           // só letras e espaços
};

$('cpf').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 11);
  this.value = s.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

$('tel').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 11);
  if (s.length > 10)      s = s.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (s.length > 6)  s = s.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  else if (s.length > 2)  s = s.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  this.value = s;
};

$('numero').oninput = function () {
  this.value = this.value.replace(/\D/g, '');
};


// =====================================================
// 4. CEP: preenche o endereço sozinho (serviço gratuito ViaCEP)
// =====================================================
function aviso(texto) {
  var a = $('aviso-cep');
  if (!a) {
    a = document.createElement('small');
    a.id = 'aviso-cep';
    a.className = 'msg-cep';
    $('cep').insertAdjacentElement('afterend', a);
  }
  a.textContent = texto;
}

$('cep').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 8);
  this.value = s.length > 5 ? s.slice(0, 5) + '-' + s.slice(5) : s;
  if (s.length < 8) { aviso(''); return; }

  aviso('Buscando endereço...');
  fetch('https://viacep.com.br/ws/' + s + '/json/')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.erro) { aviso('CEP não encontrado. Preencha o endereço manualmente.'); return; }
      $('rua').value    = d.logradouro || '';
      $('bairro').value = d.bairro || '';
      $('cidade').value = d.localidade || '';
      $('uf').value     = d.uf || '';
      ['rua', 'bairro', 'cidade', 'uf'].forEach(function (id) { limpar($(id)); });
      aviso('');
      $('numero').focus();                                         // falta só o número
    })
    .catch(function () { aviso('Não foi possível buscar o CEP. Preencha manualmente.'); });
};


// =====================================================
// 5. VALIDAÇÃO
// =====================================================
function erro(input, msg) {
  input.classList.add('erro');
  var a = $('erro-' + input.id);
  if (!a) {
    a = document.createElement('small');
    a.id = 'erro-' + input.id;
    a.className = 'msg-erro';
    input.insertAdjacentElement('afterend', a);
  }
  a.textContent = msg;
}

function limpar(input) {
  input.classList.remove('erro');
  var a = $('erro-' + input.id);
  if (a) a.remove();
}

document.querySelectorAll('#form input[type=text], #form select').forEach(function (c) {
  c.addEventListener('input', function () { limpar(c); });
  c.addEventListener('change', function () { limpar(c); });
});

function cpfValido(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  for (var t = 9; t < 11; t++) {
    var soma = 0;
    for (var i = 0; i < t; i++) soma += cpf[i] * (t + 1 - i);
    if ((soma * 10) % 11 % 10 != cpf[t]) return false;
  }
  return true;
}

function validar() {
  var ok = true;
  function checa(id, condicao, msg) {
    limpar($(id));
    if (!condicao) { erro($(id), msg); ok = false; }
  }

  checa('nome',   $('nome').value.trim().split(/\s+/).length >= 2, 'Digite nome e sobrenome');
  checa('cpf',    cpfValido($('cpf').value),                       'Digite um CPF válido');
  checa('tel',    $('tel').value.replace(/\D/g, '').length >= 10,   'Digite o telefone com DDD');
  checa('cep',    $('cep').value.replace(/\D/g, '').length === 8,   'Digite os 8 números do CEP');
  checa('rua',    $('rua').value.trim().length >= 3,                'Digite o endereço');
  checa('numero', $('numero').value.trim().length >= 1,             'Digite o número');
  checa('bairro', $('bairro').value.trim().length >= 2,             'Digite o bairro');
  checa('cidade', $('cidade').value.trim().length >= 2,             'Digite a cidade');
  checa('uf',     $('uf').value !== '',                             'Escolha o estado');
  return ok;
}


// =====================================================
// 6. CONTINUAR PARA O PAGAMENTO
// =====================================================
$('form').onsubmit = function (e) {
  e.preventDefault();

  if (!validar()) {
    var primeiro = document.querySelector('.erro');
    primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
    primeiro.focus();
    return;                                                        // para aqui: não segue
  }

  var opcao = opcaoEscolhida();
  localStorage.setItem('entrega', JSON.stringify({
    nome:   $('nome').value.trim(),
    cpf:    $('cpf').value,
    tel:    $('tel').value,
    cep:    $('cep').value,
    rua:    $('rua').value.trim(),
    numero: $('numero').value.trim(),
    comp:   $('comp').value.trim(),
    bairro: $('bairro').value.trim(),
    cidade: $('cidade').value.trim(),
    uf:     $('uf').value,
    opcao:  opcao,
    frete:  FRETES[opcao].valor,
    prazo:  FRETES[opcao].prazo
  }));

  window.location.href = 'pagamento.html';
};


// =====================================================
// 7. SE A PESSOA VOLTAR, OS DADOS JÁ ESTÃO PREENCHIDOS
// =====================================================
var salvo = JSON.parse(localStorage.getItem('entrega') || 'null');
if (salvo) {
  ['nome', 'cpf', 'tel', 'cep', 'rua', 'numero', 'comp', 'bairro', 'cidade', 'uf'].forEach(function (id) {
    $(id).value = salvo[id] || '';
  });
  document.querySelector('input[name="frete"][value="' + salvo.opcao + '"]').checked = true;
  atualizarResumo();
}
