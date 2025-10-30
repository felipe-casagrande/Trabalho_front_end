// =================================================================
// Variáveis Globais e Funções Utilitárias
// =================================================================

let eventoAtual = null;
// CORREÇÃO: Lê os dados temporários do sessionStorage (onde o comprar_ingresso.js salva)
let resumoCompra = JSON.parse(sessionStorage.getItem('resumoCompra')) || null; 
let totalIngressos = 0;
let nomeEvento = "";

function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// =================================================================
// 1. Inicialização e Carregamento de Dados
// =================================================================

function carregarResumoEFormulario() {
    if (!resumoCompra || !resumoCompra.idEvento) {
        alert("Erro: Nenhum pedido encontrado. Retornando ao catálogo.");
        window.location.href = "principal_participante.html";
        return;
    }
    
    // Buscar o nome do evento
    const eventos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];
    eventoAtual = eventos.find(e => e.id === resumoCompra.idEvento);
    nomeEvento = eventoAtual ? eventoAtual.nome : 'Evento Desconhecido';

    renderizarResumo();
    renderizarFormulario();
}

function renderizarResumo() {
    const resumoDetalhado = document.getElementById('resumo-detalhado');
    const valorTotalResumo = document.getElementById('valor-total-resumo');
    let total = 0;
    
    resumoDetalhado.innerHTML = '';

    resumoCompra.ingressos.forEach(item => {
        const subtotal = item.quantidade * item.preco;
        total += subtotal;
        
        const itemHTML = `
            <div class="resumo-item-lote">
                <div>
                    <div class="lote-titulo">${item.quantidade}x ${item.lote}</div>
                    <div class="lote-preco">(${formatarMoeda(item.preco)} cada)</div>
                </div>
                <div class="lote-valor">${formatarMoeda(subtotal)}</div>
            </div>
        `;
        resumoDetalhado.insertAdjacentHTML('beforeend', itemHTML);
    });

    valorTotalResumo.textContent = formatarMoeda(total);
}

function renderizarFormulario() {
    const listaPortadores = document.getElementById('lista-portadores');
    listaPortadores.innerHTML = '';
    
    let contador = 0;
    
    resumoCompra.ingressos.forEach(item => {
        for (let i = 0; i < item.quantidade; i++) {
            contador++;
            totalIngressos++;
            
            const campoHTML = `
                <div class="item-portador" data-lote-nome="${item.lote}" data-item-index="${contador}">
                    <div class="nome-ingresso-lote">${contador}x ${item.lote}</div>
                    <label for="portador-${contador}">Nome completo no ingresso*:</label>
                    <input type="text" id="portador-${contador}" name="portador-${contador}" required placeholder="Nome e Sobrenome">
                </div>
            `;
            listaPortadores.insertAdjacentHTML('beforeend', campoHTML);
        }
    });
}

// =================================================================
// 2. Lógica de Navegação e Coleta de Dados
// =================================================================

function prosseguirParaPagamento(event) {
    event.preventDefault();
    
    const form = document.getElementById('form-dados-pessoais');
    if (!form.checkValidity()) {
        alert("Por favor, preencha o nome completo de todos os portadores.");
        form.reportValidity(); // Mostra mensagens de erro do HTML5
        return;
    }

    // 1. Coleta os nomes dos portadores
    const portadores = [];
    for (let i = 1; i <= totalIngressos; i++) {
        const input = document.getElementById(`portador-${i}`);
        const loteNome = input.closest('.item-portador').dataset.loteNome;
        
        portadores.push({
            lote: loteNome,
            nome: input.value
        });
    }

    // 2. Anexa os nomes ao objeto de resumo da compra
    resumoCompra.portadores = portadores;
    
    // 3. Salva o objeto completo no sessionStorage (dados temporários de checkout)
    sessionStorage.setItem('checkoutData', JSON.stringify(resumoCompra));

    // 4. Redireciona para a tela de pagamento
    window.location.href = "checkout_pagamento.html";
}


// =================================================================
// 3. Inicialização
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    carregarResumoEFormulario();
    
    // Adiciona listener ao botão de prosseguir
    document.getElementById('form-dados-pessoais').addEventListener('submit', prosseguirParaPagamento);
});