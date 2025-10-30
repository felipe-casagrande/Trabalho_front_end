// =================================================================
// 1. Lógica do Dropdown de Perfil (Mantida)
// =================================================================

function toggleDropdown() {
    const opcoesPerfil = document.getElementById('opcoes-perfil');
    if (!opcoesPerfil) return; 
    
    if (opcoesPerfil.classList.contains('hidden')) {
        opcoesPerfil.classList.remove('hidden');
        opcoesPerfil.classList.add('visible');
    } else {
        opcoesPerfil.classList.remove('visible');
        opcoesPerfil.classList.add('hidden');
    }
}

function configurarMenuPerfil() {
    const botaoPerfil = document.getElementById('botao-perfil');
    const containerPerfil = document.getElementById('perfil-dropdown-container');

    // Configura o clique no botão para chamar a função de toggle
    if (botaoPerfil) {
        botaoPerfil.addEventListener('click', toggleDropdown);
    }

    // Fecha o dropdown se o usuário clicar em qualquer lugar fora dele
    document.addEventListener('click', function(event) {
        const opcoesPerfil = document.getElementById('opcoes-perfil');
        if (containerPerfil && opcoesPerfil && !containerPerfil.contains(event.target)) {
            if (opcoesPerfil.classList.contains('visible')) {
                opcoesPerfil.classList.remove('visible');
                opcoesPerfil.classList.add('hidden');
            }
        }
    });

    carregarNomeUsuario();
}

function carregarNomeUsuario() {
    const nomeUsuarioElement = document.getElementById('nome-usuario-perfil');
    const avatarSiglaElement = document.querySelector('.avatar-sigla');
    const nomeLogado = localStorage.getItem('usuarioLogadoNome');

    if (nomeLogado) {
        if (nomeUsuarioElement) {
            nomeUsuarioElement.textContent = nomeLogado;
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

            // 'NU' como fallback para 'Nome Usuário'
            avatarSiglaElement.textContent = iniciais || 'NU'; 
        }
    }
}

// =================================================================
// 2. Lógica de Favoritos e Eventos
// =================================================================

function getEventosSalvos() {
    return JSON.parse(localStorage.getItem('eventosSaqua')) || [];
}

function getFavoritos() {
    const favoritos = localStorage.getItem('eventosFavoritos');
    return favoritos ? JSON.parse(favoritos) : [];
}

function setFavoritos(listaIds) {
    localStorage.setItem('eventosFavoritos', JSON.stringify(listaIds));
}

function removerFavorito(eventoId) {
    const idNum = parseInt(eventoId); // Garante que é um número para a comparação
    let favoritosAtuais = getFavoritos();
    const novaLista = favoritosAtuais.filter(id => id !== idNum);
    setFavoritos(novaLista);
    
    alert('Evento removido dos favoritos!');

    // Remove o card da tela
    const card = document.querySelector(`.evento-card-link[data-evento-id="${eventoId}"]`);
    if (card) card.remove();
    
    // Verifica se a lista ficou vazia
    verificarListaVazia(novaLista.length);
}

// =================================================================
// 3. Renderização (CORRIGIDO PARA SER CLICÁVEL)
// =================================================================
function criarCardEvento(evento) {
    // Formata a data para exibição
    const dataFormatada = new Date(evento.dataInicio).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    // Usa o nome do local ou endereço, se o local não estiver preenchido
    const localOuEndereco = evento.local || evento.endereco || 'Local Não Informado';

    return `
        <a href="detalhe_evento.html?id=${evento.id}" class="evento-card-link" data-evento-id="${evento.id}">
            <div class="evento-card">
                <div class="card-imagem-container">
                    <img src="${evento.imagem}" alt="Imagem do Evento ${evento.nome}">
                    
                    <button class="favorito-icon" data-id="${evento.id}" onclick="event.preventDefault(); event.stopPropagation(); removerFavorito('${evento.id}');">
                       <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${evento.nome}</h3>
                    <p class="card-local">${localOuEndereco}</p>
                    <p class="card-data">${dataFormatada} às ${evento.horaInicio}</p>
                </div>
            </div>
        </a>
    `;
}

function verificarListaVazia(total) {
    const grid = document.getElementById('lista-favoritos');
    const vazio = document.getElementById('vazio');
    
    if (total === 0) {
        if (grid) grid.style.display = 'none';
        if (vazio) vazio.style.display = 'block';
    } else {
        if (grid) grid.style.display = 'grid';
        if (vazio) vazio.style.display = 'none';
    }
}

function carregarFavoritos() {
    const grid = document.getElementById('lista-favoritos');
    if (!grid) return;
    grid.innerHTML = ''; 

    const todosEventos = getEventosSalvos(); // Obtém todos os eventos cadastrados
    const idsFavoritos = getFavoritos();
    
    // Filtra apenas os eventos cujos IDs estão na lista de favoritos
    const eventosFavoritos = todosEventos.filter(e => idsFavoritos.includes(e.id));

    verificarListaVazia(eventosFavoritos.length);

    if (eventosFavoritos.length > 0) {
        eventosFavoritos.forEach(evento => {
            grid.insertAdjacentHTML('beforeend', criarCardEvento(evento));
        });
    }
    // NOTA: O listener de remoção foi movido para o HTML (onclick) para evitar conflito com o link <a>.
}

// =================================================================
// 4. Inicialização
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o menu de perfil (AGORA COMPLETO)
    configurarMenuPerfil();
    
    // 2. Carrega a lista de favoritos
    carregarFavoritos();
    
    // 3. Listener para o botão 'Explorar Eventos' se a lista estiver vazia
    const explorarBtn = document.getElementById('vazio')?.querySelector('.btn-explorar');
    if (explorarBtn) {
        explorarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'principal_participante.html';
        });
    }
});