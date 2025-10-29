document.getElementById('form-cadastro').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // 1. Coleta os dados do formulário
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const tipo = document.getElementById('tipo').value;
    const nome = document.getElementById('nome').value;

    // 2. Estrutura o objeto do usuário
    const novoUsuario = {
        email: email,
        senha: senha,
        tipo: tipo,
        nome: nome
    };

    // 3. Recupera lista de usuários ou inicializa uma nova lista
    // 'usuariosSaqua' é a chave que usaremos no localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuariosSaqua')) || [];

    // 4. Verifica se o email já está cadastrado
    const emailExistente = usuarios.some(user => user.email === email);
    if (emailExistente) {
        alert("Este email já está cadastrado. Tente fazer login.");
        return;
    }

    // 5. Adiciona e salva o novo usuário
    usuarios.push(novoUsuario);
    localStorage.setItem('usuariosSaqua', JSON.stringify(usuarios));

    // 6. Feedback e redirecionamento para o login
    alert("Cadastro realizado com sucesso! Agora faça login.");
    window.location.href = "login.html";
});