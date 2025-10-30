// Obtém os elementos do HTML usando os IDs
const botaoPerfil = document.getElementById('botao-perfil');
const opcoesPerfil = document.getElementById('opcoes-perfil');
const containerPerfil = document.getElementById('perfil-dropdown-container');

// Função que inverte a visibilidade (hidden <-> visible)
function toggleDropdown() {
    if (opcoesPerfil.classList.contains('hidden')) {
        opcoesPerfil.classList.remove('hidden');
        opcoesPerfil.classList.add('visible');
    } else {
        opcoesPerfil.classList.remove('visible');
        opcoesPerfil.classList.add('hidden');
    }
}

// 1. Adiciona um "ouvinte de evento" para o clique no botão "Meu Perfil"
if (botaoPerfil) {
    botaoPerfil.addEventListener('click', toggleDropdown);
}

// 2. Fecha o dropdown se o usuário clicar em qualquer lugar fora dele
document.addEventListener('click', function(event) {
    if (containerPerfil && opcoesPerfil && !containerPerfil.contains(event.target)) {
        if (opcoesPerfil.classList.contains('visible')) {
            opcoesPerfil.classList.remove('visible');
            opcoesPerfil.classList.add('hidden');
        }
    }
});


// Função para carregar o nome do usuário logado e as iniciais
function carregarNomeUsuario() {
    const nomeUsuarioElement = document.getElementById('nome-usuario-perfil');
    const avatarSiglaElement = document.querySelector('.avatar-sigla');
    const nomeSaudacaoElement = document.getElementById('nome-saudacao'); // Novo elemento de saudação
    const nomeLogado = localStorage.getItem('usuarioLogadoNome');

    if (nomeLogado) {
        if (nomeUsuarioElement) {
            nomeUsuarioElement.textContent = nomeLogado;
        }
        if (nomeSaudacaoElement) {
            nomeSaudacaoElement.textContent = nomeLogado.split(' ')[0] + '!'; // Exibe só o primeiro nome
        }

        if (avatarSiglaElement) {
            const partesNome = nomeLogado.split(' ');
            let iniciais = '';

            if (partesNome.length > 0) {
                iniciais += partesNome[0][0].toUpperCase();
            }
            if (partesNome.length > 1) {
                iniciais += partesNome[partesNome.length - 1][0].toUpperCase();
            }

            if (iniciais.length < 2 && partesNome.length === 1 && partesNome[0].length >= 2) {
                 iniciais = partesNome[0].substring(0, 2).toUpperCase();
            }

            avatarSiglaElement.textContent = iniciais || 'OG'; // 'OG' como fallback para Organizador
        }
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarNomeUsuario);