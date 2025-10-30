// =================================================================
// LISTA DE EVENTOS (vazia por enquanto)
// =================================================================
const TODOS_OS_EVENTOS = []; // Nenhum evento pré-cadastrado

// =================================================================
// FAVORITOS - LOCALSTORAGE
// =================================================================
function getFavoritos() {
    const favoritos = localStorage.getItem('eventosFavoritos');
    return favoritos ? JSON.parse(favoritos) : [];
}

function setFavoritos(listaIds) {
    localStorage.setItem('eventosFavoritos', JSON.stringify(listaIds));
}

function removerFavorito(eventoId) {
    let favoritosAtuais = getFavoritos();
    const novaLista = favoritosAtuais.filter(id => id !== eventoId);
    setFavoritos(novaLista);

    const card = document.querySelector(`.evento-card[data-evento-id="${eventoId}"]`);
    if (card) card.remove();
    
    verificarListaVazia(novaLista.length);
}

// =================================================================
// RENDERIZAÇÃO
// =================================================================
function criarCardEvento(evento) {
    const [local1, local2] = evento.local ? evento.local.split(', ') : ['', '']; 
    return `
        <div class="evento-card" data-evento-id="${evento.id}">
            <div class="card-imagem-container">
                <img src="${evento.imagem}" alt="${evento.titulo}">
                <button class="favorito-icon" data-id="${evento.id}">
                   <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="card-content">
                <h3 class="card-title">${evento.titulo}</h3>
                <p class="card-local">${local1}</p>
                <p class="card-local">${local2}</p>
                <p class="card-data">${evento.data}</p>
            </div>
        </div>
    `;
}

function verificarListaVazia(total) {
    const grid = document.getElementById('lista-favoritos');
    const vazio = document.getElementById('vazio');
    
    if (total === 0) {
        grid.style.display = 'none';
        vazio.style.display = 'block';

        // Redirecionar ao clicar em "Explorar Eventos"
        const explorarBtn = vazio.querySelector('.btn-explorar');
        if (explorarBtn) {
            explorarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'principal_participante.html';
            });
        }
    } else {
        grid.style.display = 'grid';
        vazio.style.display = 'none';
    }
}

function carregarFavoritos() {
    const grid = document.getElementById('lista-favoritos');
    grid.innerHTML = ''; 

    const idsFavoritos = getFavoritos();
    const eventosFavoritos = TODOS_OS_EVENTOS.filter(e => idsFavoritos.includes(e.id));

    verificarListaVazia(eventosFavoritos.length);

    if (eventosFavoritos.length > 0) {
        grid.innerHTML = eventosFavoritos.map(criarCardEvento).join('');
    }

    document.querySelectorAll('.favorito-icon').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removerFavorito(id);
        });
    });
}

// =================================================================
// PERFIL - IDÊNTICO AO principal_participante.js
// =================================================================

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

// Adiciona o evento de clique no botão "Meu Perfil"
if (botaoPerfil) {
    botaoPerfil.addEventListener('click', toggleDropdown);
}

// Fecha o dropdown se o usuário clicar fora
document.addEventListener('click', function(event) {
    if (!containerPerfil.contains(event.target)) {
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
    const nomeLogado = localStorage.getItem('usuarioLogadoNome');

    if (nomeLogado && nomeUsuarioElement) {
        nomeUsuarioElement.textContent = nomeLogado;

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

            avatarSiglaElement.textContent = iniciais || 'NU';
        }
    }
}

// =================================================================
// INICIALIZAÇÃO
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarFavoritos();
    carregarNomeUsuario();
});
