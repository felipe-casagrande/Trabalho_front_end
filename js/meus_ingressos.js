// =================================================================
// Lógica Comum de Perfil (Copiar do principal_participante.js)
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
            if (partesNome.length > 0) iniciais += partesNome[0][0].toUpperCase();
            if (partesNome.length > 1) iniciais += partesNome[partesNome.length - 1][0].toUpperCase();
            if (iniciais.length < 2 && partesNome[0].length >= 2)
                iniciais = partesNome[0].substring(0, 2).toUpperCase();
            avatarSiglaElement.textContent = iniciais || 'NU';
        }
    }
}

// NOVO: Função para obter a chave personalizada de ingressos
function getIngressosKey() {
    const email = localStorage.getItem('usuarioLogadoEmail');
    return email ? `meusIngressos_${email}` : 'meusIngressos_default'; // Chave personalizada
}

// =================================================================
// Lógica de Carregamento da Tabela de Ingressos (AJUSTADO PARA PERSONALIZAÇÃO)
// =================================================================

function carregarTabelaIngressos() {
    const tabelaCorpo = document.getElementById('corpo-tabela-ingressos');
    const mensagemVazia = document.getElementById('mensagem-vazia');
    
    // Lista de ingressos comprados (salva no checkout_pagamento.js)
    const ingressosKey = getIngressosKey(); // Obtém a chave personalizada
    const ingressosComprados = JSON.parse(localStorage.getItem(ingressosKey)) || [];
    
    if (ingressosComprados.length === 0) {
        // É necessário garantir que a tabela tenha um tbody com ID para funcionar, se não tiver:
        if (tabelaCorpo) tabelaCorpo.innerHTML = '';
        
        if (mensagemVazia) mensagemVazia.classList.remove('hidden');
        return;
    }
    
    if (mensagemVazia) mensagemVazia.classList.add('hidden');
    
    // Renderiza cada ingresso como uma linha da tabela
    if (tabelaCorpo) {
        tabelaCorpo.innerHTML = ingressosComprados.map(ingresso => {
            // Assume que a data está em formato YYYY-MM-DD
            const dataFormatada = ingresso.data ? new Date(ingresso.data + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data Indefinida';
            
            return `
                <tr>
                    <td>${ingresso.nomePortador || 'Comprador'}</td>
                    <td>${ingresso.nomeEvento}</td>
                    <td>${dataFormatada}</td>
                    <td>${ingresso.local || 'Local não informado'}</td>
                    <td>${ingresso.setor}</td>
                    <td>${ingresso.horario}</td>
                </tr>
            `;
        }).join('');
    }
}


// =================================================================
// Inicialização
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    configurarMenuPerfil();
    carregarNomeUsuario();
    carregarTabelaIngressos();
});