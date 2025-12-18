document.addEventListener('DOMContentLoaded', () => {
  const votingForm = document.getElementById('voting-form');
  const alreadyVotedSection = document.getElementById('already-voted');
  const votingFormContainer = document.getElementById('voting-form-container');

  // Función para mostrar toast
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Generar o recuperar UUID único
  function getOrCreateUUID() {
    let uuid = localStorage.getItem('centro_joven_uuid');
    if (!uuid) {
      uuid = 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      localStorage.setItem('centro_joven_uuid', uuid);
    }
    return uuid;
  }

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
    showToast('Ya has votado anteriormente', 'warning');
  }

  // Verificar al cargar la página
  checkIfAlreadyVoted();

  // Hacer clickeables los botones de votación
  const voteButtons = document.querySelectorAll('.vote-button');
  const nombreUsuario = document.getElementById('nombre-usuario');

  voteButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      
      const nombre = nombreUsuario.value.trim();

      if (!nombre) {
        alert('Por favor, escribe tu nombre antes de votar');
        nombreUsuario.focus();
        return;
      }

      if (checkIfAlreadyVoted()) {
        showToast('Ya has votado anteriormente', 'warning');
        return;
      }

      const optionIndex = parseInt(this.getAttribute('data-option'));
      const ubicaciones = ['Centro Histórico', 'Zona Deportiva', 'Parque Norte'];
      const ubicacionSeleccionada = ubicaciones[optionIndex];

      // Marcar visualmente la selección
      const locationItems = document.querySelectorAll('.location-item');
      locationItems.forEach(loc => loc.classList.remove('selected'));
      this.closest('.location-item').classList.add('selected');

      enviarVoto(nombre, ubicacionSeleccionada);
    });
  });

  function enviarVoto(nombre, ubicacion) {
    // Llenar el formulario automáticamente
    document.getElementById('Nombre').value = nombre;
    document.getElementById('timestamp').value = new Date().toISOString();
    document.getElementById('vote_hash').value = getOrCreateUUID();
    
    // Seleccionar la opción correcta
    const radioButtons = document.querySelectorAll('input[name="ubicacion"]');
    radioButtons.forEach(radio => {
      if (radio.value === ubicacion) {
        radio.checked = true;
      }
    });

    // Marcar como votado y enviar formulario
    localStorage.setItem('centro_joven_voted', 'true');
    localStorage.setItem('centro_joven_vote_date', new Date().toISOString());
    
    // Mostrar toast de agradecimiento
    showToast('¡Gracias por votar!', 'success');
    
    // Enviar formulario después de un breve delay
    setTimeout(() => {
      votingForm.submit();
    }, 1000);
  }

  // Llenar campos ocultos antes del envío
  if (votingForm) {
    votingForm.addEventListener('submit', function (e) {
      if (checkIfAlreadyVoted()) {
        e.preventDefault();
        return;
      }

      // Llenar campos ocultos
      document.getElementById('timestamp').value = new Date().toISOString();
      document.getElementById('vote_hash').value = getOrCreateUUID();
      
      // Marcar como votado
      localStorage.setItem('centro_joven_voted', 'true');
      localStorage.setItem('centro_joven_vote_date', new Date().toISOString());
    });
  }
});
