// =================================================================
// 1. Lógica do Dropdown de Perfil
// =================================================================

// Obtém os elementos fora do DOMContentLoaded, mas atribui o listener dentro
const botaoPerfil = document.getElementById('botao-perfil');
const opcoesPerfil = document.getElementById('opcoes-perfil');
const containerPerfil = document.getElementById('perfil-dropdown-container');

function toggleDropdown() {
    if (opcoesPerfil.classList.contains('hidden')) {
        opcoesPerfil.classList.remove('hidden');
        opcoesPerfil.classList.add('visible');
    } else {
        opcoesPerfil.classList.remove('visible');
        opcoesPerfil.classList.add('hidden');
    }
}

// Função para carregar nome e iniciais (igual ao que já tínhamos)
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
// 2. Lógica de Cadastro do Evento
// =================================================================
function inicializarCadastroEvento() {
    document.getElementById('form-cadastro-evento').addEventListener('submit', function(event) {
        event.preventDefault(); 

        // 1. Coleta os dados do novo formulário
        const nome = document.getElementById('nome-evento').value;
        const descricao = document.getElementById('descricao').value;
        const categoria = document.getElementById('categoria').value;
        const dataInicio = document.getElementById('data-inicio').value;
        const horaInicio = document.getElementById('hora-inicio').value;
        const dataTermino = document.getElementById('data-termino').value;
        const horaTermino = document.getElementById('hora-termino').value;
        const local = document.getElementById('local').value;
        const capacidade = document.getElementById('capacidade').value;
        const endereco = document.getElementById('endereco').value;
        const imagemUrl = document.getElementById('imagem-url').value;

        // 2. Estrutura o objeto do evento
        const novoEvento = {
            id: Date.now(), // ID único baseado no timestamp
            nome,
            descricao,
            categoria,
            dataInicio,
            horaInicio,
            dataTermino,
            horaTermino,
            local,
            capacidade: parseInt(capacidade) || null,
            endereco,
            imagem: imagemUrl || '../imagens/eventos/default.jpg', 
            organizador: localStorage.getItem('usuarioLogadoNome') || 'Organizador Desconhecido'
        };

        // 3. Recupera lista de eventos ou inicializa uma nova lista
        let eventos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];

        // 4. Adiciona e salva o novo evento
        eventos.push(novoEvento);
        localStorage.setItem('eventosSaqua', JSON.stringify(eventos));

        // 5. Feedback e redirecionamento para o painel
        alert(`Evento "${nome}" cadastrado com sucesso!`);
        window.location.href = "principal_organizador.html";
    });
}


// =================================================================
// 3. Inicialização
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Perfil
    carregarNomeUsuario();

    // Adiciona o listener de clique no botão "Meu Perfil"
    if (botaoPerfil) {
        botaoPerfil.addEventListener('click', toggleDropdown);
    }

    // Fecha o dropdown se o usuário clicar em qualquer lugar fora dele
    document.addEventListener('click', function(event) {
        if (containerPerfil && opcoesPerfil && !containerPerfil.contains(event.target)) {
            if (opcoesPerfil.classList.contains('visible')) {
                opcoesPerfil.classList.remove('visible');
                opcoesPerfil.classList.add('hidden');
            }
        }
    });

    // 2. Inicializa o Formulário
    inicializarCadastroEvento();
});