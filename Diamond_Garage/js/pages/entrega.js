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
  padrao:   { valor: 0,     prazo: '5 a 8 dias úteis' },
  expresso: { valor: 29.90, prazo: '2 a 3 dias úteis' }
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
// 2. ESTADOS DO BRASIL (campo "Estado")
// =====================================================
var ESTADOS = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará',
  DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão',
  MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará',
  PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
  SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
};

$('uf').innerHTML = '<option value="">Selecione o estado</option>' +
  Object.keys(ESTADOS).map(function (sigla) {
    return '<option value="' + sigla + '">' + ESTADOS[sigla] + '</option>';
  }).join('');


// =====================================================
// 3. TAMANHO DO CARD PRINCIPAL (.cont)
//    cresce quando aparecem erros e volta ao normal quando somem
// =====================================================
var caixa = document.querySelector('.cont');
var ALTURA_BASE = caixa.offsetHeight;          // altura que o card tem no CSS, sem erros

function ajustarAltura() {
  caixa.style.height = 'auto';                 // deixa o card crescer conforme o conteúdo
  caixa.style.minHeight = ALTURA_BASE + 'px';  // mas nunca menor que o tamanho original
}


// =====================================================
// 4. CAMPOS: tipo texto + máscaras
// =====================================================
// campos type="number" não aceitam ponto, traço e parênteses: troca por texto
['cpf', 'telefone', 'cep', 'numero'].forEach(function (id) {
  $(id).type = 'text';
  $(id).setAttribute('inputmode', 'numeric');   // teclado de números no celular
});
$('cpf').maxLength = 14;
$('telefone').maxLength = 15;
$('cep').maxLength = 9;
$('numero').maxLength = 6;

$('name').oninput = function () {
  this.value = this.value.replace(/[^\p{L}\s]/gu, '');           // só letras e espaços
};

$('cpf').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 11);
  this.value = s.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

$('telefone').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 11);
  if (s.length > 10)     s = s.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (s.length > 6) s = s.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  else if (s.length > 2) s = s.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  this.value = s;
};

$('numero').oninput = function () {
  this.value = this.value.replace(/\D/g, '');
};


// =====================================================
// 5. CEP: preenche o endereço sozinho (serviço gratuito ViaCEP)
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
  a.style.display = texto ? 'block' : 'none';
  ajustarAltura();
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
// 6. VALIDAÇÃO (o campo fica vermelho quando digita errado)
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
  ajustarAltura();                              // o card cresce
}

function limpar(input) {
  input.classList.remove('erro');
  var a = $('erro-' + input.id);
  if (a) a.remove();
  ajustarAltura();                              // o card encolhe
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

// regra de cada campo: "ok" diz se o valor está certo, "msg" é o aviso em vermelho
var REGRAS = {
  name:     { ok: function (v) { return v.trim().length >= 5 && v.trim().split(/\s+/).length >= 2; }, msg: 'Digite nome e sobrenome' },
  cpf:      { ok: cpfValido,                                                                          msg: 'CPF inválido' },
  telefone: { ok: function (v) { var n = v.replace(/\D/g, '').length; return n === 10 || n === 11; }, msg: 'Digite o telefone com DDD' },
  cep:      { ok: function (v) { return v.replace(/\D/g, '').length === 8; },                         msg: 'Digite os 8 números do CEP' },
  rua:      { ok: function (v) { return v.trim().length >= 3; },                                      msg: 'Digite o endereço' },
  numero:   { ok: function (v) { return v.trim().length >= 1; },                                      msg: 'Digite o número' },
  bairro:   { ok: function (v) { return v.trim().length >= 2; },                                      msg: 'Digite o bairro' },
  cidade:   { ok: function (v) { return v.trim().length >= 2; },                                      msg: 'Digite a cidade' },
  uf:       { ok: function (v) { return v !== ''; },                                                  msg: 'Escolha o estado' }
};

// confere um campo. "exigir" = true também reprova campo vazio (usado no botão Continuar)
function checarCampo(id, exigir) {
  var campo = $(id);
  var valor = campo.value;

  if (!valor.trim() && !exigir) { limpar(campo); return true; }   // vazio: fica neutro

  if (REGRAS[id].ok(valor)) { limpar(campo); return true; }

  erro(campo, REGRAS[id].msg);                                    // errado: vermelho
  return false;
}

// confere enquanto a pessoa digita
Object.keys(REGRAS).forEach(function (id) {
  var campo = $(id);

  campo.addEventListener('input', function () {
    var digitos = campo.value.replace(/\D/g, '').length;

    // CPF, CEP e telefone completos: já avisa se estiver errado, sem esperar sair do campo
    if ((id === 'cpf' && digitos === 11) ||
        (id === 'cep' && digitos === 8) ||
        (id === 'telefone' && digitos === 11)) {
      campo.dataset.tocado = '1';
    }

    // depois de "tocado" (ou se já está vermelho), confere a cada tecla:
    // fica vermelho se errar e volta ao normal assim que acertar
    if (campo.dataset.tocado === '1' || campo.classList.contains('erro')) {
      checarCampo(id);
    }
  });

  // ao sair do campo, confere o que foi digitado
  campo.addEventListener('blur', function () {
    campo.dataset.tocado = '1';
    checarCampo(id);
  });

  campo.addEventListener('change', function () { checarCampo(id); });   // para o select de Estado
});

// usado pelo botão "Continuar": confere todos, inclusive os vazios
function validar() {
  var ok = true;
  Object.keys(REGRAS).forEach(function (id) {
    if (!checarCampo(id, true)) ok = false;
  });
  return ok;
}


// =====================================================
// 7. BOTÃO "CONTINUAR PARA O PAGAMENTO"
// =====================================================
document.querySelector('.continuar').onclick = function (e) {
  e.preventDefault();

  if (!validar()) {
    var primeiro = document.querySelector('.erro');
    primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
    primeiro.focus();
    return;                                                        // para aqui: não segue
  }

  var opcao = opcaoEscolhida();
  localStorage.setItem('entrega', JSON.stringify({
    nome:   $('name').value.trim(),
    cpf:    $('cpf').value,
    tel:    $('telefone').value,
    cep:    $('cep').value,
    rua:    $('rua').value.trim(),
    numero: $('numero').value.trim(),
    comp:   $('complemento').value.trim(),
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
// 8. SE A PESSOA VOLTAR, OS DADOS JÁ ESTÃO PREENCHIDOS
// =====================================================
var salvo = JSON.parse(localStorage.getItem('entrega') || 'null');
if (salvo) {
  var MAPA = { name: 'nome', cpf: 'cpf', telefone: 'tel', cep: 'cep', rua: 'rua',
               numero: 'numero', complemento: 'comp', bairro: 'bairro', cidade: 'cidade', uf: 'uf' };
  Object.keys(MAPA).forEach(function (id) { $(id).value = salvo[MAPA[id]] || ''; });
  document.querySelector('input[name="frete"][value="' + salvo.opcao + '"]').checked = true;
  atualizarResumo();
}