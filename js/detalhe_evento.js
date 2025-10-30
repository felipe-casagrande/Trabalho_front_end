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

    document.addEventListener('click', function (event) {
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

// =================================================================
// 2. Lógica de Favoritos
// =================================================================
function getFavoritos() {
    const favoritos = localStorage.getItem('eventosFavoritos');
    return favoritos ? JSON.parse(favoritos) : [];
}

function alternarFavorito(eventoId, icone, texto) {
    let favoritos = getFavoritos();
    const index = favoritos.indexOf(eventoId);

    if (index !== -1) {
        favoritos.splice(index, 1);
        icone.classList.replace('fas', 'far');
        texto.textContent = 'Adicionar aos Favoritos';
    } else {
        favoritos.push(eventoId);
        icone.classList.replace('far', 'fas');
        texto.textContent = 'Remover dos Favoritos';
    }

    localStorage.setItem('eventosFavoritos', JSON.stringify(favoritos));
}

// =================================================================
// 3. Carregamento e Renderização do Evento
// =================================================================
function carregarDetalhesEvento() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = parseInt(urlParams.get('id'));

    if (!eventoId) {
        document.querySelector('.container-detalhe').innerHTML =
            '<h1>Evento Não Encontrado</h1><p>ID do evento não fornecido.</p>';
        return;
    }

    const eventos = JSON.parse(localStorage.getItem('eventosSaqua')) || [];
    const evento = eventos.find(e => e.id === eventoId);

    if (!evento) {
        document.querySelector('.container-detalhe').innerHTML =
            `<h1>Evento Não Encontrado</h1><p>O evento com o ID ${eventoId} não foi encontrado.</p>`;
        return;
    }

    renderizarDetalhes(evento);
    configurarAcoes(evento);
}

function renderizarDetalhes(evento) {
    // Atualiza imagem
    const banner = document.getElementById('banner-evento');
    if (banner) banner.src = evento.imagem || '../imagens/eventos/default.jpg';

    // Atualiza título e subtítulo
    document.getElementById('evento-titulo').textContent = evento.nome || 'Evento sem título';
    document.getElementById('evento-subtitulo').textContent = evento.categoria || 'Categoria não informada';

    // Atualiza data e hora
    const dataInicio = new Date(evento.dataInicio).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    document.getElementById('data-detalhe').textContent = `${dataInicio} às ${evento.horaInicio}`;
    document.getElementById('local-detalhe').textContent = evento.local || evento.endereco || 'Local não informado';

    // Atualiza organizador e descrição
    document.getElementById('organizador-nome').textContent = `Organizador: ${evento.organizador}`;
    document.getElementById('evento-descricao').textContent =
        evento.descricaoDetalhada || evento.descricao || 'Descrição não informada.';

    // Atualiza data destacada
    const dataObj = new Date(evento.dataInicio);
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const hora = evento.horaInicio || '--:--';
    document.getElementById('data-dia-mes').textContent = `${dia}/${mes}`;
    document.getElementById('data-hora').textContent = hora;
    document.getElementById('local-completo').textContent =
        evento.local || evento.endereco || 'Endereço não informado';

    // Atualiza botão de favorito
    const iconeFavorito = document.getElementById('icone-favorito');
    const textoFavorito = document.getElementById('texto-favorito');
    const favoritos = getFavoritos();

    if (favoritos.includes(evento.id)) {
        iconeFavorito.classList.replace('far', 'fas');
        textoFavorito.textContent = 'Remover dos Favoritos';
    } else {
        iconeFavorito.classList.replace('fas', 'far');
        textoFavorito.textContent = 'Adicionar aos Favoritos';
    }

    // Verifica disponibilidade de ingressos
    const ingressosDisponiveis = evento.ingressos?.some(
        i => (i.quantidadeTotal - i.quantidadeVendida) > 0
    );
    const btnComprar = document.getElementById('btn-comprar-ingresso');
    const avisoCapacidade = document.getElementById('aviso-capacidade-restante');

    if (btnComprar) {
        if (ingressosDisponiveis) {
            btnComprar.disabled = false;
            avisoCapacidade.textContent = 'Ingressos disponíveis!';
            avisoCapacidade.style.color = '#27ae60';
        } else {
            btnComprar.disabled = true;
            avisoCapacidade.textContent = 'Ingressos esgotados.';
            avisoCapacidade.style.color = '#e74c3c';
        }
    }
}

function configurarAcoes(evento) {
    const iconeFavorito = document.getElementById('icone-favorito');
    const textoFavorito = document.getElementById('texto-favorito');
    const btnComprar = document.getElementById('btn-comprar-ingresso');

    // Ação de favoritar
    if (iconeFavorito && textoFavorito) {
        iconeFavorito.addEventListener('click', () => alternarFavorito(evento.id, iconeFavorito, textoFavorito));
        textoFavorito.addEventListener('click', () => alternarFavorito(evento.id, iconeFavorito, textoFavorito));
    }

    // Ação de compra
    if (btnComprar) {
        btnComprar.addEventListener('click', (e) => {
            e.preventDefault();
            if (!btnComprar.disabled) {
                window.location.href = `comprar_ingresso.html?id=${evento.id}`;
            }
        });
    }
}

// =================================================================
// 4. Inicialização
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarNomeUsuario();
    configurarMenuPerfil();
    carregarDetalhesEvento();
});
