// =================================================================
// Variáveis Globais e Funções Comuns
// =================================================================
let eventoIdParaGerenciamento = null;
let eventoOriginal = null;
let contadorLotes = 0; 

// Lógica para adicionar novos campos de ingresso
function adicionarCampoIngresso(ingresso = null) {
    contadorLotes++;
    const lista = document.getElementById('lista-tipos-ingressos');
    const nomeLote = ingresso ? ingresso.nome : '';
    const preco = ingresso ? ingresso.preco.toFixed(2) : '';
    const quantidade = ingresso ? ingresso.quantidadeTotal : '';
    const quantidadeVendida = ingresso ? ingresso.quantidadeVendida : 0;
    
    // Se for um ingresso existente, o campo de quantidade mínima será a quantidade vendida
    const minQuantidade = quantidadeVendida > 0 ? quantidadeVendida : 1;
    const campoVendido = quantidadeVendida > 0 
        ? `<p class="vendidos">Vendidos: ${quantidadeVendida}</p>`
        : '';
    
    const novoCampoHTML = `
        <div class="tipo-ingresso" data-id="${contadorLotes}" data-vendidos="${quantidadeVendida}">
            <div class="linha-campos">
                <div class="campo-metade">
                    <label for="lote-${contadorLotes}">Nome do Ingresso/Lote*</label>
                    <input type="text" id="lote-${contadorLotes}" placeholder="Ex: Lote VIP" value="${nomeLote}" required>
                </div>
                <div class="campo-quarto">
                    <label for="preco-${contadorLotes}">Preço (R$)*</label>
                    <input type="number" id="preco-${contadorLotes}" min="0.01" step="0.01" value="${preco}" required>
                </div>
                <div class="campo-quarto">
                    <label for="quantidade-${contadorLotes}">Qtd. Disponível*</label>
                    <input type="number" id="quantidade-${contadorLotes}" min="${minQuantidade}" value="${quantidade}" required>
                </div>
            </div>
            ${campoVendido}
            
            ${quantidadeVendida === 0 ? `
                <button type="button" class="btn-remover-lote" onclick="this.closest('.tipo-ingresso').remove()">
                    Remover Lote
                </button>
            ` : `<p class="aviso-remocao">Lote não pode ser removido (já tem vendas).</p>`}
        </div>
    `;
    
    lista.insertAdjacentHTML('beforeend', novoCampoHTML);
}

// =================================================================
// 4. Lógica de Carregamento de Dados e Perfil (AJUSTADO PARA EMAIL)
// =================================================================
function carregarEventoParaGerenciamento() {
    // Pega o ID do evento da URL
    const params = new URLSearchParams(window.location.search);
    eventoIdParaGerenciamento = parseInt(params.get('id'));

    if (!eventoIdParaGerenciamento) {
        alert("ID do evento não encontrado na URL. Voltando para Meus Eventos.");
        window.location.href = "meus_eventos.html";
        return;
    }

    // Busca os eventos no localStorage
    const eventos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];
    eventoOriginal = eventos.find(e => e.id === eventoIdParaGerenciamento);
    
    // NOVO: Verificação de Propriedade
    const organizadorEmailLogado = localStorage.getItem('usuarioLogadoEmail');
    if (eventoOriginal.organizadorEmail !== organizadorEmailLogado) {
        alert("Acesso negado. Este evento não pertence à sua conta de organizador.");
        window.location.href = "meus_eventos.html";
        return;
    }


    if (!eventoOriginal) {
        alert("Evento não encontrado. Voltando para Meus Eventos.");
        window.location.href = "meus_eventos.html";
        return;
    }

    // Preenche campos de informação rápida e status
    document.getElementById('titulo-evento').textContent = `Gerenciando: ${eventoOriginal.nome}`;
    document.getElementById('resumo-data-inicio').textContent = `Data Início: ${eventoOriginal.dataInicio}`;
    document.getElementById('resumo-local').textContent = `Local: ${eventoOriginal.local || eventoOriginal.endereco || 'Não Informado'}`;

    document.getElementById('status-atual').textContent = eventoOriginal.status || 'Agendado';
    document.getElementById('status-atual').className = 'tag-status ' + (eventoOriginal.status ? eventoOriginal.status.toLowerCase() : 'agendado');
    document.getElementById('select-status').value = eventoOriginal.status || 'Agendado';

    document.getElementById('input-data-inicio').value = eventoOriginal.dataInicio;
    document.getElementById('input-data-termino').value = eventoOriginal.dataTermino;
    document.getElementById('input-local').value = eventoOriginal.local;
    document.getElementById('input-endereco').value = eventoOriginal.endereco;
    document.getElementById('input-capacidade').value = eventoOriginal.capacidade;
    
    // Ingressos
    const totalVendidos = eventoOriginal.ingressos.reduce((acc, curr) => acc + curr.quantidadeVendida, 0);
    document.getElementById('ingressos-vendidos').textContent = totalVendidos;
    
    document.getElementById('lista-tipos-ingressos').innerHTML = ''; // Limpa o bloco inicial
    
    // Preenche os campos de ingressos existentes
    if (eventoOriginal.ingressos && eventoOriginal.ingressos.length > 0) {
        eventoOriginal.ingressos.forEach(ingresso => {
            adicionarCampoIngresso(ingresso);
        });
    }
}

