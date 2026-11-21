function atualizarContador() {
  var carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');


  var total = carrinho.reduce(function (soma, item) {
    return soma + (item.quantidade || item.qtd || 1);
  }, 0);

  document.querySelectorAll('#contador-carrinho, .contador-carrinho').forEach(function (el) {
    el.textContent = total;
    el.style.display = total ? '' : 'none';  
  });
}

atualizarContador();                             
window.addEventListener('storage', atualizarContador);   