function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('TU_SHEET_ID').getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Verificar si ya existe un voto con el mismo UUID
    const existingVotes = sheet.getDataRange().getValues();
    for (let i = 1; i < existingVotes.length; i++) {
      if (existingVotes[i][3] === data.vote_hash) {
        return ContentService.createTextOutput(JSON.stringify({
          result: 'duplicate',
          error: 'Ya has votado desde este dispositivo'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
      }
    }
    
    // Agregar nueva fila: timestamp, nombre, voto, vote_hash
    sheet.appendRow([
      data.timestamp,
      data.nombre,
      data.voto,
      data.vote_hash
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
