// =================================================================
// Variáveis Globais e Funções Utilitárias
// =================================================================

let checkoutData = JSON.parse(sessionStorage.getItem('checkoutData'));
let valorTotal = checkoutData ? checkoutData.total : 0;
let parcelasSelecionadas = 1;

function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// =================================================================
// 1. Lógica de Carregamento e Interface
// =================================================================

const FORMULARIO_CARTAO = `
    <div class="campo-linha-unica">
        <label for="nome-cartao">Nome impresso no cartão*</label>
        <input type="text" id="nome-cartao" required>
    </div>
    <div class="campo-linha-unica">
        <label for="numero-cartao">Número do cartão*</label>
        <input type="text" id="numero-cartao" required>
    </div>
    <div class="campo-linha-tres">
        <div>
            <label for="validade-cartao">Data de Validade*</label>
            <input type="text" id="validade-cartao" placeholder="MM/AA" required>
        </div>
        <div>
            <label for="cvv">Código de Segurança*</label>
            <input type="text" id="cvv" required>
        </div>
        <div>
             <label for="cpf-titular">CPF do Titular*</label>
            <input type="text" id="cpf-titular" required>
        </div>
    </div>
`;

const FORMULARIO_PIX = `
    <div class="pix-detalhes">
        <h4>Chave PIX ou QR Code (Simulação)</h4>
        <div class="qr-code-box">
            <span>[QR CODE SIMULADO]</span>
        </div>
        <p class="instrucao-pix">Utilize o app do seu banco para ler o QR Code ou copiar o código PIX abaixo:</p>
        <div class="campo-linha-unica">
            <input type="text" value="CopiaEColaSimulado12345" readonly>
        </div>
        <p>O pagamento deve ser feito em **1x de ${formatarMoeda(valorTotal)}**.</p>
    </div>
`;


function carregarResumoEFormulario() {
    if (!checkoutData) {
        alert("Erro de sessão: Pedido não encontrado.");
        window.location.href = "principal_participante.html";
        return;
    }

    // 1. Carrega Resumo do Pedido
    const resumoDetalhado = document.getElementById('resumo-detalhado-pagamento');
    const valorTotalElement = document.getElementById('valor-total-resumo');
    const qtdTotalItens = document.getElementById('qtd-total-itens');

    let totalItens = 0;
    
    resumoDetalhado.innerHTML = checkoutData.ingressos.map(item => {
        totalItens += item.quantidade;
        const subtotal = item.quantidade * item.preco;
        return `
            <div class="resumo-item-lote">
                <div>
                    <div class="lote-titulo">${item.quantidade}x ${item.lote}</div>
                    <div class="lote-preco">(${formatarMoeda(item.preco)} cada)</div>
                </div>
                <div class="lote-valor">${formatarMoeda(subtotal)}</div>
            </div>
        `;
    }).join('');

    valorTotalElement.textContent = formatarMoeda(valorTotal);
    qtdTotalItens.textContent = `Total (${totalItens} itens)`;


    // 2. Inicializa o Formulário (padrão: Cartão)
    document.getElementById('detalhes-pagamento').innerHTML = FORMULARIO_CARTAO;
    alternarMetodoPagamento('cartao');
    
    // 3. Configura Parcelamento
    configurarParcelamento();
    
    // 4. Listener para troca de método
    document.querySelectorAll('input[name="metodo-pagamento"]').forEach(radio => {
        radio.addEventListener('change', (e) => alternarMetodoPagamento(e.target.value));
    });
}


function alternarMetodoPagamento(metodo) {
    const detalhesDiv = document.getElementById('detalhes-pagamento');
    const secaoParcelamento = document.getElementById('secao-parcelamento');
    
    if (metodo === 'cartao') {
        detalhesDiv.innerHTML = FORMULARIO_CARTAO;
        secaoParcelamento.style.display = 'block';
    } else if (metodo === 'pix') {
        detalhesDiv.innerHTML = FORMULARIO_PIX;
        secaoParcelamento.style.display = 'none';
    }
}


function configurarParcelamento() {
    const select = document.getElementById('select-parcelas');
    const valorParcelaElement = document.getElementById('valor-parcela');
    select.innerHTML = '';

    for (let p = 1; p <= 10; p++) { // Simulação de 10x sem juros
        const valorParcela = valorTotal / p;
        const option = document.createElement('option');
        
        option.value = p;
        option.textContent = `${p}x de ${formatarMoeda(valorParcela)}`;
        select.appendChild(option);
    }
    
    // Atualiza o valor da parcela ao selecionar
    select.addEventListener('change', () => {
        parcelasSelecionadas = parseInt(select.value);
        const valorParcela = valorTotal / parcelasSelecionadas;
        valorParcelaElement.textContent = `${parcelasSelecionadas}x de ${formatarMoeda(valorParcela)}`;
    });
    
    // Define o valor inicial (1x)
    valorParcelaElement.textContent = `1x de ${formatarMoeda(valorTotal)}`;
}


// =================================================================
// 4. Lógica de Finalizar (Simulação da Transação)
// =================================================================

function finalizarTransacao(event) {
    event.preventDefault();

    const form = document.getElementById('form-pagamento');
    const metodo = document.querySelector('input[name="metodo-pagamento"]:checked').value;
    
    // Validação básica do formulário (só para cartao, pix é simulado)
    if (metodo === 'cartao' && !form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 1. Simulação do Processamento
    const totalCompra = formatarMoeda(valorTotal);
    const parcelas = (metodo === 'cartao') ? `${parcelasSelecionadas}x` : '1x (PIX)';
    
    // 2. Monta o Ingresso Final (Ingressos Comprados + Dados do Checkout)
    const ingressosCompradosFinal = checkoutData.portadores.map(portador => {
        // Encontra o preço do lote original para o resumo
        const itemLote = checkoutData.ingressos.find(i => i.lote === portador.lote);
        
        return {
            nomeEvento: checkoutData.nomeEvento,
            data: checkoutData.evento.dataInicio,
            local: checkoutData.evento.local,
            setor: portador.lote,
            horario: checkoutData.evento.horaInicio,
            nomePortador: portador.nome
        };
    });
    
    // 3. Simula a emissão dos ingressos (Atualiza a lista de ingressos do usuário no localStorage)
    let meusIngressos = JSON.parse(localStorage.getItem('meusIngressos')) || [];
    meusIngressos.push(...ingressosCompradosFinal);
    localStorage.setItem('meusIngressos', JSON.stringify(meusIngressos));
    
    
    // 4. Feedback e Limpeza
    alert(`Pagamento processado com sucesso via ${metodo.toUpperCase()}! Total: ${totalCompra} em ${parcelas}. Seus ingressos foram emitidos!`);
    sessionStorage.removeItem('checkoutData'); // Limpa a sessão temporária
    localStorage.removeItem('resumoCompra'); // Limpa o resumo da tela de nomes

    // 5. Redireciona para a tela de Meus Ingressos
    window.location.href = "meus_ingressos.html";
}


// =================================================================
// 5. Inicialização
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    carregarResumoEFormulario();
    
    // Configura o botão de finalização
    document.getElementById('form-pagamento').addEventListener('submit', finalizarTransacao);
    
    // Ajusta o link de voltar
    const btnVoltar = document.querySelector('.btn-voltar-checkout');
    if (btnVoltar && checkoutData) {
        btnVoltar.href = `checkout_dados.html`; // Volta para a tela de dados
    }
});