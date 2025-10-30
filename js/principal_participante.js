// =================================================================
// 1. Lógica do Dropdown de Perfil
// =================================================================

// Função de toggleDropdown para o menu de perfil
function toggleDropdown() {
    const opcoesPerfil = document.getElementById('opcoes-perfil');
    // Adicionando uma verificação robusta
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

    // Função para carregar o nome do usuário logado e as iniciais
    function carregarNomeUsuario() {
        const nomeUsuarioElement = document.getElementById('nome-usuario-perfil');
        const avatarSiglaElement = document.querySelector('.avatar-sigla');
        const nomeSaudacaoElement = document.getElementById('nome-saudacao');
        const nomeLogado = localStorage.getItem('usuarioLogadoNome');

        if (nomeLogado) {
            if (nomeUsuarioElement) {
                nomeUsuarioElement.textContent = nomeLogado;
            }
            // Exibe só o primeiro nome na saudação principal
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

                avatarSiglaElement.textContent = iniciais || 'OG'; 
            }
        }
    }
    
    carregarNomeUsuario();
}


// =================================================================
// 2. Lógica de Listagem de Eventos (NOVA)
// =================================================================

function criarCardEvento(evento) {
    // Formata a data para exibição
    const dataFormatada = new Date(evento.dataInicio).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Constrói a estrutura HTML do card
    const cardHTML = `
        <div class="card-evento" data-evento-id="${evento.id}">
            <img src="${evento.imagem}" alt="Imagem do Evento ${evento.nome}" class="card-evento-imagem">
            <div class="card-evento-conteudo">
                <h3>${evento.nome}</h3>
                <p class="card-evento-info card-evento-data"><i class="fas fa-calendar-alt"></i> ${dataFormatada} às ${evento.horaInicio}</p>
                <p class="card-evento-info"><i class="fas fa-map-marker-alt"></i> ${evento.local || evento.endereco || 'Local Não Informado'}</p>
                <p class="card-evento-info"><i class="fas fa-users"></i> ${evento.capacidade ? 'Capacidade: ' + evento.capacidade : 'Sem limite'}</p>
                <p class="card-evento-organizador">Organizador: ${evento.organizador}</p>
            </div>
        </div>
    `;
    
    return cardHTML;
}

function carregarEventos() {
    const listagemContainer = document.getElementById('listagem-eventos');
    const mensagemVazia = document.getElementById('mensagem-nenhum-evento');
    
    // 1. Tenta carregar os eventos salvos no localStorage
    const eventosSalvos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];

    // Limpa qualquer conteúdo prévio
    if (listagemContainer) {
        listagemContainer.innerHTML = '';
    }
    
    if (eventosSalvos.length === 0) {
        // 2. Se não houver eventos, exibe a mensagem de nenhum evento (se o elemento existir)
        if (mensagemVazia) {
            mensagemVazia.classList.remove('hidden');
        }
        return;
    }
    
    // Esconde a mensagem caso haja eventos
    if (mensagemVazia) {
        mensagemVazia.classList.add('hidden');
    }

    // 3. Itera sobre a lista de eventos e cria um card para cada um
    if (listagemContainer) {
        eventosSalvos.forEach(evento => {
            const cardHTML = criarCardEvento(evento);
            listagemContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
}


// =================================================================
// 3. Inicialização
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    configurarMenuPerfil(); // Inicializa o menu de perfil e nome
    carregarEventos(); // Chama a função para exibir os eventos
});