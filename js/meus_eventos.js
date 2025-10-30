// =================================================================
// 1. Lógica do Dropdown de Perfil
// =================================================================

const botaoPerfil = document.getElementById('botao-perfil');
const opcoesPerfil = document.getElementById('opcoes-perfil');
const containerPerfil = document.getElementById('perfil-dropdown-container');

function toggleDropdown() {
    if (!opcoesPerfil) return; 

    if (opcoesPerfil.classList.contains('hidden')) {
        opcoesPerfil.classList.remove('hidden');
        opcoesPerfil.classList.add('visible');
    } else {
        opcoesPerfil.classList.remove('visible');
        opcoesPerfil.classList.add('hidden');
    }
}

// Configura o clique no botão para chamar a função de toggle
if (botaoPerfil) {
    botaoPerfil.addEventListener('click', toggleDropdown);
}

// Fecha o dropdown se o usuário clicar em qualquer lugar fora dele
document.addEventListener('click', function(event) {
    if (containerPerfil && opcoesPerfil) {
        if (!containerPerfil.contains(event.target)) {
            if (opcoesPerfil.classList.contains('visible')) {
                opcoesPerfil.classList.remove('visible');
                opcoesPerfil.classList.add('hidden');
            }
        }
    }
});


// Função para carregar o nome do usuário logado e as iniciais
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

            avatarSiglaElement.textContent = iniciais || 'OG'; 
        }
    }
}


// =================================================================
// 2. Lógica de Carregamento e Exibição dos Eventos (FILTRAGEM POR ORGANIZADOR) (AJUSTADO PARA EMAIL)
// =================================================================

function carregarEventos() {
    // CRÍTICO: TRAVA DE SEGURANÇA PARA GARANTIR QUE APENAS ORGANIZADORES VEJAM ESTA TELA
    const tipoUsuario = localStorage.getItem('usuarioLogadoTipo');
    if (tipoUsuario !== 'Organizador') {
        // Redireciona para a home do participante se o tipo for errado
        window.location.href = "principal_participante.html";
        return;
    }
    
    const container = document.getElementById('lista-eventos-container');
    const eventosSalvos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];
    
    // NOVO: Filtra pelo e-mail do organizador logado
    const organizadorEmailLogado = localStorage.getItem('usuarioLogadoEmail');
    const meusEventos = eventosSalvos.filter(evento => evento.organizadorEmail === organizadorEmailLogado);

    if (meusEventos.length === 0) {
        container.innerHTML = `
            <div class="mensagem-vazio">
                <p>Você ainda não cadastrou nenhum evento.</p>
                <a href="cadastrar_evento.html">Clique aqui para criar um evento!</a>
            </div>
        `;
        return;
    }

    container.innerHTML = ''; 
    meusEventos.forEach(evento => {
        const eventoCard = document.createElement('div');
        eventoCard.classList.add('card-evento');
        
        const dataFormatada = new Date(evento.dataInicio).toLocaleDateString('pt-BR');
        
        eventoCard.innerHTML = `
            <img src="${evento.imagem}" alt="Banner do Evento" class="card-img">
            <div class="card-content">
                <h3 class="card-titulo">${evento.nome}</h3>
                <p class="card-detalhe">
                    <i class="fas fa-calendar-alt"></i> ${dataFormatada} às ${evento.horaInicio}
                </p>
                <p class="card-detalhe">
                    <i class="fas fa-map-marker-alt"></i> ${evento.local || evento.endereco || 'Local Não Informado'}
                </p>
                <p class="card-categoria">${evento.categoria}</p>

                <div class="card-acoes">
                    <a href="gerenciar_evento.html?id=${evento.id}" class="btn-editar"><i class="fas fa-edit"></i> Editar</a>
                </div>
            </div>
        `;
        container.appendChild(eventoCard);
    });
}


// =================================================================
// 3. Inicialização
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarNomeUsuario();
    carregarEventos(); 
});