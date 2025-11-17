// ===== MÁSCARAS DE ENTRADA =====

// Máscara para CPF
document.getElementById('cpf')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    e.target.value = value;
});

// Máscara para Telefone
document.getElementById('telefone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
});

// Máscara para CEP
document.getElementById('cep')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
});

// ===== NAVEGAÇÃO ENTRE ETAPAS =====

let etapaAtual = 1;

function proximaEtapa(numeroEtapa) {
    // Validar etapa atual antes de avançar
    if (!validarEtapaAtual()) {
        return;
    }
    
    // Ocultar etapa atual
    document.getElementById(`etapa${etapaAtual}`).classList.remove('active');
    
    // Atualizar progresso
    document.querySelectorAll('.progresso-item')[etapaAtual - 1].classList.remove('active');
    document.querySelectorAll('.progresso-item')[numeroEtapa - 1].classList.add('active');
    
    // Mostrar nova etapa
    document.getElementById(`etapa${numeroEtapa}`).classList.add('active');
    
    // Se for a etapa 3, preencher resumo
    if (numeroEtapa === 3) {
        preencherResumo();
    }
    
    etapaAtual = numeroEtapa;
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarEtapa(numeroEtapa) {
    // Ocultar etapa atual
    document.getElementById(`etapa${etapaAtual}`).classList.remove('active');
    
    // Atualizar progresso
    document.querySelectorAll('.progresso-item')[etapaAtual - 1].classList.remove('active');
    document.querySelectorAll('.progresso-item')[numeroEtapa - 1].classList.add('active');
    
    // Mostrar nova etapa
    document.getElementById(`etapa${numeroEtapa}`).classList.add('active');
    
    etapaAtual = numeroEtapa;
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== VALIDAÇÕES =====

function validarEtapaAtual() {
    if (etapaAtual === 1) {
        return validarEtapa1();
    } else if (etapaAtual === 2) {
        return validarEtapa2();
    }
    return true;
}

function validarEtapa1() {
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!nome) {
        mostrarAlerta('Por favor, digite seu nome completo', 'warning');
        document.getElementById('nome').focus();
        return false;
    }
    
    if (nome.split(' ').length < 2) {
        mostrarAlerta('Por favor, digite seu nome completo (nome e sobrenome)', 'warning');
        document.getElementById('nome').focus();
        return false;
    }
    
    if (!validarCPF(cpf)) {
        mostrarAlerta('CPF inválido. Verifique e tente novamente', 'error');
        document.getElementById('cpf').focus();
        return false;
    }
    
    if (!telefone || telefone.replace(/\D/g, '').length < 10) {
        mostrarAlerta('Telefone inválido. Digite com DDD', 'warning');
        document.getElementById('telefone').focus();
        return false;
    }
    
    if (!email || !validarEmail(email)) {
        mostrarAlerta('E-mail inválido. Verifique e tente novamente', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    return true;
}

function validarEtapa2() {
    const cep = document.getElementById('cep').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
        mostrarAlerta('Por favor, preencha o CEP corretamente', 'warning');
        document.getElementById('cep').focus();
        return false;
    }
    
    if (!cidade || !bairro) {
        mostrarAlerta('Por favor, busque o CEP primeiro', 'warning');
        return false;
    }
    
    return true;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== BUSCAR CEP =====

async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        mostrarAlerta('CEP deve ter 8 dígitos', 'warning');
        return;
    }
    
    // Mostrar loading
    const btnBuscar = document.querySelector('.btn-buscar-cep');
    const textoOriginal = btnBuscar.innerHTML;
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnBuscar.disabled = true;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            mostrarAlerta('CEP não encontrado', 'error');
            limparEndereco();
        } else {
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('bairro').value = data.bairro;
            mostrarAlerta('CEP encontrado!', 'success');
        }
    } catch (error) {
        mostrarAlerta('Erro ao buscar CEP. Tente novamente', 'error');
        limparEndereco();
    } finally {
        btnBuscar.innerHTML = textoOriginal;
        btnBuscar.disabled = false;
    }
}

function limparEndereco() {
    document.getElementById('cidade').value = '';
    document.getElementById('bairro').value = '';
}

// ===== PREENCHER RESUMO =====

function preencherResumo() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const cidade = document.getElementById('cidade').value;
    const bairro = document.getElementById('bairro').value;
    
    document.getElementById('resumo-nome').textContent = nome;
    document.getElementById('resumo-cpf').textContent = cpf;
    document.getElementById('resumo-telefone').textContent = telefone;
    document.getElementById('resumo-email').textContent = email;
    document.getElementById('resumo-localizacao').textContent = `${bairro}, ${cidade}`;
}

// ===== SUBMIT DO FORMULÁRIO =====

document.getElementById('cadastroForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Verificar se aceitou os termos
    if (!document.getElementById('aceiteTermos').checked) {
        mostrarAlerta('Você precisa aceitar os termos de uso', 'warning');
        return;
    }
    
    // Coletar dados
    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
        cep: document.getElementById('cep').value.replace(/\D/g, ''),
        cidade: document.getElementById('cidade').value,
        bairro: document.getElementById('bairro').value,
        tipo: 'catador',
        dataCadastro: new Date().toISOString()
    };
    
    // Desabilitar botão
    const btnCadastrar = document.querySelector('.btn-cadastrar');
    const textoOriginal = btnCadastrar.innerHTML;
    btnCadastrar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    btnCadastrar.disabled = true;
    
    try {
        // Enviar dados via fetch
        const response = await fetch('/api/cadastro-catador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }        
    
        
        // Salvar no localStorage (temporário)
        //localStorage.setItem('usuario', JSON.stringify(dados));
        
        // Mostrar modal de sucesso
        document.getElementById('modalSucesso').classList.add('active');
        
    } catch (error) {
        mostrarAlerta('Erro ao criar conta. Tente novamente', 'error');
        btnCadastrar.innerHTML = textoOriginal;
        btnCadastrar.disabled = false;
    }
});

// ===== ALERTAS =====

function mostrarAlerta(mensagem, tipo = 'info') {
    // Remover alertas anteriores
    const alertaExistente = document.querySelector('.alerta-flutuante');
    if (alertaExistente) {
        alertaExistente.remove();
    }
    
    // Criar alerta
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
    
    // Adicionar estilos inline
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
    
    // Remover após 4 segundos
    setTimeout(() => {
        alerta.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => alerta.remove(), 400);
    }, 4000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de cadastro carregada');
    
    // Focar no primeiro campo
    document.getElementById('nome')?.focus();
});
