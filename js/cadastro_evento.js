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
// 2. Lógica de Gestão de Lotes (NOVO)
// =================================================================

let contadorLotes = 1; // Começa com 1, pois o campo inicial tem data-id="1"

function adicionarCampoIngresso() {
    contadorLotes++;
    const lista = document.getElementById('lista-tipos-ingressos');
    
    const novoCampoHTML = `
        <div class="tipo-ingresso" data-id="${contadorLotes}">
            <div class="linha-campos">
                <div class="campo-metade">
                    <label for="lote-${contadorLotes}">Nome do Ingresso/Lote*</label>
                    <input type="text" id="lote-${contadorLotes}" placeholder="Ex: Lote 2, Meia-entrada" required>
                </div>
                <div class="campo-quarto">
                    <label for="preco-${contadorLotes}">Preço (R$)*</label>
                    <input type="number" id="preco-${contadorLotes}" min="0.01" step="0.01" required>
                </div>
                <div class="campo-quarto">
                    <label for="quantidade-${contadorLotes}">Qtd. Disponível*</label>
                    <input type="number" id="quantidade-${contadorLotes}" min="1" required>
                </div>
            </div>
            <button type="button" class="btn-remover-lote" onclick="this.closest('.tipo-ingresso').remove()">
                Remover Lote
            </button>
        </div>
    `;
    
    lista.insertAdjacentHTML('beforeend', novoCampoHTML);
}

// =================================================================
// 3. Lógica de Cadastro do Evento (ATUALIZADA)
// =================================================================
function inicializarCadastroEvento() {
    document.getElementById('form-cadastro-evento').addEventListener('submit', function(event) {
        event.preventDefault(); 

        // 1. Coleta os dados básicos
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

        // 2. Coleta os dados dos ingressos
        const tiposIngressos = [];
        const lotes = document.querySelectorAll('.tipo-ingresso');
        let ingressosValidos = true;

        if (lotes.length === 0) {
            alert("É obrigatório definir pelo menos um tipo de ingresso.");
            return;
        }

        lotes.forEach(lote => {
            // Usa o data-id para encontrar os inputs correspondentes
            const id = lote.dataset.id; 
            const nomeLote = document.getElementById(`lote-${id}`).value;
            const precoInput = document.getElementById(`preco-${id}`);
            const quantidadeInput = document.getElementById(`quantidade-${id}`);
            
            const preco = parseFloat(precoInput.value);
            const quantidade = parseInt(quantidadeInput.value);

            if (!nomeLote || isNaN(preco) || isNaN(quantidade) || preco <= 0 || quantidade < 1) {
                ingressosValidos = false;
            }

            tiposIngressos.push({
                nome: nomeLote,
                preco: preco,
                quantidadeTotal: quantidade,
                quantidadeVendida: 0 // Novo campo para controle de estoque
            });
        });

        if (!ingressosValidos) {
            alert("Por favor, preencha todos os campos de ingresso (Nome, Preço e Qtd) com valores válidos (Preço > 0, Qtd >= 1).");
            return;
        }


        // 3. Estrutura o objeto do evento
        const novoEvento = {
            id: Date.now(), 
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
            organizador: localStorage.getItem('usuarioLogadoNome') || 'Organizador Desconhecido',
            ingressos: tiposIngressos // NOVO: Adiciona a lista de ingressos
        };

        // 4. Salva o evento
        let eventos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];
        eventos.push(novoEvento);
        localStorage.setItem('eventosSaqua', JSON.stringify(eventos));

        // 5. Feedback e redirecionamento
        alert(`Evento "${nome}" cadastrado com sucesso, com ${tiposIngressos.length} tipos de ingressos definidos!`);
        window.location.href = "principal_organizador.html";
    });
}


// =================================================================
// 4. Inicialização
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Perfil
    carregarNomeUsuario();

    if (botaoPerfil) {
        botaoPerfil.addEventListener('click', toggleDropdown);
    }

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
    
    // 3. Listener para o botão de adicionar lote
    const btnAdicionar = document.getElementById('btn-adicionar-ingresso');
    if(btnAdicionar) {
        btnAdicionar.addEventListener('click', adicionarCampoIngresso);
    }
});