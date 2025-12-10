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

  // Verificar al cargar la página
  checkIfAlreadyVoted();

  // Manejar envío del formulario
  if (votingForm) {
    votingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Verificar nuevamente antes de enviar
      if (checkIfAlreadyVoted()) {
        return;
      }

      formMessage.textContent = 'Enviando tu voto...';
      formMessage.className = 'form-message';

      const formData = new FormData(this);

      // Crear hash único con UUID
      const nombre = formData.get('Nombre');
      const voto = formData.get('ubicacion');
      const voteHash = getOrCreateUUID();
      
      // Crear objeto con los datos para Google Sheets
      const voteData = {
        timestamp: new Date().toISOString(),
        nombre: nombre,
        voto: voto,
        vote_hash: voteHash
      };

      // Enviar datos como JSON
      fetch(this.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
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
            formMessage.textContent =
              'Ya existe un voto registrado con estos datos. Solo se permite un voto por persona.';
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

  // Smooth scroll para el botón "Votar Ahora"
  const voteButton = document.querySelector('a[href="#votacion"]');
  if (voteButton) {
    voteButton.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('votacion').scrollIntoView({
        behavior: 'smooth',
      });
    });
  }

  // Hacer clickeables los divs de ubicaciones
  const locationItems = document.querySelectorAll('.location-item');
  const nombreUsuario = document.getElementById('nombre-usuario');

  locationItems.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function () {
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
    const voteData = {
      timestamp: new Date().toISOString(),
      nombre: nombre,
      voto: ubicacion,
      vote_hash: getOrCreateUUID()
    };

    const votingForm = document.getElementById('voting-form');
    const url = votingForm ? votingForm.action : 'TU_WEB_APP_URL_AQUI';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteData),
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
