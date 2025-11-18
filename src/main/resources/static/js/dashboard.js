// ========================================
// DASHBOARD.JS - Funcionalidades do Dashboard
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    const userData = checkAuth();
    
    // Atualizar nome do usuário
    const userNameElements = document.querySelectorAll('#userName');
    if (userData && userData.name) {
        userNameElements.forEach(el => {
            el.textContent = userData.name;
        });
    }
    
    // Inicializar mapa preview
    initMapPreview();
});

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    
    // Criar ou remover overlay
    let overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar.classList.contains('active')) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.onclick = toggleSidebar;
            document.body.appendChild(overlay);
        }
        setTimeout(() => overlay.classList.add('active'), 10);
    } else {
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }
}

// Initialize Map Preview
function initMapPreview() {
    const mapPreview = document.getElementById('mapPreview');
    if (!mapPreview) return;
    
    // Coordenadas de São Paulo
    const map = L.map('mapPreview').setView([-23.5505, -46.6333], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Adicionar marcadores de exemplo
    const empresas = [
        { lat: -23.5880, lng: -46.6320, name: 'EcoRecicla Ltda', type: 'empresa' },
        { lat: -23.5950, lng: -46.6100, name: 'Reciclagem Paulista', type: 'empresa' },
        { lat: -23.6680, lng: -46.5350, name: 'CoopRecicla ABC', type: 'cooperativa' },
        { lat: -23.5980, lng: -46.5980, name: 'Ecoponto Mooca', type: 'ponto' }
    ];
    
    empresas.forEach(empresa => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-icon marker-${empresa.type}"><i class="fas fa-${empresa.type === 'empresa' ? 'building' : empresa.type === 'cooperativa' ? 'users' : 'recycle'}"></i></div>`,
            iconSize: [40, 40]
        });
        
        L.marker([empresa.lat, empresa.lng], { icon: icon })
            .addTo(map)
            .bindPopup(`<b>${empresa.name}</b><br>${empresa.type}`);
    });
    
    // Estilo para marcadores customizados
    const markerStyles = document.createElement('style');
    markerStyles.textContent = `
        .marker-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            border: 3px solid white;
        }
        
        .marker-empresa {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .marker-cooperativa {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .marker-ponto {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
    `;
    document.head.appendChild(markerStyles);
}

// Atualizar estatísticas
function updateStats() {
    // Simular atualização de estatísticas
    const stats = {
        transacoes: Math.floor(Math.random() * 20) + 5,
        receita: (Math.random() * 3000 + 1000).toFixed(2),
        material: Math.floor(Math.random() * 1000) + 500,
        avaliacao: (Math.random() * 1 + 4).toFixed(1)
    };
    
    return stats;
}

// Filtrar oportunidades
function filterOpportunities(filter) {
    const opportunities = document.querySelectorAll('.opportunity-card');
    
    opportunities.forEach(opp => {
        if (filter === 'all') {
            opp.style.display = 'block';
        } else {
            const type = opp.dataset.type;
            opp.style.display = type === filter ? 'block' : 'none';
        }
    });
}

// Buscar oportunidades
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase();
            const opportunities = document.querySelectorAll('.opportunity-card');
            
            opportunities.forEach(opp => {
                const text = opp.textContent.toLowerCase();
                opp.style.display = text.includes(query) ? 'block' : 'none';
            });
        }, 300);
    });
}

// Notificações
function loadNotifications() {
    const notifications = [
        {
            id: 1,
            title: 'Nova Mensagem',
            message: 'EcoRecicla respondeu sua proposta',
            time: '5 min atrás',
            read: false,
            icon: 'fa-comment',
            color: '#4facfe'
        },
        {
            id: 2,
            title: 'Nova Oportunidade',
            message: 'Nova empresa procurando plástico na sua região',
            time: '1 hora atrás',
            read: false,
            icon: 'fa-briefcase',
            color: '#667eea'
        },
        {
            id: 3,
            title: 'Transação Concluída',
            message: 'Pagamento de R$ 420,00 recebido',
            time: '2 horas atrás',
            read: false,
            icon: 'fa-check-circle',
            color: '#43e97b'
        },
        {
            id: 4,
            title: 'Avaliação Recebida',
            message: 'Você recebeu 5 estrelas de MetalCoop',
            time: '1 dia atrás',
            read: true,
            icon: 'fa-star',
            color: '#ffa502'
        },
        {
            id: 5,
            title: 'Lembrete',
            message: 'Você tem uma coleta agendada amanhã',
            time: '1 dia atrás',
            read: true,
            icon: 'fa-calendar',
            color: '#f093fb'
        }
    ];
    
    return notifications;
}

// Mostrar notificações
function showNotifications() {
    const notifications = loadNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Atualizar badge
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
    }
    
    // Criar modal de notificações
    const modal = document.createElement('div');
    modal.className = 'notifications-modal';
    modal.innerHTML = `
        <div class="notifications-header">
            <h3><i class="fas fa-bell"></i> Notificações</h3>
            <button onclick="closeNotifications()"><i class="fas fa-times"></i></button>
        </div>
        <div class="notifications-list">
            ${notifications.map(n => `
                <div class="notification-item ${n.read ? 'read' : ''}">
                    <div class="notification-icon" style="background: ${n.color}">
                        <i class="fas ${n.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <h4>${n.title}</h4>
                        <p>${n.message}</p>
                        <span class="notification-time">${n.time}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="notifications-footer">
            <button class="btn btn-secondary btn-sm" onclick="markAllAsRead()">
                <i class="fas fa-check-double"></i> Marcar todas como lidas
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Estilos para modal
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .notifications-modal {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .notifications-modal.show {
            right: 0;
        }
        
        .notifications-header {
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .notifications-header h3 {
            margin: 0;
            font-size: 1.2rem;
            color: #2c3e50;
        }
        
        .notifications-header button {
            background: transparent;
            border: none;
            font-size: 1.3rem;
            color: #6c757d;
            cursor: pointer;
            padding: 5px 10px;
        }
        
        .notifications-list {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        
        .notification-item {
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            display: flex;
            gap: 15px;
            background: #f8f9fa;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .notification-item:not(.read) {
            background: #e7f3ff;
            border-left: 3px solid #4facfe;
        }
        
        .notification-item:hover {
            transform: translateX(-5px);
        }
        
        .notification-icon {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-content h4 {
            margin: 0 0 5px 0;
            font-size: 1rem;
            color: #2c3e50;
        }
        
        .notification-content p {
            margin: 0 0 5px 0;
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .notification-time {
            font-size: 0.8rem;
            color: #adb5bd;
        }
        
        .notifications-footer {
            padding: 15px;
            border-top: 1px solid #e9ecef;
            text-align: center;
        }
        
        @media (max-width: 576px) {
            .notifications-modal {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(modalStyles);
}

function closeNotifications() {
    const modal = document.querySelector('.notifications-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function markAllAsRead() {
    showToast('Todas as notificações foram marcadas como lidas', 'success');
    closeNotifications();
    
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = '0';
    }
}

// Event listener para botão de notificações
const notificationBtn = document.querySelector('.btn-icon[title="Notificações"]');
if (notificationBtn) {
    notificationBtn.addEventListener('click', showNotifications);
}

// Exportar funções
window.toggleSidebar = toggleSidebar;
window.filterOpportunities = filterOpportunities;
window.showNotifications = showNotifications;
window.closeNotifications = closeNotifications;
window.markAllAsRead = markAllAsRead;
