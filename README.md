# Aurea Apartments — Atelier

Mismo formulario y condiciones, con diseño editorial refinado, selección rápida de fecha y resumen de la visita.

## GitHub Pages
Sube todo el contenido de este ZIP a la raíz del repositorio: `index.html`, `app.js`, `styles.css`, `atelier.css`, `.nojekyll` y `assets/`. Activa GitHub Pages desde la rama y carpeta raíz habituales.

## EmailJS: actualizar antes de usar
Mantiene tu Service ID y Template ID. Instala la nueva plantilla del ZIP de EmailJS con las instrucciones de ese paquete. En el panel:

- Subject: `{{subject}}`
- To Email: `{{to_email}}`
- From Name: Aurea Apartments
- From Email: Use Default Email Address, activado
- Reply To: `{{reply_to}}`
- Cc y Bcc vacíos
- Auto-Reply desactivado para evitar un correo adicional: esta web ya realiza ambos envíos.

El correo administrativo se conserva únicamente en la configuración técnica de app.js; no aparece en los textos ni hay enlaces mailto. Una web cliente no puede ocultar su configuración a quien inspeccione el código.

El formulario no procesa pagos ni reserva horarios automáticamente. Conserva el depósito de $170 y sus condiciones. El botón de WhatsApp comparte un mensaje después de enviar; no tiene un número de asesor configurado. Las pruebas de correo se realizan con EmailJS simulado.

La imagen es ambiental y no representa una propiedad ofertada. Fotografía de Andy Bob / hioozlight en Unsplash, conservada de la versión anterior:
https://unsplash.com/photos/modern-living-room-with-beige-sofa-and-contemporary-lamp-e29s9vkVUIg
https://unsplash.com/license

Logo e imágenes de métodos conservados del proyecto original.

Validación: formulario completo y errores de envío con EmailJS simulado; variables de las dos copias verificadas contra la nueva plantilla; pantallas de 320, 390, 768, 1440 y 1920 píxeles. Ningún correo real enviado durante las pruebas.
