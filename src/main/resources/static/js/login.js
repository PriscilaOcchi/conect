// ===== LOGIN =====

// Máscara para documento (CPF/CNPJ)
document.getElementById('documento')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        // Máscara de CPF
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // Máscara de CNPJ
        value = value.replace(/(\d{2})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1/$2');
        value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    
    e.target.value = value;
});

// Toggle mostrar/ocultar senha
function toggleSenha() {
    const senhaInput = document.getElementById('senha');
    const icone = document.getElementById('iconeSenha');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        icone.classList.remove('fa-eye');
        icone.classList.add('fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        icone.classList.remove('fa-eye-slash');
        icone.classList.add('fa-eye');
    }
}

// Submit do formulário
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const documento = document.getElementById('documento').value.replace(/\D/g, '');
    const senha = document.getElementById('senha').value;
    
    // Validações
    if (!tipoUsuario) {
        mostrarAlerta('Selecione o tipo de acesso', 'warning');
        return;
    }
    
    if (!documento) {
        mostrarAlerta('Digite seu CPF ou CNPJ', 'warning');
        return;
    }
    
    if (documento.length !== 11 && documento.length !== 14) {
        mostrarAlerta('CPF ou CNPJ inválido', 'error');
        return;
    }
    
    if (!senha) {
        mostrarAlerta('Digite sua senha', 'warning');
        return;
    }
    
    // Mostrar loading
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    btnSubmit.disabled = true;
    
    try {
        // Simular login
        await simularLogin(tipoUsuario, documento, senha);
        
        // Salvar dados de sessão
        const usuario = {
            tipo: tipoUsuario,
            documento: documento,
            nome: tipoUsuario === 'catador' ? 'João Silva' : 'Empresa XYZ',
            logado: true,
            dataLogin: new Date().toISOString()
        };
        
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        
        // Redirecionar para dashboard correto
        if (tipoUsuario === 'catador') {
            window.location.href = 'dashboard-catador.html';
        } else {
            window.location.href = 'dashboard-empresa.html';
        }
        
    } catch (error) {
        mostrarAlerta(error.message, 'error');
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
    }
});

// Simular login no backend
function simularLogin(tipo, documento, senha) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Aqui você faria a chamada real à API
            // Por enquanto, aceita qualquer combinação
            
            // Para demonstração, vamos aceitar:
            // Senha: 123456 para qualquer usuário
            
            if (senha === '123456') {
                resolve({ success: true });
            } else {
                reject(new Error('CPF/CNPJ ou senha incorretos'));
            }
        }, 1500);
    });
}

// Função de alerta
function mostrarAlerta(mensagem, tipo = 'info') {
    const alertaExistente = document.querySelector('.alerta-flutuante');
    if (alertaExistente) {
        alertaExistente.remove();
    }
    
    const alerta = document.createElement('div');
    alerta.className = `alerta-flutuante alerta-${tipo}`;
    
    let icone;
    if (tipo === 'success') icone = 'fa-check-circle';
    else if (tipo === 'error') icone = 'fa-times-circle';
    else if (tipo === 'warning') icone = 'fa-exclamation-triangle';
    else icone = 'fa-info-circle';
    
    alerta.innerHTML = `
        <i class="fas ${icone}"></i>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(alerta);
    
    Object.assign(alerta.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '1.125rem',
        fontWeight: '600',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        animation: 'slideInRight 0.4s ease',
        maxWidth: '400px'
    });
    
    if (tipo === 'success') {
        alerta.style.backgroundColor = '#2ECC71';
        alerta.style.color = '#FFFFFF';
    } else if (tipo === 'error') {
        alerta.style.backgroundColor = '#E74C3C';
        alerta.style.color = '#FFFFFF';
    } else if (tipo === 'warning') {
        alerta.style.backgroundColor = '#F39C12';
        alerta.style.color = '#FFFFFF';
    } else {
        alerta.style.backgroundColor = '#3498DB';
        alerta.style.color = '#FFFFFF';
    }
    
    setTimeout(() => {
        alerta.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => alerta.remove(), 400);
    }, 4000);
}

// Verificar se já está logado
document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        
        // Redirecionar para dashboard correto
        if (usuario.tipo === 'catador') {
            window.location.href = 'dashboard-catador.html';
        } else {
            window.location.href = 'dashboard-empresa.html';
        }
    }
    
    // Focar no primeiro campo
    document.getElementById('tipoUsuario')?.focus();
});
