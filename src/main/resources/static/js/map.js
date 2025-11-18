// ========================================
// MAP.JS - Funcionalidades do Mapa
// ========================================

let map;
let markers = [];
let userMarker;

document.addEventListener('DOMContentLoaded', () => {
    initMainMap();
});

// Inicializar mapa principal
function initMainMap() {
    const mapElement = document.getElementById('mainMap');
    if (!mapElement) return;
    
    // Coordenadas iniciais (São Paulo)
    const initialCoords = [-23.5505, -46.6333];
    
    // Criar mapa
    map = L.map('mainMap').setView(initialCoords, 12);
    
    // Adicionar camada de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Adicionar marcador do usuário
    addUserMarker(initialCoords);
    
    // Adicionar marcadores de empresas, cooperativas e pontos
    addMarkers();
    
    // Tentar obter localização do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                updateUserLocation(userCoords);
            },
            error => {
                console.log('Não foi possível obter a localização:', error);
            }
        );
    }
}

// Adicionar marcador do usuário
function addUserMarker(coords) {
    const userIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-icon marker-user"><i class="fas fa-user"></i></div>',
        iconSize: [40, 40]
    });
    
    userMarker = L.marker(coords, { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Você está aqui</b>');
}

// Atualizar localização do usuário
function updateUserLocation(coords) {
    if (userMarker) {
        userMarker.setLatLng(coords);
        map.setView(coords, 13);
    }
}

// Adicionar marcadores
function addMarkers() {
    const locations = [
        // Empresas
        {
            id: 1,
            name: 'EcoRecicla Ltda',
            type: 'empresa',
            coords: [-23.5880, -46.6320],
            address: 'Rua das Flores, 123 - Vila Mariana',
            materials: ['Plástico', 'Metal', 'Papel'],
            phone: '(11) 3000-1111',
            rating: 4.8,
            distance: '2.5 km'
        },
        {
            id: 2,
            name: 'Reciclagem Paulista',
            type: 'empresa',
            coords: [-23.5950, -46.6100],
            address: 'R. dos Trabalhadores, 789 - Ipiranga',
            materials: ['Papelão', 'Vidro'],
            phone: '(11) 3000-2222',
            rating: 4.5,
            distance: '3.7 km'
        },
        {
            id: 3,
            name: 'MetalCoop',
            type: 'empresa',
            coords: [-23.4630, -46.5330],
            address: 'Av. das Nações, 1000 - Guarulhos',
            materials: ['Alumínio', 'Cobre', 'Ferro'],
            phone: '(11) 3000-3333',
            rating: 4.9,
            distance: '12.5 km'
        },
        {
            id: 4,
            name: 'PlastiRecicla',
            type: 'empresa',
            coords: [-23.5505, -46.6333],
            address: 'Av. Paulista, 2500 - Cerqueira César',
            materials: ['PET', 'PEAD', 'PVC'],
            phone: '(11) 3000-4444',
            rating: 4.7,
            distance: '6.9 km'
        },
        
        // Cooperativas
        {
            id: 5,
            name: 'CoopRecicla ABC',
            type: 'cooperativa',
            coords: [-23.6680, -46.5350],
            address: 'Av. Industrial, 456 - Santo André',
            catadores: 25,
            phone: '(11) 4000-1111',
            rating: 4.8,
            distance: '4.2 km'
        },
        {
            id: 6,
            name: 'Coop Reciclar',
            type: 'cooperativa',
            coords: [-23.6180, -46.5550],
            address: 'Rua da Cooperativa, 350 - São Caetano',
            catadores: 40,
            phone: '(11) 4000-2222',
            rating: 4.9,
            distance: '8.1 km'
        },
        
        // Pontos de Coleta
        {
            id: 7,
            name: 'Ecoponto Mooca',
            type: 'ponto',
            coords: [-23.5980, -46.5980],
            address: 'Praça da Mooca, s/n - Mooca',
            horario: 'Seg-Sáb: 8h-17h',
            phone: '156',
            distance: '1.8 km'
        },
        {
            id: 8,
            name: 'Ecoponto Tatuapé',
            type: 'ponto',
            coords: [-23.5450, -46.5750],
            address: 'Rua Tuiuti, 2500 - Tatuapé',
            horario: '24 horas',
            phone: '156',
            distance: '5.3 km'
        }
    ];
    
    locations.forEach(location => {
        addMarker(location);
    });
}

// Adicionar marcador individual
function addMarker(location) {
    let iconClass, iconSymbol, color;
    
    switch(location.type) {
        case 'empresa':
            iconSymbol = 'fa-building';
            color = '#667eea';
            break;
        case 'cooperativa':
            iconSymbol = 'fa-users';
            color = '#f093fb';
            break;
        case 'ponto':
            iconSymbol = 'fa-recycle';
            color = '#43e97b';
            break;
    }
    
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-icon marker-${location.type}"><i class="fas ${iconSymbol}"></i></div>`,
        iconSize: [40, 40]
    });
    
    const marker = L.marker(location.coords, { icon: icon })
        .addTo(map)
        .bindPopup(createPopupContent(location));
    
    marker.locationData = location;
    markers.push(marker);
}

