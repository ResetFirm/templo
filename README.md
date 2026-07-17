# Alborada · Residencia para Mayores

Una página web narrativa e interactiva para una residencia de adultos mayores.
No es una página tradicional: es una experiencia diseñada para transmitir
**seguridad y confianza** desde el primer gesto.

## La experiencia

1. **La puerta** — El sitio abre con la puerta de la casa. El visitante debe
   *tocarla tres veces* (o arrastrarla) para que se abra: la primera
   interacción es un acto de llegada, con sonido de golpe (Web Audio),
   la aldaba que se mueve y una luz cálida que se enciende dentro.
2. **La bienvenida** — Al abrirse la puerta, un mensaje recibe al visitante:
   *"Pasa. Te estábamos esperando."*
3. **El mapa** — La residencia se recorre como un plano vivo ilustrado en SVG:
   se arrastra para pasear, se hace zoom (rueda, pellizco o botones) y cada
   espacio tiene un punto pulsante que abre su historia — El Umbral, las
   Habitaciones, La Mesa Grande, el Salón de la Memoria, el Patio de la
   Fuente, Bienestar y Salud, la Sala de Familias y el Huerto.

## Características

- **Un solo archivo**: `index.html` autocontenido (HTML + CSS + JS, sin dependencias ni build).
- **Accesible**: navegable por teclado (Enter/Espacio tocan la puerta y abren
  los espacios), `aria-labels`, `aria-live` y soporte de `prefers-reduced-motion`.
- **Responsivo**: en móvil el panel de historias sube desde abajo y el mapa
  soporta gestos táctiles (arrastre y pellizco).
- **Sin assets externos**: sonidos generados con Web Audio, ilustraciones en
  SVG inline; solo se cargan las tipografías de Google Fonts.

## Uso

Abrir `index.html` en cualquier navegador moderno. No requiere servidor.

> Los datos de contacto del sitio son de ejemplo y deben reemplazarse por los reales.
