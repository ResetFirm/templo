# TURBO PURSUIT — prototipo

Prototipo de juego de carreras arcade inspirado en Need for Speed con estética
retro Nintendo (pseudo-3D de segmentos, estilo SNES "Mode 7" como F-Zero /
Super Mario Kart).

**Cómo jugar:** abre `index.html` en cualquier navegador. No hay dependencias
ni build: todo (motor, gráficos vectoriales, música y efectos chiptune por
WebAudio) va en un único archivo autocontenido.

## Controles

| Acción | Teclas |
|---|---|
| Acelerar / frenar | `↑`/`W` · `↓`/`S` |
| Girar | `←` `→` / `A` `D` |
| Derrape (carga mini-turbo) | `ESPACIO` mantenido |
| Nitro | `SHIFT` |
| Pausa / silencio | `P` · `M` |

En móvil aparecen botones táctiles automáticamente.

## Características

- Motor pseudo-3D propio: proyección de segmentos con curvas, colinas y niebla.
- 3 vueltas contra 5 rivales con IA (trazada, esquiva, banda elástica suave).
- Derrape con mini-turbo de dos niveles (chispas azules → naranjas), nitro con
  medidor y paneles de turbo en la pista.
- Choques con rivales y con el decorado al salirte de la pista.
- HUD completo: velocímetro, posición, vuelta, crono y mejor vuelta.
- Audio 100 % sintetizado: motor ligado a las revoluciones, derrape, nitro,
  cuenta atrás y música chiptune.