// Lógica do Perfil (Copiar do cadastro_evento.js)
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

function carregarNomeUsuario() {
    const nomeUsuarioElement = document.getElementById('nome-usuario-perfil');
    const nomeLogado = localStorage.getItem('usuarioLogadoNome');
    if (nomeLogado) {
        if (nomeUsuarioElement) {
            nomeUsuarioElement.textContent = nomeLogado;
        }
        // ... lógica de avatar
    }
}


// =================================================================
// 5. Lógica de Salvar Alterações
// =================================================================
function salvarGerenciamento() {
    event.preventDefault(); 
    if (!eventoOriginal) return;

    // 1. Coleta os dados editáveis
    const status = document.getElementById('select-status').value;
    const dataInicio = document.getElementById('input-data-inicio').value;
    const dataTermino = document.getElementById('input-data-termino').value;
    const local = document.getElementById('input-local').value;
    const endereco = document.getElementById('input-endereco').value;
    const capacidade = document.getElementById('input-capacidade').value;

    // 2. Coleta os dados dos ingressos (A lógica mais complexa)
    const tiposIngressos = [];
    const lotesNaTela = document.querySelectorAll('.tipo-ingresso');
    let ingressosValidos = true;

    if (lotesNaTela.length === 0) {
         alert("É obrigatório definir pelo menos um tipo de ingresso.");
         return;
    }

    lotesNaTela.forEach(lote => {
        const id = lote.dataset.id;
        const quantidadeVendidaOriginal = parseInt(lote.dataset.vendidos) || 0;
        
        const nomeLote = lote.querySelector('[id^="lote-"]').value;
        const precoInput = lote.querySelector('[id^="preco-"]');
        const quantidadeInput = lote.querySelector('[id^="quantidade-"]');
        
        const preco = parseFloat(precoInput.value);
        const quantidade = parseInt(quantidadeInput.value);

        if (!nomeLote || isNaN(preco) || isNaN(quantidade) || preco <= 0 || quantidade < 1) {
            ingressosValidos = false;
        }
        
        if (quantidade < quantidadeVendidaOriginal) {
             alert(`A quantidade total do lote "${nomeLote}" (${quantidade}) não pode ser menor que a quantidade já vendida (${quantidadeVendidaOriginal}).`);
             ingressosValidos = false;
        }

        // Mapeia o lote
        tiposIngressos.push({
            nome: nomeLote,
            preco: preco,
            quantidadeTotal: quantidade,
            quantidadeVendida: quantidadeVendidaOriginal 
        });
    });

    if (!ingressosValidos) {
        alert("Por favor, preencha todos os campos de ingresso com valores válidos.");
        return;
    }

    // 3. Atualiza o objeto do evento
    const eventoAtualizado = {
        ...eventoOriginal, 
        status, // Campos de Gerenciamento Rápido
        dataInicio,
        dataTermino,
        local,
        endereco,
        capacidade: parseInt(capacidade) || null,
        ingressos: tiposIngressos // ATUALIZA a lista de ingressos
    };

    // 4. Salva a lista de eventos no localStorage
    let eventos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];
    const index = eventos.findIndex(e => e.id === eventoIdParaGerenciamento);
    
    if (index !== -1) {
        eventos[index] = eventoAtualizado;
        localStorage.setItem('eventosSaqua', JSON.stringify(eventos));

        alert(`Evento "${eventoAtualizado.nome}" atualizado com sucesso!`);
        
        // 5. Redirecionamento
        window.location.href = "meus_eventos.html";
    } else {
         alert("Erro: O evento a ser gerenciado não foi encontrado na lista.");
    }
}


// =================================================================
// 6. Inicialização Principal
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarNomeUsuario();
    if (botaoPerfil) {
        botaoPerfil.addEventListener('click', toggleDropdown);
    }
    document.addEventListener('click', function(event) {
        if (containerPerfil && opcoesPerfil) {
            if (!containerPerfil.contains(event.target)) {
                if (opcoesPerfil.classList.contains('visible')) {
                    opcoesPerfil.classList.remove('visible');
                }
            }
        }
    });

    carregarEventoParaGerenciamento();
    
    // Listener para o botão de adicionar lote
    const btnAdicionar = document.getElementById('btn-adicionar-ingresso');
    if(btnAdicionar) {
        btnAdicionar.addEventListener('click', () => adicionarCampoIngresso());
    }

    // Listener para o botão de Salvar
    const formGerenciamento = document.getElementById('form-gerenciamento-rapido');
    if (formGerenciamento) {
        formGerenciamento.addEventListener('submit', salvarGerenciamento);
    }
    
    // NOVO: Listener para atualização visual imediata do status (SOLUÇÃO)
    const selectStatus = document.getElementById('select-status');
    const statusAtualSpan = document.getElementById('status-atual');
    
    if (selectStatus && statusAtualSpan) {
        selectStatus.addEventListener('change', function() {
            const novoStatus = this.value;
            
            // 1. Atualiza o texto
            statusAtualSpan.textContent = novoStatus;
            
            // 2. Atualiza a classe para mudar a cor/estilo (usa o valor em minúsculas)
            statusAtualSpan.className = 'tag-status ' + novoStatus.toLowerCase();
        });
    }
});