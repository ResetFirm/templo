# El Templo · Logia Kaizen — Prototipo v3

Templo digital de una **logia de Masonería Liberal de vanguardia** (libertad absoluta de conciencia, síntesis del Rito Escocés Antiguo y Aceptado y del Rito Francés), diseñado como un **LMS gamificado con estimulación neuronal** — el **Método Kaizen** de Esteban Castillo: neurociencias + academia + mejora continua. El rito es el plan de estudios; el objetivo, guiar el desarrollo del miembro y conectar a millones de masones debidamente probados en la red fraternal más grande del planeta.

## El viaje

1. **El Umbral** — acceso místico y discreto: puerta oculta, tres golpes, y la voz que rechaza a curiosos y buscadores de poder.
2. **Cámara de Pruebas (Filtro del Aspirante)** — cinco sellos interactivos: ordenar el Caballete (drag & drop), completar frases de masones célebres, unir símbolos, sostener el cincel (constancia) y presentar **La Propuesta** (nadie entra con las manos vacías).
3. **El Veredicto** — Índice de Compromiso 0–100, sellos Bronce/Plata/Oro y **Expediente del Aspirante** descargable para el Maestro.
4. **Cámara de Reflexión** — testamento del profano (V.I.T.R.I.O.L.).
5. **Apertura de los Trabajos** — declaración liberal: el miembro elige su bóveda (*Gran Arquitecto*, *Humanidad y Conciencia*, o ambas). Nadie decide por él.
6. **El Sendero de los 33 Grados** — el rito como plan de estudios (LMS):

   | Cámara | Grados | Enfoque |
   |---|---|---|
   | Masonería Azul | 1–3 | Fundación compartida con todos los masones (jugable completa: 9 puertas + 3 ceremonias) |
   | Logia de Perfección | 4–14 | Enfoque, lealtad, deber y justicia |
   | Capítulo Rosa Cruz | 15–18 | Tolerancia y amor fraternal |
   | Consejo Kadosh | 19–30 | Lucha simbólica contra la tiranía y el fanatismo |
   | Supremo Consejo | 31–33 | Grados administrativos y síntesis filosófica |

   Cada cámara es un **módulo LMS**: descripción, objetivos de aprendizaje, nota de neurociencia aplicada, listado de grados y una **lección insignia jugable** (dilema del Preboste, mesa de los contrarios, enigma del fanatismo, síntesis del 33). Completarla otorga insignia y título (Gran Elegido 14°, Príncipe Rosacruz 18°, Caballero Kadosh 30°, Inspector General 33°).
7. **La Cumbre · 33°** — perfil de miembro (nombre, título, bóveda, insignias, estadísticas) y visión de la **Red Global**.

## Estimulación neuronal (Método Kaizen)

- **🧠 Gimnasio Neuronal** (HUD) — repaso por *recuperación activa*: series de 3 preguntas sobre símbolos, rito y caballete, con racha registrada. La técnica de aprendizaje con más evidencia en neurociencia cognitiva.
- **Notas de neurociencia por módulo** — cada cámara explica qué capacidad entrena (memoria episódica, control ejecutivo, empatía cognitiva, metacognición, efecto protegé).
- **Gamificación estructural** — Luz (XP), insignias por cámara, coleccionables (9 Voces del Oriente), progreso visible por módulo, desbloqueo secuencial.

## Herramientas del miembro

- **△ Tabla de Trazar** — el Caballete Kaizen (ME EDUCO / TRABAJO / AYUDO, IA como infraestructura).
- **✎ Diario del Iniciado** — reflexiones y voces coleccionadas.
- **Expediente completo** — descargable en cualquier momento: métricas del filtro, propuesta, bóveda, grado alcanzado, insignias, diario.
- **Progreso persistente** en `localStorage`.

## Ejecutar

Sin build ni dependencias:

```bash
npx serve .        # o
python3 -m http.server 8080
```

Compatible con GitHub Pages.

## Estructura

```
index.html        # shell (HUD, escenas, modales: reto, diario, tabla, gimnasio)
css/styles.css    # estética noche+oro, sendero LMS, tarjetas de cámara, perfil
js/data.js        # contenido: umbral, filtro, apertura liberal, 5 cuerpos del rito,
                  #   lecciones insignia, gimnasio neuronal, voces, grados azules
js/app.js         # motor: escenas, pruebas, lecciones, scoring, gimnasio, perfil
```

## Ideas para v4

- Backend: cuentas, recepción de expedientes, panel del Maestro y **Red Global real** (directorio de perfiles verificados, mentorías entre grados, triángulos por ciudad).
- Repaso espaciado con calendario (algoritmo SM-2) y notificaciones.
- Mentor IA socrático durante lecciones y reflexiones.
- Contenido completo por grado (33 lecciones) con rúbricas académicas.
- Insignias verificables (Open Badges / tokenización, alineado al modelo Artesanos®).
