// Google Apps Script para manejar la votación del Centro Joven
// Este código debe copiarse en script.google.com y desplegarse como aplicación web

function doPost(e) {
  try {
    // Obtener parámetros del formulario
    const nombre = e.parameter.nombre;
    const dni = e.parameter.dni;
    const ubicacion = e.parameter.ubicacion;
    const comentarios = e.parameter.comentarios || '';
    const voteHash = e.parameter.vote_hash;
    const timestamp = e.parameter.timestamp;

    // Validar datos requeridos
    if (!nombre || !dni || !ubicacion || !voteHash) {
      return ContentService.createTextOutput(
        JSON.stringify({
          result: 'error',
          error: 'Faltan datos requeridos',
        }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Abrir la hoja de cálculo (reemplaza con tu ID de Google Sheets)
    const spreadsheetId =
      'https://script.google.com/macros/s/AKfycbwAAC7VqTso7rA-RcJTIJ4ztnOaRx7J3gM8Bo5LvOpxMASqoXrGK2ghpzDtetoe7YDgQQ/exec';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();

    // Verificar si ya existe un voto con el mismo hash
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      // Empezar desde 1 para saltar headers
      if (data[i][5] === voteHash) {
        // Columna F contiene el hash
        return ContentService.createTextOutput(
          JSON.stringify({
            result: 'duplicate',
            error: 'Ya existe un voto registrado con estos datos',
          }),
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Si es la primera fila, agregar headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Nombre',
        'DNI (últimos 4)',
        'Ubicación Elegida',
        'Comentarios',
        'Hash de Voto',
        'Fecha Registro',
      ]);
    }

    // Agregar el nuevo voto
    sheet.appendRow([new Date(), nombre, dni, ubicacion, comentarios, voteHash, timestamp]);

    // Respuesta exitosa
    return ContentService.createTextOutput(
      JSON.stringify({
        result: 'success',
        message: 'Voto registrado correctamente',
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Manejar errores
    console.error('Error en doPost:', error);
    return ContentService.createTextOutput(
      JSON.stringify({
        result: 'error',
        error: 'Error interno del servidor: ' + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para obtener estadísticas de votación (opcional)
function getVotingStats() {
  try {
    const spreadsheetId = 'TU_SPREADSHEET_ID_AQUI';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();

    const data = sheet.getDataRange().getValues();
    const stats = {
      'Centro Histórico': 0,
      'Zona Deportiva': 0,
      'Parque Norte': 0,
      total: 0,
    };

    // Contar votos (empezar desde 1 para saltar headers)
    for (let i = 1; i < data.length; i++) {
      const ubicacion = data[i][3]; // Columna D contiene la ubicación
      if (stats.hasOwnProperty(ubicacion)) {
        stats[ubicacion]++;
        stats.total++;
      }
    }

    return stats;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return null;
  }
}

// Función para configurar la aplicación web (ejecutar una vez)
function setupWebApp() {
  console.log('Para configurar la aplicación web:');
  console.log('1. Ve a Implementar > Nueva implementación');
  console.log('2. Selecciona "Aplicación web"');
  console.log('3. Ejecutar como: Tu cuenta');
  console.log('4. Acceso: Cualquier persona');
  console.log('5. Copia la URL generada y úsala en el HTML');
}
