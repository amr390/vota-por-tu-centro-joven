function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('1iCa6u5Bg6JjYZGTQI-jUCr6z6Qp4ZcpLhm4d5TMDknI').getActiveSheet();

    // Obtener datos del formulario
    const timestamp = e.parameter.timestamp;
    const nombre = e.parameter.Nombre;
    const voto = e.parameter.ubicacion;
    const voteHash = e.parameter.vote_hash;

    // Verificar si ya existe un voto con el mismo UUID
    const existingVotes = sheet.getDataRange().getValues();
    for (let i = 1; i < existingVotes.length; i++) {
      if (existingVotes[i][3] === voteHash) {
        return ContentService.createTextOutput(
          JSON.stringify({
            result: 'duplicate',
            error: 'Ya has votado desde este dispositivo',
          }),
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Agregar nueva fila: timestamp, nombre, voto, vote_hash
    sheet.appendRow([timestamp, nombre, voto, voteHash]);

    return ContentService.createTextOutput(
      JSON.stringify({
        result: 'success',
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        result: 'error',
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
