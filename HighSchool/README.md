# Landing Artesanos AI High School — Captura de leads

**URL destino:** `https://www.artesanos.ai/HighSchool`
**Archivo:** `index.html` (autocontenido: HTML + CSS + JS en un solo archivo)

## Objetivo
Landing de conversión para la campaña 2026 del Bachillerato Acelerado / Colegio en Casa.
El diferenciador de experiencia de cliente es el **selector de canal de contacto** (chips color lima):
el lead elige cómo quiere ser contactado (WhatsApp, llamada, correo, cita virtual o visita a oficinas)
y el formulario muestra campos adicionales según el canal (horario preferido, fecha de cita, sede).

## Pendientes para desarrollo (buscar `TODO (dev)` en index.html)
1. **Logo oficial:** reemplazar el placeholder `.logo-escudo` por el SVG/PNG del escudo Artesanos.
2. **Endpoint del formulario:** conectar `#form-lead` al CRM (POST). Hoy el envío está simulado con `setTimeout`.
3. **Eventos de conversión:** en el submit exitoso disparar `dataLayer.push({event:'generate_lead', canal:...})` (GTM) y `fbq('track','Lead')` (Meta).
4. **WhatsApp Business:** reemplazar `593999999999` en el botón flotante por el número oficial.
5. **og:image:** agregar el arte de campaña en formato 1200×630.
6. **Sedes:** confirmar direcciones exactas para el select de "visitar oficinas".
7. **Política de privacidad:** confirmar que exista `artesanos.ai/privacidad` (el checkbox de consentimiento enlaza ahí).

## Datos que envía el formulario
| Campo | name | Notas |
|---|---|---|
| Nombre completo | `nombre` | requerido |
| Celular/WhatsApp | `telefono` | requerido |
| Correo | `correo` | requerido |
| Ciudad/Provincia | `ciudad` | opcional |
| Quién estudia | `quien_estudia` | yo / hijo / familiar |
| Programa | `programa` | bachillerato-acelerado / colegio-en-casa / no-seguro |
| Canal preferido | `canal_preferido` | whatsapp / llamada / correo / cita-virtual / visita |
| Horario (condicional) | `horario_preferido` | solo WhatsApp/llamada |
| Cita virtual (condicional) | `fecha_cita`, `horario_cita` | solo cita-virtual |
| Sede (condicional) | `sede_visita` | solo visita |
| Atribución | `utm_source/medium/campaign/content`, `pagina_origen` | se llenan por JS desde la URL |
| Consentimiento | `consentimiento` | requerido (checkbox) |
