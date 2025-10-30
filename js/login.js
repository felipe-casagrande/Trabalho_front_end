document.getElementById('form-login').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // 1. Coleta os dados do formulário de login
    const emailLogin = document.getElementById('email-login').value;
    const senhaLogin = document.getElementById('senha-login').value;

    // 2. Recupera a lista de usuários
    const usuariosString = localStorage.getItem('usuariosSaqua');
    const usuarios = JSON.parse(usuariosString) || [];

    // 3. Encontra o usuário correspondente (email e senha)
    const usuarioEncontrado = usuarios.find(user => 
        user.email === emailLogin && user.senha === senhaLogin
    );

    // 4. Lógica de Verificação e Redirecionamento
    if (usuarioEncontrado) {
        
        // Armazena o NOME do usuário logado
        localStorage.setItem('usuarioLogadoNome', usuarioEncontrado.nome);
        
        // Armazena o tipo de usuário logado
        localStorage.setItem('usuarioLogadoTipo', usuarioEncontrado.tipo);
        
        if (usuarioEncontrado.tipo === 'Participante') {
            // REDIRECIONAMENTO para a tela de participante
            alert("Login de Participante realizado com sucesso!");
            window.location.href = "principal_participante.html";
            
        } else if (usuarioEncontrado.tipo === 'Organizador') {
            // REDIRECIONAMENTO para a tela do Organizador (Alteração aplicada aqui)
            alert("Login de Organizador realizado com sucesso!");
            window.location.href = "principal_organizador.html";
            
        } else {
            // Tipo não reconhecido
            alert("Login bem-sucedido, mas tipo de conta não reconhecido.");
        }
        
    } else {
        // Login falhou (usuário não encontrado ou senha incorreta)
        alert("Email ou senha incorretos.");
    }
});