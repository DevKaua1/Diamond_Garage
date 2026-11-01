var ALTURA = {
  pix:    '650px',
  card:   '770px',
  boleto: '490px'
};

var MOSTRAR = 'block';   // se as suas seções usam flex ou grid no CSS, troque aqui
var caixa = document.querySelector('.pagamentos');

var paineis = {
  pix:    document.querySelector('.pagamentos section.pix'),
  card:   document.querySelector('.pagamentos section.card'),
  boleto: document.querySelector('.pagamentos section.boleto')
};

function mostrar(nome) {
  // mostra só o painel escolhido e esconde os outros
  for (var k in paineis) {
    paineis[k].style.display = (k === nome) ? MOSTRAR : 'none';
  }

  // marca a aba selecionada
  document.querySelectorAll('.pagamentos .tab').forEach(function (aba) {
    aba.classList.toggle('on', aba.dataset.t === nome);
  });

  // muda a altura da caixa
  caixa.style.height = ALTURA[nome];
}

document.querySelectorAll('.pagamentos .tab').forEach(function (aba) {
  aba.onclick = function () { mostrar(aba.dataset.t); };
});

mostrar('pix');   // ao abrir a página, começa no Pix


// =====================================================
// 2. DADOS DO CARTÃO APARECEM NA IMAGEM
// =====================================================
document.getElementById('n').oninput = function () {
  var d = this.value.replace(/\D/g, '').slice(0, 16);        // só números, até 16
  this.value = d.replace(/(.{4})/g, '$1 ').trim();           // espaço a cada 4
  document.getElementById('pn').textContent =
    d.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();      // completa com •
};

document.getElementById('m').oninput = function () {
  document.getElementById('pm').textContent =
    this.value.toUpperCase() || 'NOME NO CARTÃO';
};

document.getElementById('v').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 4);
  if (s.length > 2) s = s.slice(0, 2) + '/' + s.slice(2);    // 1228 -> 12/28
  this.value = s;
  document.getElementById('pv').textContent = s || 'MM/AA';
};

document.getElementById('c').oninput = function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 3);    // CVV só números
};


// =====================================================
// 3. PARCELAMENTO (1x a 10x)
// =====================================================
var TOTAL = 1883.37;     // total do pedido

function moeda(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',')
                  .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

var select = document.getElementById('p');
for (var i = 1; i <= 10; i++) {
  var op = document.createElement('option');
  op.value = i;
  op.textContent = i + 'x de ' + moeda(TOTAL / i) + ' sem juros';
  select.appendChild(op);
}


// =====================================================
// 4. BOTÃO COPIAR DO PIX
// =====================================================
document.getElementById('cp').onclick = function () {
  var botao = this;
  navigator.clipboard.writeText(document.getElementById('pc').value);
  botao.textContent = 'Copiado ✓';
  setTimeout(function () { botao.textContent = 'Copiar'; }, 1500);
};


// =====================================================
// 5. MÁSCARA DO CPF (000.000.000-00)
// =====================================================
document.getElementById('cpf').oninput = function () {
  var s = this.value.replace(/\D/g, '').slice(0, 11);
  this.value = s.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};