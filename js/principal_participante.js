// =================================================================
// 1. Lógica do Dropdown de Perfil
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

    if (botaoPerfil) {
        botaoPerfil.addEventListener('click', toggleDropdown);
    }

    document.addEventListener('click', function(event) {
        const opcoesPerfil = document.getElementById('opcoes-perfil');
        if (containerPerfil && opcoesPerfil && !containerPerfil.contains(event.target)) {
            if (opcoesPerfil.classList.contains('visible')) {
                opcoesPerfil.classList.remove('visible');
                opcoesPerfil.classList.add('hidden');
            }
        }
    });

    function carregarNomeUsuario() {
        const nomeUsuarioElement = document.getElementById('nome-usuario-perfil');
        const avatarSiglaElement = document.querySelector('.avatar-sigla');
        const nomeSaudacaoElement = document.getElementById('nome-saudacao');
        const nomeLogado = localStorage.getItem('usuarioLogadoNome');

        if (nomeLogado) {
            if (nomeUsuarioElement) {
                nomeUsuarioElement.textContent = nomeLogado;
            }
            if (nomeSaudacaoElement) {
                nomeSaudacaoElement.textContent = nomeLogado.split(' ')[0];
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

                avatarSiglaElement.textContent = iniciais || 'NU'; 
            }
        }
    }
    
    carregarNomeUsuario();
}


// =================================================================
// 2. Lógica de Favoritos (AJUSTADO PARA PERSONALIZAÇÃO)
// =================================================================

function getFavoritosKey() {
    const email = localStorage.getItem('usuarioLogadoEmail');
    return email ? `eventosFavoritos_${email}` : 'eventosFavoritos_default'; // Chave personalizada
}

function getFavoritos() {
    const favoritos = localStorage.getItem(getFavoritosKey());
    return favoritos ? JSON.parse(favoritos) : [];
}

function toggleFavorito(eventoId, iconElement) {
    const idNum = parseInt(eventoId);
    let favoritosAtuais = getFavoritos();
    const chave = getFavoritosKey(); // Obtém a chave personalizada
    
    if (favoritosAtuais.includes(idNum)) {
        favoritosAtuais = favoritosAtuais.filter(id => id !== idNum);
        iconElement.classList.remove('fas');
        iconElement.classList.add('far');
        alert('Evento removido dos favoritos!');
    } else {
        favoritosAtuais.push(idNum);
        iconElement.classList.remove('far');
        iconElement.classList.add('fas');
        alert('Evento adicionado aos favoritos!');
    }
    
    localStorage.setItem(chave, JSON.stringify(favoritosAtuais));
}

// =================================================================
// 3. Lógica de Listagem e Pesquisa de Eventos
// =================================================================

function getEventosSalvos() {
    return JSON.parse(localStorage.getItem('eventosSaqua')) || [];
}

function criarCardEvento(evento) {
    const idsFavoritos = getFavoritos();
    const isFavorito = idsFavoritos.includes(evento.id);
    const iconClass = isFavorito ? 'fas' : 'far'; 

    const dataFormatada = new Date(evento.dataInicio).toLocaleDateString('pt-BR');

    // CORRIGIDO: O card inteiro é um link para a página de detalhes
    return `
        <a href="detalhe_evento.html?id=${evento.id}" class="card-evento">
            <div class="card-imagem-container">
                <img src="${evento.imagem}" alt="Imagem do Evento ${evento.nome}" class="card-evento-imagem">
                
                <button class="btn-favoritar" data-id="${evento.id}">
                    <i class="${iconClass} fa-heart" style="color: #e74c3c;"></i>
                </button>
            </div>
            
            <div class="card-evento-conteudo">
                <h3>${evento.nome}</h3>
                <p class="card-evento-info card-evento-data"><i class="fas fa-calendar-alt"></i> ${dataFormatada} às ${evento.horaInicio}</p>
                <p class="card-evento-info"><i class="fas fa-map-marker-alt"></i> ${evento.local || evento.endereco || 'Local Não Informado'}</p>
                <p class="card-evento-info"><i class="fas fa-users"></i> ${evento.capacidade ? 'Capacidade: ' + evento.capacidade : 'Sem limite'}</p>
                <p class="card-evento-organizador">Organizador: ${evento.organizador}</p>
            </div>
        </a>
    `;
}

function carregarEventos(termoPesquisa = '') {
    const listagemContainer = document.getElementById('listagem-eventos');
    const mensagemVazia = document.getElementById('mensagem-nenhum-evento');
    
    let eventosAExibir = getEventosSalvos();

    if (termoPesquisa) {
        const termo = termoPesquisa.toLowerCase();
        eventosAExibir = eventosAExibir.filter(evento => 
            evento.nome.toLowerCase().includes(termo)
        );
    }

    if (listagemContainer) {
        listagemContainer.innerHTML = '';
    }
    
    if (eventosAExibir.length === 0) {
        if (mensagemVazia) {
            mensagemVazia.textContent = termoPesquisa ? 
                `Nenhum evento encontrado para "${termoPesquisa}".` : 
                'Nenhum evento encontrado. Cadastre um!';
            mensagemVazia.classList.remove('hidden');
        }
        return;
    }
    
    if (mensagemVazia) {
        mensagemVazia.classList.add('hidden');
    }

    if (listagemContainer) {
        eventosAExibir.forEach(evento => {
            const cardHTML = criarCardEvento(evento);
            listagemContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        // Adiciona listeners aos botões de favoritar
        document.querySelectorAll('.btn-favoritar').forEach(button => {
            button.addEventListener('click', function(e) {
                const eventoId = this.dataset.id;
                const icon = this.querySelector('i');
                toggleFavorito(eventoId, icon);
                e.preventDefault(); // Previne que o clique no botão ative o link do card
                e.stopPropagation(); // Impede que o clique no botão ative o clique do card inteiro
            });
        });
    }
}


// =================================================================
// 4. Inicialização
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    configurarMenuPerfil(); 
    
    const inputPesquisa = document.getElementById('input-pesquisa');

    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', function() {
            carregarEventos(this.value); 
        });
    }
    
    carregarEventos(); 
});