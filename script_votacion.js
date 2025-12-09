document.addEventListener('DOMContentLoaded', () => {
    const votingForm = document.getElementById('voting-form');
    const formMessage = document.getElementById('form-message');
    const alreadyVotedSection = document.getElementById('already-voted');
    const votingFormContainer = document.getElementById('voting-form-container');

    // Verificar si el usuario ya ha votado
    function checkIfAlreadyVoted() {
        const hasVoted = localStorage.getItem('centro_joven_voted');
        if (hasVoted === 'true') {
            showAlreadyVoted();
            return true;
        }
        return false;
    }

    // Mostrar mensaje de ya votado
    function showAlreadyVoted() {
        alreadyVotedSection.style.display = 'block';
        votingFormContainer.style.display = 'none';
    }

    // Marcar como votado
    function markAsVoted() {
        localStorage.setItem('centro_joven_voted', 'true');
        localStorage.setItem('centro_joven_vote_date', new Date().toISOString());
    }

    // Generar hash simple para identificación
    function generateVoteHash(nombre, dni) {
        const data = nombre.toLowerCase().trim() + dni.trim();
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit integer
        }
        return Math.abs(hash).toString();
    }

    // Verificar al cargar la página
    checkIfAlreadyVoted();

    // Manejar envío del formulario
    if (votingForm) {
        votingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Verificar nuevamente antes de enviar
            if (checkIfAlreadyVoted()) {
                return;
            }

            formMessage.textContent = 'Enviando tu voto...';
            formMessage.className = 'form-message';

            const formData = new FormData(this);
            
            // Agregar hash de identificación
            const nombre = formData.get('nombre');
            const dni = formData.get('dni');
            const voteHash = generateVoteHash(nombre, dni);
            formData.append('vote_hash', voteHash);
            formData.append('timestamp', new Date().toISOString());

            // Enviar datos
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { 
                        throw new Error(`Error HTTP! Estado: ${response.status} - ${text}`); 
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.result === 'success') {
                    formMessage.textContent = '¡Tu voto ha sido registrado correctamente! Gracias por participar.';
                    formMessage.className = 'form-message success';
                    
                    // Marcar como votado y ocultar formulario
                    markAsVoted();
                    setTimeout(() => {
                        showAlreadyVoted();
                    }, 2000);
                    
                } else if (data.result === 'duplicate') {
                    formMessage.textContent = 'Ya existe un voto registrado con estos datos. Solo se permite un voto por persona.';
                    formMessage.className = 'form-message error';
                    markAsVoted(); // Marcar localmente también
                } else {
                    formMessage.textContent = 'Error al registrar el voto: ' + (data.error || 'Error desconocido');
                    formMessage.className = 'form-message error';
                }
            })
            .catch(error => {
                console.error('Error durante el envío:', error);
                formMessage.textContent = 'Error de conexión. Por favor, inténtalo de nuevo más tarde.';
                formMessage.className = 'form-message error';
            });
        });
    }

    // Validación del DNI en tiempo real
    const dniInput = document.getElementById('dni');
    if (dniInput) {
        dniInput.addEventListener('input', function(e) {
            // Solo permitir números
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Limitar a 4 dígitos
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
        });
    }

    // Smooth scroll para el botón "Votar Ahora"
    const voteButton = document.querySelector('a[href="#votacion"]');
    if (voteButton) {
        voteButton.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('votacion').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Hacer clickeables los divs de ubicaciones
    const locationItems = document.querySelectorAll('.location-item');
    const nombreUsuario = document.getElementById('nombre-usuario');
    
    locationItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const nombre = nombreUsuario.value.trim();
            
            if (!nombre) {
                alert('Por favor, escribe tu nombre antes de votar');
                nombreUsuario.focus();
                return;
            }
            
            if (checkIfAlreadyVoted()) {
                return;
            }
            
            locationItems.forEach(loc => loc.classList.remove('selected'));
            this.classList.add('selected');
            
            const ubicaciones = ['Centro Histórico', 'Zona Deportiva', 'Parque Norte'];
            const ubicacionSeleccionada = ubicaciones[index];
            
            enviarVoto(nombre, ubicacionSeleccionada);
        });
    });
    
    function enviarVoto(nombre, ubicacion) {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('ubicacion', ubicacion);
        formData.append('timestamp', new Date().toISOString());
        
        const votingForm = document.getElementById('voting-form');
        const url = votingForm ? votingForm.action : 'TU_WEB_APP_URL_AQUI';
        
        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                alert('¡Tu voto ha sido registrado correctamente! Gracias por participar.');
                markAsVoted();
                nombreUsuario.disabled = true;
            } else if (data.result === 'duplicate') {
                alert('Ya existe un voto registrado con estos datos.');
                markAsVoted();
            } else {
                alert('Error al registrar el voto: ' + (data.error || 'Error desconocido'));
            }
        })
        .catch(error => {
            console.error('Error durante el envío:', error);
            alert('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
        });
    }
});
