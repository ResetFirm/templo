# El Templo — Prototipo v1

Webapp gamificada para una nueva logia masónica: el usuario **ingresa al templo como si entrara a un videojuego** y avanza por los tres grados de la Masonería Azul (Simbólica) — **Aprendiz, Compañero y Maestro** — superando retos de pensamiento y reflexión que abren puertas y guían su desarrollo personal.

## El viaje

1. **El Portal** — llamada a la puerta del Templo.
2. **El Vestíbulo** — el buscador elige su *nombre simbólico*.
3. **Cámara de Reflexión** — antes de iniciar, escribe su *testamento del profano* (V.I.T.R.I.O.L.).
4. **Cámara del Norte (Aprendiz ▦)** — trabajo sobre la piedra bruta: 3 puertas.
5. **Ceremonia de Paso** — tres golpes rituales + juramento.
6. **Cámara del Mediodía (Compañero ✶)** — la letra G, los cinco sentidos, el salario: 3 puertas.
7. **Ceremonia de Exaltación** — tres golpes + juramento.
8. **Cámara del Medio (Maestro ☉)** — la leyenda de Hiram, la acacia, el legado: 3 puertas.
9. **La Luz** — culminación del viaje y acceso al Diario.

## Mecánicas de juego

- **Puertas secuenciales**: cada puerta se desbloquea al abrir la anterior; cada grado, al completar el anterior.
- **Tres tipos de reto**:
  - ⚿ **Enigma** — pregunta simbólica con respuesta (coincidencia flexible, con pistas tras dos intentos).
  - ✎ **Reflexión** — escritura libre con mínimo de caracteres; se guarda en el *Diario del Iniciado*.
  - ⚖ **Dilema simbólico** — elección sin respuesta errónea; cada opción entrega una enseñanza distinta.
- **Luz (☀)** — puntos que se acumulan al superar cada reto.
- **Diario del Iniciado** — repositorio personal de todas las reflexiones escritas.
- **Progreso persistente** — guardado en `localStorage`; el Templo "recuerda" al visitante.

## Ejecutar

No requiere build ni dependencias. Basta un servidor estático:

```bash
# opción 1
npx serve .

# opción 2
python3 -m http.server 8080
```

Y abrir `http://localhost:8080`. También funciona publicándolo directamente en GitHub Pages.

## Estructura

```
index.html        # shell de la app (HUD, escenas, modales)
css/styles.css    # estética: noche profunda + oro, puertas, piso ajedrezado
js/data.js        # contenido ritual: grados, puertas, retos, ceremonias
js/app.js         # motor: máquina de escenas, retos, luz, diario, persistencia
```

## Ideas para v2

- Audio ambiental y efectos (golpes, apertura de puertas).
- Más puertas por grado y retos de tipo "ordenar símbolos" o "trazado de logia".
- Cuentas de usuario y sincronización del Diario en backend.
- Modo mentor: un Maestro real revisa las reflexiones del Aprendiz.
- Ilustraciones/3D del templo (columnas J∴ y B∴, mosaico, oriente).
