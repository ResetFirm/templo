# El Templo — Prototipo v2

Webapp gamificada para una nueva logia masónica moderna —con **IA como arquitectura**— donde el usuario ingresa al templo como en un **juego de misterio y estrategia para adultos**: un acceso secreto y discreto, un filtro de admisión con pruebas interactivas, y el viaje por los tres grados de la Masonería Azul (Aprendiz, Compañero, Maestro) tallando la propia piedra.

## El viaje

1. **El Umbral** — acceso místico y discreto: la puerta apenas se ve; hay que descubrirla, llamar tres veces y responder bien a la voz que pregunta *¿quién llama?* (los curiosos y los que buscan poder son rechazados con enseñanza).
2. **Cámara de Pruebas (El Filtro del Aspirante)** — cinco sellos con mecánicas de juego:
   - **Sello I — La Tabla del Orden**: *arrastrar y soltar* los pilares del Caballete (ME EDUCO → TRABAJO → AYUDO) en el orden del constructor.
   - **Sello II — Las Voces del Oriente**: *completar* palabras faltantes en frases de Franklin y Goethe.
   - **Sello III — La Lectura de los Símbolos**: *unir* significados con las herramientas (escuadra, compás, nivel, plomada).
   - **Sello IV — La Prueba de la Constancia**: *sostener el cincel* sin soltarlo (mide paciencia; cada interrupción queda registrada).
   - **Sello V — La Propuesta del Aspirante**: nadie entra con las manos vacías — proyecto/idea de valor, talentos que aporta, beneficiarios y compromiso semanal.
3. **El Veredicto** — se calcula un **Índice de Compromiso** (0–100) a partir de reintentos, constancia, profundidad de la propuesta y compromiso declarado. Bajo el umbral, el Templo no abre (puede reintentarse). Sobre el umbral: Sello de Bronce / Plata / Oro y **Expediente del Aspirante** descargable para revisión del Maestro.
4. **Cámara de Reflexión** — testamento del profano (V.I.T.R.I.O.L.).
5. **Tres grados** alineados al Caballete: Aprendiz (*ME EDUCO*), Compañero (*TRABAJO*), Maestro (*AYUDO*) — 3 puertas por grado (enigmas, dilemas simbólicos, reflexiones) y ceremonias de paso con tres golpes rituales y juramentos del Caballete.
6. **La Luz** — culminación, Diario y Expediente completo.

## Mecánicas de juego

- **Puertas y sellos secuenciales** — nada se abre sin lo anterior.
- **Luz (☀)** — puntos por cada reto superado.
- **Voces del Oriente** — coleccionables: cada puerta revela la enseñanza de un masón célebre (Franklin, Goethe, Washington, Voltaire, Bolívar, Mozart, Churchill, Kipling, Fleming).
- **Tabla de Trazar (△ Tabla en el HUD)** — el Caballete del Aprendiz siempre a mano: ME EDUCO / TRABAJO / AYUDO con la IA como infraestructura al centro.
- **Diario del Iniciado** — todas las reflexiones escritas.
- **Expediente del Aspirante** — archivo descargable con métricas, propuesta, diario y voces, pensado para que el Maestro evalúe compromiso y aporte (sin backend en este prototipo).
- **Progreso persistente** en `localStorage`.

## Evaluación para el Maestro (Índice de Compromiso)

Fórmula transparente sobre 100: base 40 + precisión (menos reintentos) + constancia (menos interrupciones del cincel) + profundidad de la propuesta y talentos + compromiso semanal declarado. Umbral de aceptación: 50.

## Ejecutar

Sin build ni dependencias:

```bash
npx serve .        # o
python3 -m http.server 8080
```

Compatible con GitHub Pages.

## Estructura

```
index.html        # shell (HUD, escenas, modales: reto, diario, tabla de trazar)
css/styles.css    # estética noche+oro, puertas, sellos, tablero drag&drop, veredicto
js/data.js        # contenido: umbral, filtro, caballete, voces, grados, ceremonias
js/app.js         # motor: escenas, pruebas interactivas, scoring, expediente, diario
```

## Ideas para v3

- Backend: recepción real de expedientes y panel del Maestro (dashboard de aspirantes).
- Audio ambiental y narración.
- Tokenización/insignias verificables por logro (alineado al modelo Artesanos®).
- Modo mentor IA: acompañamiento socrático durante las reflexiones.
- Analítica del progreso del iniciado (retención, hábito, constancia) como en un LMS.
