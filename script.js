document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Contador de Tiempo ---
    const countdownElement = document.getElementById('countdown');
    const weddingDate = new Date("October 26, 2025 18:00:00").getTime(); // 26 de Octubre de 2025, 18:00:00

    if (countdownElement) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "¡El gran día ha llegado!";
                clearInterval(countdownInterval);
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Llamar una vez al inicio para evitar el parpadeo
    }

    // --- Fin de la Lógica del Contador de Tiempo ---


    // --- Lógica de Envío del Formulario de Confirmación (RSVP) ---
    const customRsvpForm = document.getElementById('rsvp-form-custom');
    const formMessage = document.getElementById('form-message');

    if (customRsvpForm) {
        customRsvpForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío de formulario por defecto (evita la recarga de la página)

            formMessage.textContent = 'Enviando tu confirmación...';
            formMessage.className = 'form-message'; // Reiniciar la clase para eliminar estilos de éxito/error anteriores

            // FormData recolecta automáticamente todos los campos del formulario
            const formData = new FormData(this);

            // Fetch API para enviar los datos al Apps Script
            fetch(this.action, { // 'this.action' es la URL de tu aplicación web de Google Apps Script
                method: 'POST',
                body: formData // Los datos se envían como multipart/form-data, que Apps Script puede leer con e.parameter
            })
            .then(response => {
                // Verificar si la respuesta HTTP fue exitosa
                if (!response.ok) {
                    // Si la respuesta no es OK (ej. 404, 500), intentar leer el error del cuerpo
                    return response.text().then(text => { throw new Error(`Error HTTP! Estado: ${response.status} - ${text}`); });
                }
                return response.json(); // Intentar parsear la respuesta como JSON
            })
            .then(data => {
                // Manejar la respuesta del Apps Script
                if (data.result === 'success') {
                    formMessage.textContent = '¡Gracias por confirmar tu asistencia!';
                    formMessage.className = 'form-message success'; // Añadir clase para estilos de éxito
                    customRsvpForm.reset(); // Limpiar el formulario después del envío exitoso
                } else {
                    formMessage.textContent = 'Hubo un error al enviar tu confirmación: ' + (data.error || 'Error desconocido del servidor.');
                    formMessage.className = 'form-message error'; // Añadir clase para estilos de error
                    console.error('Error del servidor de Apps Script:', data.error);
                }
            })
            .catch(error => {
                // Manejar errores de red o errores lanzados en el .then()
                console.error('Error durante el envío del formulario:', error);
                formMessage.textContent = 'Ocurrió un error en la red o el servidor. Por favor, inténtalo de nuevo más tarde.';
                formMessage.className = 'form-message error'; // Añadir clase para estilos de error
            });
        });
    }
});