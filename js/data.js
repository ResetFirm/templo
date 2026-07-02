/* ============================================================
   EL TEMPLO — Contenido del viaje iniciático (v1)
   Tres grados de la Masonería Simbólica: Aprendiz, Compañero, Maestro.
   Tipos de reto:
     - enigma:    pregunta con respuesta (coincidencia flexible por palabras clave)
     - reflexion: escritura libre con mínimo de caracteres; se guarda en el Diario
     - dilema:    elección simbólica; toda opción enseña, cada una da una lectura distinta
   ============================================================ */

const TEMPLE_DATA = {
  intro: {
    title: "El Templo",
    lines: [
      "Ante ti se alza una puerta que no todos ven.",
      "No se entra al Templo con los pies: se entra con preguntas.",
      "Aquí no hay enemigos que vencer, salvo los que llevas dentro.",
      "Cada puerta que abras te abrirá a ti."
    ],
    cta: "Llamar a la puerta"
  },

  vestibulo: {
    title: "El Vestíbulo",
    lines: [
      "Un guardián sin rostro te detiene bajo el dintel.",
      "«Nadie cruza con el nombre que le dieron otros.",
      "Elige el nombre con el que tu mejor versión te llamaría.»"
    ],
    placeholder: "Tu nombre simbólico…",
    cta: "Cruzar el umbral"
  },

  camara: {
    title: "Cámara de Reflexión",
    lines: [
      "Desciendes a una cámara estrecha, iluminada por una sola vela.",
      "Sobre la mesa: un espejo, un reloj de arena, pan y agua.",
      "En el muro, unas letras antiguas: V.I.T.R.I.O.L.",
      "«Visita el Interior de la Tierra y, Rectificando, hallarás la Piedra Oculta.»",
      "Antes de nacer a una nueva vida, el buscador escribe su testamento:",
      "no de lo que posee, sino de lo que está dispuesto a dejar atrás."
    ],
    prompt: "Escribe tu testamento del profano: ¿qué hábito, miedo o certeza falsa dejas fuera del Templo, y por qué?",
    minChars: 120,
    cta: "Firmar y ascender",
    reward: 3
  },

  grades: [
    {
      id: "aprendiz",
      name: "Aprendiz",
      symbol: "▦",
      column: "B∴",
      hall: "Cámara del Norte",
      intro: [
        "Entras a un salón de columnas. El suelo es un tablero de blanco y negro.",
        "Te entregan un mandil sin ornamento y dos herramientas: el mazo y el cincel.",
        "«El Aprendiz trabaja la piedra bruta: él mismo.",
        "Tres puertas guardan esta cámara. Solo el pensamiento las abre.»"
      ],
      doors: [
        {
          id: "ap-1",
          title: "La Puerta de la Piedra",
          type: "enigma",
          narrative: [
            "La primera puerta no tiene cerradura: tiene una pregunta grabada.",
            "«Nazco informe y llena de aristas. Me golpeas y no me destruyes: me revelas.",
            "Cuanto más me quitas, más soy. En el Templo, tú y yo somos lo mismo.",
            "¿Qué soy?»"
          ],
          answerKeys: ["piedra"],
          hint: "El Aprendiz la talla cada día con mazo y cincel. Está bruta al principio.",
          success: "La puerta gira sin ruido. Comprendes: nadie viene a construir el Templo; viene a construirse.",
          reward: 2
        },
        {
          id: "ap-2",
          title: "La Puerta del Silencio",
          type: "reflexion",
          narrative: [
            "La segunda puerta está hecha de un material que absorbe todo sonido.",
            "«El Aprendiz aprende callando: no porque su voz no valga,",
            "sino porque quien no sabe escuchar, tampoco sabe qué decir.»"
          ],
          prompt: "¿Qué voz has estado ignorando —de otros o tuya— y qué crees que intenta decirte?",
          minChars: 120,
          success: "Al terminar de escribir, notas que la sala estaba llena de sonidos que no habías oído. La puerta ya está abierta.",
          reward: 3
        },
        {
          id: "ap-3",
          title: "La Puerta de las Dos Columnas",
          type: "dilema",
          narrative: [
            "La tercera puerta se alza entre dos columnas, como las del pórtico del Templo.",
            "Un guardián te ofrece elegir con qué herramienta continuar el camino.",
            "No hay respuesta errónea: hay espejos distintos."
          ],
          prompt: "¿Qué herramienta tomas?",
          options: [
            {
              label: "El mazo — la voluntad que golpea",
              teaching: "Eliges la fuerza que inicia. El mazo sin dirección destroza; recuérdalo cuando tu energía corra más rápido que tu juicio."
            },
            {
              label: "El cincel — el juicio que dirige",
              teaching: "Eliges la precisión que discierne. El cincel sin fuerza no talla nada; recuérdalo cuando el análisis te sirva de excusa para no actuar."
            },
            {
              label: "La regla de 24 pulgadas — el tiempo bien medido",
              teaching: "Eliges el orden del tiempo: trabajo, descanso y servicio en justa medida. La regla te recuerda que el día que no se mide, se pierde."
            }
          ],
          success: "El guardián asiente: «Ninguna herramienta basta sola. Volverás por las otras sin saberlo.»",
          reward: 2
        }
      ],
      ceremony: {
        title: "Ceremonia de Paso — De Aprendiz a Compañero",
        lines: [
          "Has tallado las primeras aristas de tu piedra.",
          "El Aprendiz mira hacia adentro; el Compañero empieza a mirar el mundo.",
          "Da los tres golpes rituales para pedir el paso."
        ],
        oath: "Prometo seguir puliendo lo que soy, para ser digno de lo que construyo."
      }
    },

    {
      id: "companero",
      name: "Compañero",
      symbol: "✶",
      column: "J∴",
      hall: "Cámara del Mediodía",
      intro: [
        "Asciendes por una escalera de caracol de cinco peldaños.",
        "Arriba brilla una Estrella Flamígera con una letra en su centro: G.",
        "«El Compañero ya no solo talla: estudia. Geometría, arte, naturaleza.",
        "Sus cinco sentidos son ahora instrumentos de conocimiento.»"
      ],
      doors: [
        {
          id: "co-1",
          title: "La Puerta de la Letra G",
          type: "enigma",
          narrative: [
            "La puerta muestra una estrella de cinco puntas y, en su corazón, la letra G.",
            "«Soy la ciencia que mide la tierra sin tocarla,",
            "la que traza el círculo perfecto que ninguna mano logra,",
            "la primera lección del arquitecto. ¿Qué ciencia soy?»"
          ],
          answerKeys: ["geometria", "geometría"],
          hint: "Sin ella no hay escuadra, ni compás, ni catedral. Empieza con la letra de la estrella.",
          success: "«Correcto. Y recuerda: medir el mundo es fácil; medirse a uno mismo es el verdadero arte real.»",
          reward: 2
        },
        {
          id: "co-2",
          title: "La Puerta de los Cinco Peldaños",
          type: "dilema",
          narrative: [
            "Cinco peldaños llevan a esta puerta, uno por cada sentido.",
            "El guardián pregunta cuál de tus sentidos vive más dormido.",
            "Elegir es la mitad del despertar."
          ],
          prompt: "¿Qué sentido despiertas primero?",
          options: [
            {
              label: "La vista — mirar de verdad, no solo ver",
              teaching: "Decides observar antes de juzgar. Esta semana, mira a alguien conocido como si fuera la primera vez: descubrirás cuánto habías dejado de ver."
            },
            {
              label: "El oído — escuchar lo que no se dice",
              teaching: "Decides atender al silencio entre las palabras. La mayoría escucha para responder; el Compañero escucha para comprender."
            },
            {
              label: "El tacto — el trabajo de las manos",
              teaching: "Decides volver a lo concreto: lo que las manos hacen, la mente lo entiende dos veces. El conocimiento que no se practica se evapora."
            }
          ],
          success: "«Un sentido despierto despierta a los demás», dice el guardián, y la puerta cede.",
          reward: 2
        },
        {
          id: "co-3",
          title: "La Puerta del Salario",
          type: "reflexion",
          narrative: [
            "Los antiguos Compañeros recibían su salario junto a la columna.",
            "«Tu salario no es lo que te pagan: es aquello en lo que te conviertes trabajando.»"
          ],
          prompt: "Piensa en tu trabajo u oficio actual: ¿en qué persona te está convirtiendo, y es esa la persona que quieres ser? ¿Qué cambiarías?",
          minChars: 150,
          success: "Al escribir la última línea comprendes que la pregunta seguirá trabajando en ti. Esa es su función.",
          reward: 3
        }
      ],
      ceremony: {
        title: "Ceremonia de Exaltación — De Compañero a Maestro",
        lines: [
          "Conoces la piedra y conoces la ciencia que la ordena.",
          "Falta la prueba mayor: la que ningún estudio prepara.",
          "Da los tres golpes rituales para pedir la exaltación."
        ],
        oath: "Prometo que lo que sé servirá a otros, o no habrá servido de nada."
      }
    },

    {
      id: "maestro",
      name: "Maestro",
      symbol: "☉",
      column: "M∴",
      hall: "Cámara del Medio",
      intro: [
        "Esta cámara está en penumbra. Huele a tierra removida y a acacia.",
        "Aquí se recuerda al Maestro Hiram, que prefirió morir antes que traicionar su palabra.",
        "«El grado de Maestro no se estudia: se atraviesa.",
        "Es la leyenda de todo lo que muere para que algo mejor nazca.»"
      ],
      doors: [
        {
          id: "ma-1",
          title: "La Puerta de la Acacia",
          type: "enigma",
          narrative: [
            "Sobre un túmulo de tierra crece una rama verde que señala la puerta.",
            "«Me plantaron sobre una tumba y no hablé de muerte, sino de memoria.",
            "Soy la señal de que lo esencial no se pudre.",
            "En el grado de Maestro, ¿qué planta soy?»"
          ],
          answerKeys: ["acacia"],
          hint: "Su rama marcó el lugar donde yacía el Maestro Hiram. Es símbolo de inmortalidad.",
          success: "Tomas la rama. Está viva. La puerta se abre hacia la oscuridad, y entras sin miedo.",
          reward: 2
        },
        {
          id: "ma-2",
          title: "La Puerta de la Palabra Perdida",
          type: "dilema",
          narrative: [
            "Tres sombras te cierran el paso, como a Hiram en la leyenda.",
            "No piden oro: piden la palabra del Maestro, que no les corresponde.",
            "Cada sombra es una tentación que ya conoces."
          ],
          prompt: "¿Cuál de estas sombras te ha vencido más veces?",
          options: [
            {
              label: "La prisa — quiere el resultado sin el camino",
              teaching: "Reconocerla es desarmarla: lo que vale se construye a la velocidad de lo que vale. El atajo siempre cobra después su peaje."
            },
            {
              label: "La vanidad — quiere el título sin la obra",
              teaching: "Reconocerla es desarmarla: el grado que importa no es el que te dan, sino el que puedes sostener cuando nadie te mira."
            },
            {
              label: "El miedo — quiere que nada cambie nunca",
              teaching: "Reconocerla es desarmarla: el miedo no se elimina, se lleva de la mano. Hiram sintió miedo y aun así no entregó su palabra."
            }
          ],
          success: "Las sombras se disuelven: solo tenían el poder que tú no mirabas. La puerta estaba abierta desde el principio.",
          reward: 3
        },
        {
          id: "ma-3",
          title: "La Puerta del Legado",
          type: "reflexion",
          narrative: [
            "La última puerta del Templo es un espejo enmarcado en piedra.",
            "«El Maestro sabe que no verá terminada la catedral.",
            "Trabaja igual, porque construye para quienes vendrán.»"
          ],
          prompt: "Si mañana no pudieras continuar, ¿qué querrías haber dejado construido en las personas que te rodean? ¿Qué primera piedra de eso puedes colocar esta semana?",
          minChars: 150,
          success: "El espejo ya no refleja tu rostro, sino la cámara entera, con sus puertas abiertas detrás de ti.",
          reward: 4
        }
      ],
      ceremony: {
        title: "Cámara del Medio — Culminación",
        lines: [
          "Has muerto a lo que eras y despertado a lo que puedes ser.",
          "La palabra perdida no estaba escondida en el Templo:",
          "se pronuncia cada día, con actos, fuera de él.",
          "Da los tres golpes finales."
        ],
        oath: "Prometo ser, fuera del Templo, lo que aprendí dentro de él."
      }
    }
  ],

  finale: {
    title: "La Luz",
    lines: [
      "El Templo se abre y ya no hay más puertas: hay mundo.",
      "Recorriste los tres grados de la Masonería Simbólica —",
      "Aprendiz, Compañero y Maestro — y cada puerta te abrió a ti.",
      "El viaje real empieza ahora: tu Diario guarda las piedras que tallaste.",
      "Vuelve a él. Rectifica. Sigue construyendo."
    ],
    signature: "V.I.T.R.I.O.L."
  }
};