// Criar conteúdo do popup
function createPopupContent(location) {
    let content = `
        <div class="map-popup">
            <h3>${location.name}</h3>
            <p class="popup-address"><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
            <p class="popup-distance"><i class="fas fa-route"></i> ${location.distance}</p>
    `;
    
    if (location.type === 'empresa') {
        content += `
            <div class="popup-materials">
                ${location.materials.map(m => `<span class="material-tag">${m}</span>`).join('')}
            </div>
            <p class="popup-rating"><i class="fas fa-star"></i> ${location.rating}</p>
            <p class="popup-phone"><i class="fas fa-phone"></i> ${location.phone}</p>
        `;
    } else if (location.type === 'cooperativa') {
        content += `
            <p class="popup-info"><i class="fas fa-users"></i> ${location.catadores} catadores</p>
            <p class="popup-rating"><i class="fas fa-star"></i> ${location.rating}</p>
            <p class="popup-phone"><i class="fas fa-phone"></i> ${location.phone}</p>
        `;
    } else if (location.type === 'ponto') {
        content += `
            <p class="popup-info"><i class="fas fa-clock"></i> ${location.horario}</p>
            <p class="popup-phone"><i class="fas fa-phone"></i> ${location.phone}</p>
        `;
    }
    
    content += `
            <div class="popup-actions">
                <button class="btn btn-primary btn-sm" onclick="openContact(${location.id})">
                    <i class="fas fa-phone"></i> Contato
                </button>
                <button class="btn btn-secondary btn-sm" onclick="getDirections(${location.coords[0]}, ${location.coords[1]})">
                    <i class="fas fa-directions"></i> Rota
                </button>
            </div>
        </div>
    `;
    
    return content;
}

// Filtrar mapa
function filterMap(type) {
    markers.forEach(marker => {
        if (marker.locationData.type === type || type === 'all') {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}

// Filtrar por material
function filterByMaterial() {
    const materialFilter = document.getElementById('materialFilter').value;
    
    markers.forEach(marker => {
        if (materialFilter === 'todos') {
            marker.addTo(map);
        } else {
            if (marker.locationData.type === 'empresa') {
                const materials = marker.locationData.materials.map(m => m.toLowerCase());
                if (materials.some(m => m.includes(materialFilter.toLowerCase()))) {
                    marker.addTo(map);
                } else {
                    map.removeLayer(marker);
                }
            } else {
                map.removeLayer(marker);
            }
        }
    });
}

// Filtrar por distância
function filterByDistance() {
    const distanceFilter = document.getElementById('distanceFilter').value;
    
    if (distanceFilter === 'all') {
        markers.forEach(marker => marker.addTo(map));
        return;
    }
    
    const maxDistance = parseInt(distanceFilter);
    
    markers.forEach(marker => {
        const distance = parseFloat(marker.locationData.distance);
        if (distance <= maxDistance) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}

// Centralizar no usuário
function centerMap() {
    if (userMarker) {
        const coords = userMarker.getLatLng();
        map.setView(coords, 13);
        userMarker.openPopup();
    } else {
        showToast('Localização não disponível', 'error');
    }
}

// Ver no mapa
function viewOnMap(lat, lng) {
    map.setView([lat, lng], 15);
    
    // Encontrar e abrir popup do marcador
    markers.forEach(marker => {
        const markerCoords = marker.getLatLng();
        if (markerCoords.lat === lat && markerCoords.lng === lng) {
            marker.openPopup();
        }
    });
}

// Abrir contato
function openContact(locationId) {
    const location = markers.find(m => m.locationData.id === locationId).locationData;
    
    // Criar modal de contato
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-phone"></i> Entrar em Contato</h3>
                <button onclick="this.closest('.contact-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <h4>${location.name}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
                <p><i class="fas fa-phone"></i> ${location.phone}</p>
                
                <form id="contactForm" onsubmit="sendMessage(event, ${locationId})">
                    <div class="form-group">
                        <label>Mensagem</label>
                        <textarea rows="4" placeholder="Descreva sua proposta ou dúvida..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Enviar Mensagem
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Estilos do modal
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .contact-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #2c3e50;
        }
        
        .modal-header button {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            color: #6c757d;
            cursor: pointer;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-body h4 {
            margin-bottom: 15px;
            color: #2c3e50;
        }
        
        .modal-body p {
            color: #6c757d;
            margin-bottom: 10px;
        }
        
        .modal-body form {
            margin-top: 20px;
        }
        
        .modal-body textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-family: inherit;
            resize: vertical;
        }
        
        .map-popup {
            min-width: 250px;
        }
        
        .map-popup h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 1.1rem;
        }
        
        .map-popup p {
            margin: 5px 0;
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .popup-materials {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 10px 0;
        }
        
        .popup-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
    `;
    document.head.appendChild(modalStyles);
}

// Enviar mensagem
function sendMessage(event, locationId) {
    event.preventDefault();
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showToast('Mensagem enviada com sucesso!', 'success');
        document.querySelector('.contact-modal').remove();
    }, 1500);
}

// Obter direções
function getDirections(lat, lng) {
    // Abrir Google Maps com direções
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// Exportar funções
window.filterMap = filterMap;
window.filterByMaterial = filterByMaterial;
window.filterByDistance = filterByDistance;
window.centerMap = centerMap;
window.viewOnMap = viewOnMap;
window.openContact = openContact;
window.sendMessage = sendMessage;
window.getDirections = getDirections;
