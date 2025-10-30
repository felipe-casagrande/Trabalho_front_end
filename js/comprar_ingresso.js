// =================================================================
// Variáveis Globais e Dados
// =================================================================

let eventoAtual = null;
// { 'id_lote': quantidade_selecionada }
let quantidades = {}; 

// =================================================================
// 1. Lógica de Carregamento de Dados
// =================================================================

function carregarIngressos() {
    // 1. Obter o ID do evento da URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (!eventoId) {
        alert("Erro: ID do evento não fornecido.");
        window.history.back(); 
        return;
    }

    // 2. Buscar evento no localStorage
    const eventos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];
    // Usamos '==' para a comparação de ID, pois eventoId da URL é string
    eventoAtual = eventos.find(e => e.id == eventoId); 

    if (!eventoAtual || !eventoAtual.ingressos || eventoAtual.ingressos.length === 0) {
        alert("Nenhum ingresso disponível para este evento.");
        window.history.back();
        return;
    }

    // 3. Preencher Título e Link de Volta
    document.getElementById('nome-evento-compra').textContent = `Ingressos para: ${eventoAtual.nome}`;
    
    const btnVoltar = document.getElementById('btn-voltar-evento');
    // Link de volta para a tela de detalhes
    btnVoltar.href = `detalhe_evento.html?id=${eventoId}`; 

    // 4. Renderizar os cards de ingressos
    renderizarIngressos(eventoAtual.ingressos);
    calcularTotal(); // Inicializa o total como R$ 0,00
}

function renderizarIngressos(ingressos) {
    const listaContainer = document.getElementById('lista-ingressos-compra');
    listaContainer.innerHTML = '';

    ingressos.forEach((ingresso, index) => {
        // ID para controle interno de quantidade
        const idLote = index; 
        // Inicializa a quantidade selecionada para este lote
        quantidades[idLote] = 0; 

        // Calcula o estoque atual
        const estoqueAtual = ingresso.quantidadeTotal - ingresso.quantidadeVendida;

        const ingressoHTML = `
            <div class="item-ingresso" data-id-lote="${idLote}" data-preco="${ingresso.preco}" data-estoque="${estoqueAtual}">
                <div class="info-ingresso">
                    <div class="nome-ingresso">${ingresso.nome}</div>
                    <div class="preco-ingresso">R$ ${ingresso.preco.toFixed(2)} em até 10x sem juros</div>
                    <div class="aviso-esgotado" style="color: #e74c3c; font-size: 0.85em; display: ${estoqueAtual <= 0 ? 'block' : 'none'};">
                        ${estoqueAtual <= 0 ? 'Esgotado' : ''}
                    </div>
                </div>
                <div class="controle-quantidade" style="opacity: ${estoqueAtual <= 0 ? '0.5' : '1'};">
                    <button class="btn-qtd" data-acao="subtrair" data-id-lote="${idLote}" ${estoqueAtual <= 0 ? 'disabled' : ''}>-</button>
                    <span class="valor-qtd" id="qtd-${idLote}">0</span>
                    <button class="btn-qtd" data-acao="somar" data-id-lote="${idLote}" ${estoqueAtual <= 0 ? 'disabled' : ''}>+</button>
                </div>
            </div>
        `;
        listaContainer.insertAdjacentHTML('beforeend', ingressoHTML);
    });

    // Adiciona os listeners de clique aos botões de quantidade
    document.querySelectorAll('.btn-qtd').forEach(btn => {
        btn.addEventListener('click', gerenciarQuantidade);
    });
}

// =================================================================
// 2. Lógica de Quantidade e Total
// =================================================================

function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function gerenciarQuantidade(event) {
    const btn = event.currentTarget;
    const acao = btn.dataset.acao;
    const idLote = btn.dataset.idLote;
    const item = btn.closest('.item-ingresso');
    
    const estoque = parseInt(item.dataset.estoque);
    let qtdAtual = quantidades[idLote];
    const limitePorCompra = 10; // Limite máximo por transação

    if (acao === 'somar' && qtdAtual < limitePorCompra && qtdAtual < estoque) {
        qtdAtual++;
    } else if (acao === 'subtrair' && qtdAtual > 0) {
        qtdAtual--;
    } else {
        return; 
    }

    quantidades[idLote] = qtdAtual;
    document.getElementById(`qtd-${idLote}`).textContent = qtdAtual;
    
    calcularTotal();
}

function calcularTotal() {
    let total = 0;
    let ingressosSelecionados = 0;
    
    document.querySelectorAll('.item-ingresso').forEach(item => {
        const idLote = item.dataset.idLote;
        const preco = parseFloat(item.dataset.preco);
        const qtd = quantidades[idLote];
        
        total += preco * qtd;
        ingressosSelecionados += qtd;
    });

    const valorTotalElement = document.getElementById('valor-total');
    valorTotalElement.textContent = formatarMoeda(total); 
    
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    // Habilita o botão se houver pelo menos 1 ingresso selecionado
    btnFinalizar.disabled = ingressosSelecionados === 0;
}

// =================================================================
// 3. Lógica de Redirecionamento para Checkout (Fase 1)
// =================================================================

function finalizarCompra(event) {
    event.preventDefault();

    let totalGeral = 0;
    let ingressosSelecionados = 0;
    let ingressosComprados = [];

    // Calcula total e monta resumo dos ingressos selecionados
    document.querySelectorAll('.item-ingresso').forEach(item => {
        const idLote = item.dataset.idLote;
        const preco = parseFloat(item.dataset.preco);
        const qtd = quantidades[idLote];
        
        if (qtd > 0) {
            const nomeLote = item.querySelector('.nome-ingresso').textContent;
            totalGeral += preco * qtd;
            ingressosSelecionados += qtd;
            
            // Adiciona o ingresso selecionado ao array de compra
            ingressosComprados.push({
                lote: nomeLote,
                quantidade: qtd,
                preco: preco
            });
        }
    });

    if (ingressosSelecionados === 0) {
        alert("Selecione pelo menos um ingresso para prosseguir.");
        return;
    }

    // 1. Cria o objeto principal para a próxima fase do checkout
    const checkoutData = {
        idEvento: eventoAtual.id,
        nomeEvento: eventoAtual.nome,
        total: totalGeral,
        ingressos: ingressosComprados,
        // Inclui o objeto completo do evento para fácil acesso
        evento: eventoAtual 
    };
    
    // 2. Salva os dados no sessionStorage (usamos sessionStorage para dados temporários de checkout)
    sessionStorage.setItem('resumoCompra', JSON.stringify(checkoutData));

    // 3. Redireciona para a tela de dados pessoais (Checkout Fase 1)
    window.location.href = "checkout_dados.html";
}


// =================================================================
// 4. Inicialização
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    carregarIngressos();
    document.getElementById('btn-finalizar-compra').addEventListener('click', finalizarCompra);
});