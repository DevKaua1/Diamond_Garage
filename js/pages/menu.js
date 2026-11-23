var nav    = document.getElementById('menu-mobile');
var toggle = document.getElementById('menu-toggle');

var ICONE_ABRIR  = '../Images/menu-hamburger.svg';
var ICONE_FECHAR = '../Images/menu-fechar.svg';

function abrir(aberto) {
  nav.classList.toggle('aberto', aberto);
  toggle.src = aberto ? ICONE_FECHAR : ICONE_ABRIR;
  toggle.alt = aberto ? 'Fechar menu' : 'Abrir menu';
  toggle.setAttribute('aria-expanded', aberto);
}

toggle.addEventListener('click', function (e) {
  e.stopPropagation();
  abrir(!nav.classList.contains('aberto'));
});

toggle.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') abrir(false);
});

document.addEventListener('click', function (e) {
  if (!nav.contains(e.target)) abrir(false);
});

window.addEventListener('resize', function () {
  if (window.innerWidth > 1023) abrir(false);
});

var arquivo = location.pathname.split('/').pop() || 'home.html';
document.querySelectorAll('.menu-links a').forEach(function (a) {
  if (a.getAttribute('href') === arquivo) a.classList.add('atual');
});