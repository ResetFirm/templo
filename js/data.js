/* ============================================================
   EL TEMPLO — Contenido del viaje iniciático (v2)
   Una logia moderna con IA como arquitectura.

   Flujo: Umbral secreto → Filtro del Aspirante (5 pruebas)
   → Veredicto (Índice de Compromiso + Expediente) → Cámara de
   Reflexión → 3 grados simbólicos → La Luz.

   Tipos de reto del Templo:
     - enigma:    pregunta con respuesta (coincidencia flexible)
     - reflexion: escritura libre; se guarda en el Diario
     - dilema:    elección simbólica; toda opción enseña
   Tipos de prueba del Filtro:
     - ordenar:   arrastrar piezas al orden correcto
     - completar: completar frases de masones célebres
     - unir:      arrastrar significados sobre símbolos
     - constancia:sostener el cincel sin soltar
     - propuesta: la obra que el aspirante trae a la logia
   ============================================================ */

const TEMPLE_DATA = {

  lodge: {
    name: "El Templo",
    motto: "Me educo · Trabajo · Ayudo",
    contactEmail: "esteban@resetfirm.ai"
  },

  /* ---------- El Umbral: acceso secreto y discreto ---------- */

  umbral: {
    whisper: "Este lugar no aparece en los mapas.",
    lines: [
      "Si llegaste hasta aquí, no fue por accidente.",
      "Nadie te invitó. Algo en ti preguntó primero."
    ],
    hint: "La puerta escucha. Llama tres veces.",
    question: "Una voz desde dentro: «¿Quién llama a las puertas del Templo?»",
    answers: [
      {
        label: "Un curioso que quiere ver qué hay dentro",
        accept: false,
        reply: "«El Templo no se abre para mirar. Lo que buscas está en los museos. Vuelve cuando busques algo que no se pueda fotografiar.»"
      },
      {
        label: "Alguien que busca poder e influencia",
        accept: false,
        reply: "«El poder que se busca afuera se pierde; el que se construye adentro, no. Aquí no repartimos poder: repartimos trabajo. Piénsalo y vuelve.»"
      },
      {
        label: "Una persona libre, dispuesta a trabajar su propia piedra",
        accept: true,
        reply: "«Entonces quizá este sea tu lugar. Pero la palabra no basta: la puerta solo cede ante las obras. Pasa a la Cámara de Pruebas.»"
      }
    ]
  },

  /* ---------- El Filtro del Aspirante ---------- */

  filtro: {
    title: "Cámara de Pruebas",
    intro: [
      "Esta logia no recluta. Selecciona.",
      "No buscamos curiosos: buscamos constructores.",
      "Cinco sellos guardan el acceso. Cada uno mide algo distinto:",
      "tu orden, tu memoria de las voces sabias, tu lectura de los símbolos,",
      "tu constancia y, sobre todo, la obra que traes contigo.",
      "El Maestro leerá tu expediente. Trabaja como si te observara: te observa."
    ],
    pruebas: [
      {
        id: "orden",
        title: "Sello I — La Tabla del Orden",
        type: "ordenar",
        narrative: [
          "Sobre el muro hay una tabla de trazar moderna: un triángulo con tres pilares sueltos.",
          "«Vivimos la era de la Inteligencia Artificial: una fuerza que transforma cómo pensamos,",
          "aprendemos y trabajamos. Por eso la educación interior es la clave.",
          "Este Caballete no habla de tecnología: habla de orden.",
          "Coloca los pilares en el orden en que un constructor los levanta.»"
        ],
        pieces: [
          { id: "educo",   label: "ME EDUCO",  sub: "mente · cuerpo · espíritu" },
          { id: "trabajo", label: "TRABAJO",   sub: "fundamento & propósito" },
          { id: "ayudo",   label: "AYUDO",     sub: "¿quién? ¿cómo? ¿cuándo?" }
        ],
        correctOrder: ["educo", "trabajo", "ayudo"],
        slotLabels: ["1º — Empiezo por mí", "2º — Lo que hago tiene fundamento", "3º — Lo aprendido se vuelve legado"],
        teaching: "Nadie puede construir afuera lo que no ha ordenado adentro. La tecnología acelera el trabajo, pero solo el criterio humano le da valor. Y lo aprendido solo se vuelve legado cuando sirve a otros.",
        failText: "La tabla se desordena sola: ese no es el orden del constructor. Piensa: ¿qué debe existir antes de que exista lo demás?"
      },
      {
        id: "voces",
        title: "Sello II — Las Voces del Oriente",
        type: "completar",
        narrative: [
          "Dos placas de bronce muestran palabras de masones que iluminaron su época.",
          "El tiempo ha borrado una palabra de cada una. Devuélvelas a su lugar."
        ],
        quotes: [
          {
            author: "Benjamin Franklin, impresor, científico y masón",
            before: "«Dime y lo olvido. Enséñame y lo recuerdo. Involúcrame y lo ",
            after: ".»",
            answers: ["aprendo", "aprendere", "aprenderé"]
          },
          {
            author: "J. W. von Goethe, poeta y masón",
            before: "«No basta saber: hay que aplicar. No basta querer: hay que ",
            after: ".»",
            answers: ["hacer", "hacerlo", "actuar"]
          }
        ],
        teaching: "Las voces del Oriente no se memorizan: se practican. Involucrarse y hacer — ese es el examen diario del masón.",
        failText: "El bronce no acepta esa palabra. Escucha de nuevo la frase: la respuesta está en su propia música."
      },
      {
        id: "simbolos",
        title: "Sello III — La Lectura de los Símbolos",
        type: "unir",
        narrative: [
          "Cuatro herramientas cuelgan del muro. Cuatro palabras esperan en el suelo.",
          "«Quien no sabe leer el símbolo, solo ve la herramienta.",
          "Coloca cada significado bajo la herramienta que lo encarna.»"
        ],
        pairs: [
          { symbol: "⊾", name: "La Escuadra",  meaning: "Rectitud en las acciones" },
          { symbol: "Λ", name: "El Compás",    meaning: "Medida justa de los deseos" },
          { symbol: "⚌", name: "El Nivel",     meaning: "Igualdad entre los hombres" },
          { symbol: "⏚", name: "La Plomada",   meaning: "Verticalidad interior" }
        ],
        teaching: "Las herramientas del oficio se volvieron herramientas del alma. Hoy sumamos otras — la IA entre ellas — y la lección es la misma: la herramienta no hace al constructor; el uso que le da, sí.",
        failText: "Algún significado cuelga bajo la herramienta equivocada. Obsérvalas de nuevo: cada una confiesa su función."
      },
      {
        id: "constancia",
        title: "Sello IV — La Prueba de la Constancia",
        type: "constancia",
        narrative: [
          "Frente a ti: una piedra bruta, un mazo y un cincel.",
          "«Cualquiera golpea una vez. El masón vuelve a golpear mañana.",
          "Sostén el cincel contra la piedra y no lo sueltes hasta terminar el trazo.",
          "Si lo sueltas, la piedra lo recuerda.»"
        ],
        holdSeconds: 8,
        carvings: [
          "El talento inicia...",
          "la disciplina sostiene...",
          "el hábito talla...",
          "y la constancia termina la obra."
        ],
        teaching: "Gobernar la atención es el primer oficio de esta era: quien no sostiene el cincel ocho segundos, no sostendrá un propósito ocho años.",
        failText: ""
      },
      {
        id: "propuesta",
        title: "Sello V — La Propuesta del Aspirante",
        type: "propuesta",
        narrative: [
          "La última cámara está vacía, salvo por un atril con pluma.",
          "«A esta logia no se entra con las manos vacías.",
          "Cada piedra del Templo la trajo alguien que quiso construir.",
          "Escribe tu obra: el proyecto, la idea o el aporte con el que piensas",
          "mover energía, crear valor y servir a otros dentro de la logia.»"
        ],
        fields: {
          name:      { label: "Tu nombre simbólico", placeholder: "El nombre con el que tu mejor versión te llamaría…" },
          proposal:  { label: "Tu obra: proyecto, idea o propuesta de valor", placeholder: "¿Qué quieres construir? ¿Qué problema resuelve? ¿Cómo mueve la energía del dinero o del conocimiento?…", min: 200 },
          talents:   { label: "Lo que aportas: talentos, experiencia, recursos", placeholder: "¿Qué sabes hacer bien? ¿Qué pones al servicio de la logia?…", min: 80 },
          beneficiaries: { label: "¿A quién ayudará tu obra?", placeholder: "Familia, comunidad, gremio, país…" },
          commitment: {
            label: "Compromiso de trabajo semanal",
            options: ["1–2 horas", "3–5 horas", "6 o más horas"]
          }
        },
        teaching: "La obra escrita es una hipótesis; la logia será tu laboratorio. Aquí las promesas se miden como la ciencia: con observación, trabajo y resultados."
      }
    ]
  },

  /* ---------- El Veredicto ---------- */

  veredicto: {
    accepted: {
      title: "El Veredicto",
      lines: [
        "Las pruebas hablaron por ti.",
        "El Templo abre su primera puerta: quedas registrado como Aspirante.",
        "Tu expediente será puesto ante los ojos del Maestro.",
        "Desciende ahora a la Cámara de Reflexión: la iniciación te espera."
      ]
    },
    rejected: {
      title: "El Templo aún no se abre",
      lines: [
        "Las pruebas también hablaron por ti — y dijeron: todavía no.",
        "No es una condena: es una medida. La piedra no se ofende con el cincel.",
        "Vuelve a la Cámara de Pruebas cuando estés dispuesto a sostenerlo.",
        "El Templo no tiene prisa. Tú decides si tienes voluntad."
      ]
    },
    seals: [
      { min: 85, name: "Sello de Oro",   symbol: "◉" },
      { min: 70, name: "Sello de Plata", symbol: "◎" },
      { min: 50, name: "Sello de Bronce", symbol: "○" }
    ],
    threshold: 50
  },

  /* ---------- Tabla de Trazar (Caballete del Aprendiz) ---------- */

  caballete: {
    title: "Tabla de Trazar — Caballete del Aprendiz",
    intro: "La IA ya no es solo una herramienta: es una fuerza que transforma cómo pensamos, aprendemos y trabajamos. Por eso, hoy más que nunca, la educación interior es la clave. Este Caballete no habla de tecnología, sino de orden.",
    pillars: [
      {
        title: "ME EDUCO",
        sub: "mente · cuerpo · espíritu",
        text: "Empiezo por mí. Aprendo a gobernar mi atención, mis emociones y mis hábitos, porque nadie puede construir afuera lo que no ha ordenado adentro."
      },
      {
        title: "TRABAJO",
        sub: "fundamento & propósito",
        text: "Lo que hago debe tener fundamento. No se trata solo de producir, sino de hacer bien, con ética, disciplina y sentido. La tecnología acelera el trabajo; solo el criterio humano le da valor."
      },
      {
        title: "AYUDO",
        sub: "¿quién? ¿cómo? ¿cuándo?",
        text: "Lo aprendido no es solo para mí. Se convierte en legado cuando sirve a mi familia, a mi equipo y a mi comunidad. Ayudar es enseñar con el ejemplo."
      }
    ],
    center: "IA como infraestructura — neurociencias, gamificación y evolución humana",
    closing: "La IA puede amplificar nuestras capacidades, pero solo un ser humano con fundamento puede usarla con conciencia. Pregúntate siempre: ¿qué estoy construyendo en mí… y con quién lo estoy compartiendo?"
  },

  /* ---------- Voces del Oriente (coleccionables) ---------- */

  voices: {
    franklin:   { author: "Benjamin Franklin",   role: "impresor, científico, masón",        quote: "Dime y lo olvido. Enséñame y lo recuerdo. Involúcrame y lo aprendo." },
    goethe:     { author: "J. W. von Goethe",     role: "poeta, ministro, masón",             quote: "No basta saber: hay que aplicar. No basta querer: hay que hacer." },
    washington: { author: "George Washington",    role: "primer presidente de EE. UU., masón", quote: "Es mejor estar solo que mal acompañado: asóciate con quienes valgan más que tú." },
    voltaire:   { author: "Voltaire",             role: "filósofo de la Ilustración, masón",  quote: "Juzga a un hombre por sus preguntas, más que por sus respuestas." },
    bolivar:    { author: "Simón Bolívar",        role: "Libertador, masón",                  quote: "Moral y luces son nuestras primeras necesidades." },
    mozart:     { author: "W. A. Mozart",         role: "compositor de La Flauta Mágica, masón", quote: "Ni la inteligencia ni la imaginación por sí solas hacen al genio: el amor es el alma del genio." },
    churchill:  { author: "Winston Churchill",    role: "estadista, masón",                   quote: "El éxito no es definitivo y el fracaso no es fatal: lo que cuenta es el valor de continuar." },
    kipling:    { author: "Rudyard Kipling",      role: "poeta, autor de «If—», masón",       quote: "Si puedes conservar la cabeza cuando todos a tu alrededor la pierden… tuya será la Tierra." },
    fleming:    { author: "Alexander Fleming",    role: "descubridor de la penicilina, masón", quote: "No inventé la penicilina: la naturaleza la hizo. Yo solo tuve los ojos abiertos cuando apareció." }
  },

  /* ---------- Cámara de Reflexión ---------- */

  camara: {
    title: "Cámara de Reflexión",
    lines: [
      "Desciendes a una cámara estrecha, iluminada por una sola vela.",
      "Sobre la mesa: un espejo, un reloj de arena, pan y agua.",
      "En el muro, unas letras antiguas: V.I.T.R.I.O.L.",
      "«Visita el Interior de la Tierra y, Rectificando, hallarás la Piedra Oculta.»",
      "Antes de nacer a una nueva vida, el aspirante escribe su testamento:",
      "no de lo que posee, sino de lo que está dispuesto a dejar atrás."
    ],
    prompt: "Escribe tu testamento del profano: ¿qué hábito, miedo o certeza falsa dejas fuera del Templo, y por qué?",
    minChars: 120,
    cta: "Firmar y ascender",
    reward: 3
  },

  /* ---------- Los tres grados ---------- */

  grades: [
    {
      id: "aprendiz",
      name: "Aprendiz",
      symbol: "▦",
      column: "B∴",
      hall: "Cámara del Norte — ME EDUCO",
      intro: [
        "Entras a un salón de columnas. El suelo es un tablero de blanco y negro.",
        "Te entregan un mandil sin ornamento y dos herramientas: el mazo y el cincel.",
        "«El Aprendiz trabaja la piedra bruta: él mismo. Empieza por ti:",
        "mente, cuerpo y espíritu. Tres puertas guardan esta cámara.",
        "Solo el pensamiento las abre.»"
      ],
      doors: [
        {
          id: "ap-1",
          title: "La Puerta de la Piedra",
          type: "enigma",
          voice: "fleming",
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
          voice: "voltaire",
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
          voice: "washington",
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
        oath: "Me educo: prometo seguir puliendo lo que soy, para ser digno de lo que construyo."
      }
    },

    {
      id: "companero",
      name: "Compañero",
      symbol: "✶",
      column: "J∴",
      hall: "Cámara del Mediodía — TRABAJO",
      intro: [
        "Asciendes por una escalera de caracol de cinco peldaños.",
        "Arriba brilla una Estrella Flamígera con una letra en su centro: G.",
        "«El Compañero ya no solo talla: estudia y trabaja con fundamento.",
        "Geometría, arte, ciencia — y en esta era, también la IA como infraestructura.",
        "La herramienta acelera; solo el criterio humano da valor.»"
      ],
      doors: [
        {
          id: "co-1",
          title: "La Puerta de la Letra G",
          type: "enigma",
          voice: "mozart",
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
          voice: "goethe",
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
          voice: "franklin",
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
        oath: "Trabajo: prometo que lo que hago tendrá fundamento, ética y sentido — o no lo haré."
      }
    },

    {
      id: "maestro",
      name: "Maestro",
      symbol: "☉",
      column: "M∴",
      hall: "Cámara del Medio — AYUDO",
      intro: [
        "Esta cámara está en penumbra. Huele a tierra removida y a acacia.",
        "Aquí se recuerda al Maestro Hiram, que prefirió morir antes que traicionar su palabra.",
        "«El grado de Maestro no se estudia: se atraviesa.",
        "Y su secreto final es simple: lo aprendido se vuelve legado",
        "solo cuando sirve a otros. ¿Quién? ¿Cómo? ¿Cuándo?»"
      ],
      doors: [
        {
          id: "ma-1",
          title: "La Puerta de la Acacia",
          type: "enigma",
          voice: "bolivar",
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
          voice: "churchill",
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
          voice: "kipling",
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
        oath: "Ayudo: prometo que lo aprendido servirá a mi familia, a mi equipo y a mi comunidad — o no habrá servido de nada."
      }
    }
  ],

  /* ---------- Final ---------- */

  finale: {
    title: "La Luz",
    lines: [
      "El Templo se abre y ya no hay más puertas: hay mundo.",
      "Recorriste el Filtro, la Cámara de Reflexión y los tres grados",
      "de la Masonería Simbólica — y cada puerta te abrió a ti.",
      "Tu obra espera ser construida. Tu Diario guarda las piedras que tallaste.",
      "Este camino no se recorre en soledad: comparte lo aprendido,",
      "construye comunidad y suma voluntades.",
      "Pregúntate siempre: ¿qué estoy construyendo en mí…",
      "y con quién lo estoy compartiendo?"
    ],
    signature: "V.I.T.R.I.O.L."
  }
};
