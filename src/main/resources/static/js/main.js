// ===== RECICLACONECT - MAIN.JS =====

// ===== MENU MOBILE =====

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// ===== FORMULÁRIO DE CONTATO =====

const contatoForm = document.getElementById('contatoForm');

if (contatoForm) {
    contatoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        
        const dados = {
            nome,
            email,
            mensagem,
            data: new Date().toISOString()
        };
        
        // Simular envio
        await simularEnvioContato(dados);
        
        // Limpar formulário
        contatoForm.reset();
        
        // Mostrar mensagem de sucesso
        mostrarNotificacao('Mensagem enviada com sucesso! Retornaremos em breve.', 'success');
    });
}

function simularEnvioContato(dados) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Contato enviado:', dados);
            resolve();
        }, 1000);
    });
}

// ===== SCROLL SUAVE =====

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 80; // Altura do header
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== HEADER SCROLL =====

let lastScroll = 0;
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===== ANIMAÇÕES AO SCROLL =====

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos
document.querySelectorAll('.step-card, .benefit-card, .depoimento-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===== ESTATÍSTICAS ANIMADAS =====

function animarNumero(elemento, valorFinal, duracao = 2000) {
    const valorInicial = 0;
    const incremento = valorFinal / (duracao / 16);
    let valorAtual = valorInicial;
    
    const timer = setInterval(() => {
        valorAtual += incremento;
        
        if (valorAtual >= valorFinal) {
            elemento.textContent = valorFinal;
            clearInterval(timer);
        } else {
            elemento.textContent = Math.floor(valorAtual);
        }
    }, 16);
}

// ===== NOTIFICAÇÕES =====

function mostrarNotificacao(mensagem, tipo = 'info') {
    // Remover notificações anteriores
    const notificacaoExistente = document.querySelector('.notificacao');
    if (notificacaoExistente) {
        notificacaoExistente.remove();
    }
    
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    
    let cor;
    let icone;
    
    switch(tipo) {
        case 'success':
            cor = '#2ECC71';
            icone = 'fa-check-circle';
            break;
        case 'error':
            cor = '#E74C3C';
            icone = 'fa-times-circle';
            break;
        case 'warning':
            cor = '#F39C12';
            icone = 'fa-exclamation-triangle';
            break;
        default:
            cor = '#3498DB';
            icone = 'fa-info-circle';
    }
    
    notificacao.innerHTML = `
        <i class="fas ${icone}"></i>
        <span>${mensagem}</span>
        <button class="btn-fechar" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    Object.assign(notificacao.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: cor,
        color: '#FFFFFF',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '1rem',
        fontWeight: '600',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        animation: 'slideIn 0.4s ease',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notificacao);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => notificacao.remove(), 400);
    }, 5000);
}

// ===== UTILITÁRIOS =====

// Validar Email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatar Telefone
function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length === 11) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
}

// Formatar CEP
function formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ADICIONAR ESTILOS DE ANIMAÇÃO =====

const styleAnimations = document.createElement('style');
styleAnimations.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notificacao .btn-fechar {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.5rem;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notificacao .btn-fechar:hover {
        opacity: 1;
    }
`;
document.head.appendChild(styleAnimations);

// ===== VERIFICAR SE ESTÁ LOGADO =====

function estaLogado() {
    return localStorage.getItem('usuario') !== null;
}

function getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = '/';
}

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', () => {
    console.log('ReciclaConect carregado!');
    
    // Detectar tema do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('Tema escuro detectado');
    }
    
    // Log de performance
    if (window.performance) {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                        window.performance.timing.navigationStart;
        console.log(`Página carregada em ${loadTime}ms`);
    }
});

// ===== EXPORTAR FUNÇÕES =====

window.ReciclaConect = {
    mostrarNotificacao,
    validarEmail,
    formatarCPF,
    formatarTelefone,
    formatarCEP,
    estaLogado,
    getUsuario,
    logout
};
