/* Pegando o nome armazenado do e-mail do usuario e exibindo na página, para que o usuário saiba para onde está sendo enviado o código. */

const emailConfirmado = document.getElementById('email-confirmado');
const emailSalvo = sessionStorage.getItem('emailCadastro');

if (emailSalvo) {
    emailConfirmado.textContent = emailSalvo;
}