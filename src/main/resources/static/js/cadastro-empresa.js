// ===== MÁSCARAS DE ENTRADA =====

// Máscara para CNPJ
document.getElementById('cnpj')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 14) {
        value = value.replace(/(\d{2})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1/$2');
        value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    
    e.target.value = value;
});

// Máscara para Telefone
document.getElementById('telefoneEmpresa')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
    }
    
    e.target.value = value;
});

// Máscara para CEP
document.getElementById('cepEmpresa')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
});

// ===== NAVEGAÇÃO ENTRE ETAPAS =====

let etapaAtualEmpresa = 1;

function proximaEtapaEmpresa(numeroEtapa) {
    if (!validarEtapaAtualEmpresa()) {
        return;
    }
    
    document.getElementById(`etapa${etapaAtualEmpresa}`).classList.remove('active');
    document.querySelectorAll('.progresso-item')[etapaAtualEmpresa - 1].classList.remove('active');
    document.querySelectorAll('.progresso-item')[numeroEtapa - 1].classList.add('active');
    document.getElementById(`etapa${numeroEtapa}`).classList.add('active');
    
    if (numeroEtapa === 4) {
        preencherResumoEmpresa();
    }
    
    etapaAtualEmpresa = numeroEtapa;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarEtapaEmpresa(numeroEtapa) {
    document.getElementById(`etapa${etapaAtualEmpresa}`).classList.remove('active');
    document.querySelectorAll('.progresso-item')[etapaAtualEmpresa - 1].classList.remove('active');
    document.querySelectorAll('.progresso-item')[numeroEtapa - 1].classList.add('active');
    document.getElementById(`etapa${numeroEtapa}`).classList.add('active');
    
    etapaAtualEmpresa = numeroEtapa;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== VALIDAÇÕES =====

function validarEtapaAtualEmpresa() {
    if (etapaAtualEmpresa === 1) {
        return validarEtapa1Empresa();
    } else if (etapaAtualEmpresa === 2) {
        return validarEtapa2Empresa();
    } else if (etapaAtualEmpresa === 3) {
        return validarEtapa3Empresa();
    }
    return true;
}

function validarEtapa1Empresa() {
    const razaoSocial = document.getElementById('razaoSocial').value.trim();
    const nomeFantasia = document.getElementById('nomeFantasia').value.trim();
    const cnpj = document.getElementById('cnpj').value.trim();
    const segmento = document.getElementById('segmento').value;
    
    if (!razaoSocial) {
        mostrarAlerta('Por favor, informe a razão social da empresa', 'warning');
        document.getElementById('razaoSocial').focus();
        return false;
    }
    
    if (!nomeFantasia) {
        mostrarAlerta('Por favor, informe o nome fantasia', 'warning');
        document.getElementById('nomeFantasia').focus();
        return false;
    }
    
    if (!validarCNPJ(cnpj)) {
        mostrarAlerta('CNPJ inválido. Verifique e tente novamente', 'error');
        document.getElementById('cnpj').focus();
        return false;
    }
    
    if (!segmento) {
        mostrarAlerta('Por favor, selecione o segmento da empresa', 'warning');
        document.getElementById('segmento').focus();
        return false;
    }
    
    return true;
}

function validarEtapa2Empresa() {
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefoneEmpresa').value.trim();
    const responsavel = document.getElementById('responsavel').value.trim();
    const cargo = document.getElementById('cargoResponsavel').value.trim();
    
    if (!email || !validarEmail(email)) {
        mostrarAlerta('Email inválido', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    if (!telefone || telefone.replace(/\D/g, '').length < 10) {
        mostrarAlerta('Telefone inválido', 'warning');
        document.getElementById('telefoneEmpresa').focus();
        return false;
    }
    
    if (!responsavel) {
        mostrarAlerta('Por favor, informe o nome do responsável', 'warning');
        document.getElementById('responsavel').focus();
        return false;
    }
    
    if (!cargo) {
        mostrarAlerta('Por favor, informe o cargo', 'warning');
        document.getElementById('cargoResponsavel').focus();
        return false;
    }
    
    return true;
}

function validarEtapa3Empresa() {
    const cep = document.getElementById('cepEmpresa').value.trim();
    const cidade = document.getElementById('cidadeEmpresa').value.trim();
    const bairro = document.getElementById('bairroEmpresa').value.trim();
    const numero = document.getElementById('numero').value.trim();
    
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
        mostrarAlerta('Por favor, preencha o CEP corretamente', 'warning');
        document.getElementById('cepEmpresa').focus();
        return false;
    }
    
    if (!cidade || !bairro) {
        mostrarAlerta('Por favor, busque o CEP primeiro', 'warning');
        return false;
    }
    
    if (!numero) {
        mostrarAlerta('Por favor, informe o número do endereço', 'warning');
        document.getElementById('numero').focus();
        return false;
    }
    
    return true;
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;
    
    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== BUSCAR CEP =====

async function buscarCEPEmpresa() {
    const cepInput = document.getElementById('cepEmpresa');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        mostrarAlerta('CEP deve ter 8 dígitos', 'warning');
        return;
    }
    
    const btnBuscar = document.querySelector('.btn-buscar-cep');
    const textoOriginal = btnBuscar.innerHTML;
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnBuscar.disabled = true;
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            mostrarAlerta('CEP não encontrado', 'error');
            limparEnderecoEmpresa();
        } else {
            document.getElementById('cidadeEmpresa').value = data.localidade;
            document.getElementById('bairroEmpresa').value = data.bairro;
            document.getElementById('endereco').value = data.logradouro;
            mostrarAlerta('CEP encontrado!', 'success');
        }
    } catch (error) {
        mostrarAlerta('Erro ao buscar CEP. Tente novamente', 'error');
        limparEnderecoEmpresa();
    } finally {
        btnBuscar.innerHTML = textoOriginal;
        btnBuscar.disabled = false;
    }
}

function limparEnderecoEmpresa() {
    document.getElementById('cidadeEmpresa').value = '';
    document.getElementById('bairroEmpresa').value = '';
    document.getElementById('endereco').value = '';
}

// ===== PREENCHER RESUMO =====

function preencherResumoEmpresa() {
    const razaoSocial = document.getElementById('razaoSocial').value;
    const nomeFantasia = document.getElementById('nomeFantasia').value;
    const cnpj = document.getElementById('cnpj').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefoneEmpresa').value;
    const responsavel = document.getElementById('responsavel').value;
    const cargo = document.getElementById('cargoResponsavel').value;
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairroEmpresa').value;
    const cidade = document.getElementById('cidadeEmpresa').value;
    
    document.getElementById('resumo-razao').textContent = `${nomeFantasia} (${razaoSocial})`;
    document.getElementById('resumo-cnpj').textContent = cnpj;
    document.getElementById('resumo-email').textContent = email;
    document.getElementById('resumo-telefone-empresa').textContent = telefone;
    document.getElementById('resumo-responsavel').textContent = `${responsavel} - ${cargo}`;
    document.getElementById('resumo-endereco').textContent = `${endereco}, ${numero} - ${bairro}, ${cidade}`;
}

// ===== SUBMIT DO FORMULÁRIO =====

document.getElementById('cadastroEmpresaForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!document.getElementById('aceiteTermosEmpresa').checked) {
        mostrarAlerta('Você precisa aceitar os termos de uso', 'warning');
        return;
    }
    
    const dados = {
        razaoSocial: document.getElementById('razaoSocial').value,
        nomeFantasia: document.getElementById('nomeFantasia').value,
        cnpj: document.getElementById('cnpj').value.replace(/\D/g, ''),
        segmento: document.getElementById('segmento').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefoneEmpresa').value.replace(/\D/g, ''),
        responsavel: document.getElementById('responsavel').value,
        cargo: document.getElementById('cargoResponsavel').value,
        cep: document.getElementById('cepEmpresa').value.replace(/\D/g, ''),
        cidade: document.getElementById('cidadeEmpresa').value,
        bairro: document.getElementById('bairroEmpresa').value,
        endereco: document.getElementById('endereco').value,
        numero: document.getElementById('numero').value,
        tipo: 'empresa',
        dataCadastro: new Date().toISOString()
    };
    
    const btnCadastrar = document.querySelector('.btn-cadastrar');
    const textoOriginal = btnCadastrar.innerHTML;
    btnCadastrar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
    btnCadastrar.disabled = true;
    
    try {
        await simularCadastroEmpresa(dados);
        localStorage.setItem('empresa', JSON.stringify(dados));
        document.getElementById('modalSucessoEmpresa').classList.add('active');
    } catch (error) {
        mostrarAlerta('Erro ao cadastrar empresa. Tente novamente', 'error');
        btnCadastrar.innerHTML = textoOriginal;
        btnCadastrar.disabled = false;
    }
});

function simularCadastroEmpresa(dados) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Empresa cadastrada:', dados);
            resolve();
        }, 2000);
    });
}

// ===== ALERTAS =====

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

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cadastro de empresa carregado');
    document.getElementById('razaoSocial')?.focus();
});
