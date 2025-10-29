// Obtém os elementos do HTML usando os IDs
const botaoPerfil = document.getElementById('botao-perfil');
const opcoesPerfil = document.getElementById('opcoes-perfil');
const containerPerfil = document.getElementById('perfil-dropdown-container');

// Função que inverte a visibilidade (hidden <-> visible)
function toggleDropdown() {
    // Verifica se a lista de classes do elemento contém 'hidden'
    if (opcoesPerfil.classList.contains('hidden')) {
        // Se estiver oculta, remove 'hidden' e adiciona 'visible' para mostrar
        opcoesPerfil.classList.remove('hidden');
        opcoesPerfil.classList.add('visible');
    } else {
        // Se estiver visível, remove 'visible' e adiciona 'hidden' para ocultar
        opcoesPerfil.classList.remove('visible');
        opcoesPerfil.classList.add('hidden');
    }
}

// 1. Adiciona um "ouvinte de evento" para o clique no botão "Meu Perfil"
botaoPerfil.addEventListener('click', toggleDropdown);

// 2. Opcional: Fecha o dropdown se o usuário clicar em qualquer lugar fora dele
document.addEventListener('click', function(event) {
    // Verifica se o clique não ocorreu dentro do container do perfil
    if (!containerPerfil.contains(event.target)) {
        // Se estiver visível, fecha
        if (opcoesPerfil.classList.contains('visible')) {
            opcoesPerfil.classList.remove('visible');
            opcoesPerfil.classList.add('hidden');
        }
    }
});


// NOVO CÓDIGO: Função para carregar o nome do usuário logado e as iniciais
function carregarNomeUsuario() {
    // 1. Pega o nome e os elementos HTML
    const nomeUsuarioElement = document.getElementById('nome-usuario-perfil');
    const avatarSiglaElement = document.querySelector('.avatar-sigla');
    const nomeLogado = localStorage.getItem('usuarioLogadoNome');

    if (nomeLogado && nomeUsuarioElement) {
        // 2. Define o nome completo
        nomeUsuarioElement.textContent = nomeLogado;
        
        // 3. Opcional: Atualiza as iniciais (avatar)
        if (avatarSiglaElement) {
            // Tenta pegar a primeira letra do nome e a primeira letra do sobrenome
            const partesNome = nomeLogado.split(' ');
            let iniciais = '';

            if (partesNome.length > 0) {
                iniciais += partesNome[0][0].toUpperCase();
            }
            // Tenta pegar a primeira letra do sobrenome, se houver
            if (partesNome.length > 1) {
                iniciais += partesNome[partesNome.length - 1][0].toUpperCase();
            }

            // Fallback se o nome for composto, mas tiver apenas um nome (ex: "Maria")
            if (iniciais.length < 2 && partesNome.length === 1 && partesNome[0].length >= 2) {
                 iniciais = partesNome[0].substring(0, 2).toUpperCase();
            }

            avatarSiglaElement.textContent = iniciais || 'NU'; // 'NU' como fallback
        }
    }
}

// Chama a função assim que o script é carregado
carregarNomeUsuario();