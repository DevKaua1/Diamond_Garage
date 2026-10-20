/* Criando as váriaveis que se refere ao input em si e ao botão "Mostrar". */
const campoSenha = document.getElementById('senha')
const botaoMostrar = document.getElementById('mostrar-senha')

/* Criando um evento/ação onde ao clicar ('click') no botão 'Mostrar' haverá uma ação, que é a function. */
botaoMostrar.addEventListener('click', function() {

    if (campoSenha.type === 'password') {
        campoSenha.type = 'text';
        botaoMostrar.textContent = 'Ocultar';
    } else {
        campoSenha.type = 'passsword';
        botaoMostrar.textContent = 'Mostrar';
    }
})