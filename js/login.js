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
        
        // Limpa sessões temporárias
        sessionStorage.removeItem('checkoutData');
        localStorage.removeItem('resumoCompra'); 

        // Armazena dados do usuário (AJUSTADO PARA PERSONALIZAÇÃO ANTERIOR)
        localStorage.setItem('usuarioLogadoNome', usuarioEncontrado.nome);
        localStorage.setItem('usuarioLogadoTipo', usuarioEncontrado.tipo);
        localStorage.setItem('usuarioLogadoEmail', usuarioEncontrado.email); 
        
        if (usuarioEncontrado.tipo === 'Participante') {
            alert("Login de Participante realizado com sucesso!");
            // CORREÇÃO: Redireciona usando o caminho RELATIVO ao HTML.
            // O index.html está na raiz, então ele acessa a pasta pages/
            window.location.href = "pages/principal_participante.html"; 
            
        } else if (usuarioEncontrado.tipo === 'Organizador') {
            alert("Login de Organizador realizado com sucesso!");
            // CORREÇÃO: Redireciona usando o caminho RELATIVO ao HTML.
            window.location.href = "pages/principal_organizador.html";
            
        } else {
            alert("Login bem-sucedido, mas tipo de conta não reconhecido.");
        }
        
    } else {
        alert("Email ou senha incorretos.");
    }
});