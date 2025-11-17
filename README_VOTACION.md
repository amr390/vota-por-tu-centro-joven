# Sistema de Votación - Centro Joven

Sistema web adaptado para la votación ciudadana sobre la ubicación del nuevo centro joven municipal.

## Archivos del Sistema

- `votacion_centro_joven.html` - Página principal de votación
- `style_votacion.css` - Estilos adaptados para el contexto municipal
- `script_votacion.js` - Lógica de votación con control de voto único
- `apps_script_votacion.js` - Backend en Google Apps Script

## Características

✅ **Control de voto único**: Cada persona solo puede votar una vez
✅ **Validación de identidad**: Usando nombre + últimos 4 dígitos del DNI
✅ **Interfaz responsive**: Funciona en móviles y ordenadores
✅ **Almacenamiento seguro**: Los votos se guardan en Google Sheets
✅ **Prevención de duplicados**: Control tanto local como en servidor

## Configuración

### 1. Configurar Google Apps Script

1. Ve a [script.google.com](https://script.google.com)
2. Crea un nuevo proyecto
3. Copia el contenido de `apps_script_votacion.js`
4. Crea una nueva Google Sheet para almacenar los votos
5. Copia el ID de la hoja de cálculo (está en la URL)
6. Reemplaza `TU_SPREADSHEET_ID_AQUI` en el código
7. Despliega como aplicación web:
   - Implementar > Nueva implementación
   - Tipo: Aplicación web
   - Ejecutar como: Tu cuenta
   - Acceso: Cualquier persona
8. Copia la URL generada

### 2. Configurar el HTML

1. Abre `votacion_centro_joven.html`
2. Busca `TU_WEB_APP_URL_AQUI`
3. Reemplázala con la URL de tu Google Apps Script
4. Personaliza las ubicaciones según tu municipio

### 3. Personalización

Edita estos elementos según tu municipio:

**En el HTML:**
- Título y descripción del proyecto
- Las 3 ubicaciones propuestas (nombres, direcciones, ventajas)
- Información del ayuntamiento en el footer

**En el CSS:**
- Colores corporativos del ayuntamiento
- Logo o escudo municipal (si lo deseas)

## Distribución

### Para WhatsApp
Crea mensajes como:
```
🏛️ VOTACIÓN CENTRO JOVEN

Ayuda a decidir dónde construir nuestro nuevo centro joven.

🗳️ Vota aquí: [TU_URL]

Solo puedes votar una vez. Tu opinión cuenta.

#CentroJoven #Participación
```

### Para la web del ayuntamiento
- Sube los archivos a tu servidor web
- Crea un enlace destacado en la página principal
- Añade una noticia explicando el proceso de votación

## Seguridad

- **Voto único**: Control mediante localStorage + validación en servidor
- **Identificación**: Nombre + últimos 4 dígitos DNI (no se almacena DNI completo)
- **Hash de verificación**: Cada voto genera un hash único para prevenir duplicados
- **Timestamps**: Registro de fecha y hora de cada voto

## Estadísticas

El sistema registra automáticamente:
- Número total de votos
- Votos por cada ubicación
- Comentarios de los ciudadanos
- Fechas y horas de votación

## Soporte Técnico

Para modificaciones o problemas técnicos:
1. Verifica que la URL de Google Apps Script esté correcta
2. Comprueba que la hoja de cálculo tenga permisos de escritura
3. Revisa la consola del navegador para errores JavaScript
4. Asegúrate de que el ID de la hoja de cálculo sea correcto

## Consideraciones Legales

- Esta votación es **consultiva** y forma parte del proceso de participación ciudadana
- Los datos se almacenan de forma anónima (solo últimos 4 dígitos del DNI)
- Cumple con la normativa de protección de datos para consultas públicas
- Se recomienda informar sobre el proceso en el BOP o web municipal
