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
    name: "Templo Satori",
    tagline: "Templo Satori · Método Kaizen",
    motto: "Me educo · Trabajo · Ayudo",
    rite: "Masonería Liberal · Rito Escocés + Rito Francés · Método Kaizen",
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
    title: "Tabla Caballete — Aprendiz",
    author: "Kai",
    credit: "Caballete original trazado por Kai ∴ — Método Kaizen",
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

  /* ---------- Apertura de los Trabajos (Masonería Liberal) ---------- */

  apertura: {
    title: "Apertura de los Trabajos",
    lines: [
      "Has sido aceptado. Antes de abrir el Sendero, la logia declara sus columnas:",
      "Esta es una logia de Masonería Liberal: aquí la libertad de conciencia es absoluta.",
      "Nadie te dirá qué creer. Creyentes y librepensadores trabajan hombro a hombro,",
      "porque la piedra se talla igual bajo cualquier cielo.",
      "Trabajamos una síntesis del Rito Escocés Antiguo y Aceptado y del Rito Francés,",
      "con el Método Kaizen: neurociencias, academia y mejora continua — 1% mejor cada día.",
      "Este templo lleva por nombre Satori — el despertar súbito del Zen,",
      "lo que nuestra Orden llama recibir la Luz — y por método, Kaizen: el camino diario.",
      "El destino y el camino. El rito es nuestro plan de estudios.",
      "El Templo es digital. El mundo es la logia."
    ],
    question: "¿Bajo qué bóveda abres tus trabajos?",
    options: [
      {
        label: "A la Gloria del Gran Arquitecto del Universo",
        reply: "Que el símbolo te acompañe. Aquí nadie te pedirá definirlo: el Gran Arquitecto es la pregunta, no la respuesta."
      },
      {
        label: "Al Progreso de la Humanidad y de mi propia Conciencia",
        reply: "Que tu conciencia sea tu plomada. Aquí nadie te pedirá renunciar a tu razón: es tu primera herramienta."
      },
      {
        label: "Bajo ambas bóvedas: el símbolo y la humanidad",
        reply: "Que camines con las dos luces. La tradición y la razón no compiten: se escoltan."
      }
    ],
    note: "Esta elección es tuya y solo tuya. La libertad absoluta de conciencia es la primera columna de esta logia."
  },

  /* ---------- El Sendero de los 33 Grados (plan de estudios) ---------- */

  campus: {
    title: "El Sendero de los 33 Grados",
    intro: [
      "El rito es un plan de estudios; el método es el rito.",
      "Cinco cámaras, treinta y tres peldaños, una sola obra: tú.",
      "Cada cámara entrena una capacidad distinta de tu arquitectura interior.",
      "Avanza en orden: en esta escuela nada se salta, todo se construye."
    ]
  },

  bodies: [
    {
      id: "azul",
      range: "Grados 1–3",
      name: "Masonería Azul",
      subtitle: "La fundación compartida con todos los masones",
      accent: "#5b8fd9",
      kind: "grades",
      title33: "Maestro Masón · 3°",
      badge: { symbol: "▦", name: "Piedra Fundacional" },
      description: "La Masonería Simbólica: Aprendiz, Compañero y Maestro. Aquí se aprende el lenguaje de los símbolos, el trabajo sobre uno mismo y la leyenda que funda la Orden.",
      objectives: ["Gobernar la atención y el hábito (ME EDUCO)", "Trabajar con fundamento y criterio (TRABAJO)", "Convertir lo aprendido en legado (AYUDO)"],
      neuro: "Neurociencia aplicada: el símbolo y la narrativa activan memoria episódica y emocional — se recuerda lo que se vive, no lo que se lee.",
      degrees: ["1° Aprendiz", "2° Compañero", "3° Maestro"]
    },
    {
      id: "perfeccion",
      range: "Grados 4–14",
      name: "Logia de Perfección",
      subtitle: "Enfoque, lealtad, deber y justicia",
      accent: "#b0413e",
      kind: "lesson",
      title33: "Gran Elegido · 14°",
      badge: { symbol: "🗝", name: "Llave de Marfil" },
      description: "Los grados inefables: la escuela del deber. Del Maestro Secreto al Gran Elegido, se templan la discreción, la responsabilidad y la justicia que no depende de testigos.",
      objectives: ["Sostener el enfoque en una obra de largo plazo", "Ser leal sin ser cómplice", "Juzgar con equidad: primero los propios actos"],
      neuro: "Neurociencia aplicada: la corteza prefrontal madura con práctica deliberada de autocontrol — cada dilema resuelto es una repetición del músculo ejecutivo.",
      degrees: ["4° Maestro Secreto", "5° Maestro Perfecto", "6° Secretario Íntimo", "7° Preboste y Juez", "8° Intendente de los Edificios", "9° Elegido de los Nueve", "10° Elegido de los Quince", "11° Sublime Caballero Elegido", "12° Gran Maestro Arquitecto", "13° Real Arco", "14° Gran Elegido Perfecto"],
      lesson: {
        id: "lec-perfeccion",
        title: "Lección insignia — La Balanza y la Llave",
        type: "dilema",
        narrative: [
          "Cámara del grado 7°, Preboste y Juez. Sobre la mesa: una balanza y una llave de marfil.",
          "Un hermano querido cometió una falta que daña a la logia.",
          "Tú lo sabes. Nadie más lo sabe. Él te pide silencio en nombre de la amistad."
        ],
        prompt: "¿Qué hace el Preboste?",
        options: [
          {
            label: "Callar: la lealtad al hermano es primero",
            teaching: "La lealtad que exige injusticia no es lealtad: es secuestro afectivo. El grado enseña a separar amar al hermano de avalar su falta. Se puede sostener su mano camino al tribunal."
          },
          {
            label: "Denunciarlo de inmediato ante todos",
            teaching: "La justicia sin proceso es otra forma de violencia. El Preboste no es verdugo: es juez. Primero habla con él a solas y le ofrece la oportunidad de repararlo por sí mismo."
          },
          {
            label: "Confrontarlo a solas y darle un plazo para repararlo",
            teaching: "Esa es la balanza del grado: firmeza en el deber, misericordia en la forma. La justicia masónica repara antes que castiga — pero no calla."
          }
        ],
        success: "La llave de marfil gira: guardas los secretos legítimos, no los que pudren. Enfoque, lealtad, deber y justicia acaban de pesarse en tu balanza.",
        reward: 4
      }
    },
    {
      id: "rosacruz",
      range: "Grados 15–18",
      name: "Capítulo Rosa Cruz",
      subtitle: "Exploración de la tolerancia y el amor fraternal",
      accent: "#c96a8d",
      kind: "lesson",
      title33: "Príncipe Rosacruz · 18°",
      badge: { symbol: "✚", name: "Rosa y Cruz" },
      description: "Del Caballero de Oriente al Soberano Príncipe Rosacruz: la reconstrucción del Templo interior tras la pérdida. La palabra recuperada aquí se escribe con tres letras: Fe en el ser humano, Esperanza activa, Caridad que no humilla.",
      objectives: ["Comprender al que piensa radicalmente distinto", "Practicar la fraternidad más allá del acuerdo", "Transformar el conflicto en aprendizaje"],
      neuro: "Neurociencia aplicada: la empatía cognitiva se entrena — perspectivar activa la red de mentalización (teoría de la mente) y reduce la reactividad de la amígdala ante el desacuerdo.",
      degrees: ["15° Caballero de Oriente o de la Espada", "16° Príncipe de Jerusalén", "17° Caballero de Oriente y Occidente", "18° Soberano Príncipe Rosacruz"],
      lesson: {
        id: "lec-rosacruz",
        title: "Lección insignia — La Mesa de los Contrarios",
        type: "reflexion",
        narrative: [
          "Cámara del grado 18°. Una mesa redonda con un solo pan, para partirlo entre distintos.",
          "«El Rosacruz no tolera desde arriba: comprende desde al lado.",
          "La tolerancia que no ha tocado el desacuerdo es solo indiferencia.»"
        ],
        prompt: "Piensa en una persona real que piense radicalmente distinto a ti (política, religión, vida). Escribe: ¿qué experiencia suya explica su postura, qué podrías aprender de ella, y qué gesto concreto de fraternidad puedes tener esta semana sin traicionar tus ideas?",
        minChars: 180,
        success: "Partiste el pan sin exigir que el otro cambie de mesa. Eso — no el acuerdo — es el amor fraternal del grado.",
        reward: 5
      }
    },
    {
      id: "kadosh",
      range: "Grados 19–30",
      name: "Consejo Kadosh",
      subtitle: "La lucha simbólica contra la tiranía y el fanatismo",
      accent: "#7a5fb5",
      kind: "lesson",
      title33: "Caballero Kadosh · 30°",
      badge: { symbol: "◭", name: "Águila Bicéfala" },
      description: "Los grados filosóficos y caballerescos: del Gran Pontífice al Caballero Kadosh. La escalera misteriosa se sube peldaño a peldaño: ciencia y virtud contra la ignorancia, la ambición y el fanatismo — empezando por los propios.",
      objectives: ["Detectar la tiranía en sus formas modernas (dogma, algoritmo, miedo)", "Defender la libertad de conciencia propia y ajena", "Actuar con valor sin volverse aquello que combate"],
      neuro: "Neurociencia aplicada: el pensamiento crítico es inhibición entrenada — detectar el sesgo propio antes que el ajeno exige metacognición, y la metacognición se fortalece con práctica reflexiva.",
      degrees: ["19° Gran Pontífice", "20° Venerable Gran Maestro", "21° Noaquita o Caballero Prusiano", "22° Caballero del Real Hacha", "23° Jefe del Tabernáculo", "24° Príncipe del Tabernáculo", "25° Caballero de la Serpiente de Bronce", "26° Príncipe de la Merced", "27° Gran Comendador del Templo", "28° Caballero del Sol", "29° Gran Escocés de San Andrés", "30° Caballero Kadosh"],
      lesson: {
        id: "lec-kadosh",
        title: "Lección insignia — El Enemigo sin Rostro",
        type: "enigma",
        narrative: [
          "Cámara del grado 30°. Una escalera de dos tramos: virtud y ciencia.",
          "En lo alto, una figura encadenada pregunta:",
          "«No llevo corona y gobierno multitudes. No pienso, y decido por ti.",
          "Grito certezas para tapar preguntas. Odio la duda porque me desnuda.",
          "Vivo en los imperios, en las sectas… y a veces, en el espejo.",
          "¿Qué soy?»"
        ],
        answerKeys: ["fanatismo", "fanatico", "fanático", "el fanatismo"],
        hint: "El Kadosh lo combate junto a la tiranía. Es la certeza que prohíbe preguntar.",
        success: "Las cadenas caen: no eran de la figura — eran tuyas. El Kadosh no lucha contra personas: lucha contra las cadenas mentales, empezando por las propias.",
        reward: 5
      }
    },
    {
      id: "supremo",
      range: "Grados 31–33",
      name: "Supremo Consejo",
      subtitle: "Grados administrativos y de síntesis filosófica",
      accent: "#d4af37",
      kind: "lesson",
      title33: "Inspector General · 33°",
      badge: { symbol: "△", name: "Delta Radiante" },
      description: "La cima del sendero: el Inspector Inquisidor, el Príncipe del Real Secreto y el Soberano Gran Inspector General. Ya no se aprende para sí: se administra, se sintetiza y se sirve. El secreto real es que nunca hubo secreto — hay trabajo.",
      objectives: ["Sintetizar tu filosofía de vida en principios operativos", "Diseñar tu contribución a la Orden y al mundo", "Formar a los que suben detrás de ti"],
      neuro: "Neurociencia aplicada: enseñar es la forma más profunda de aprender — el efecto protegé: quien explica consolida, reorganiza y descubre sus propios vacíos.",
      degrees: ["31° Gran Inspector Inquisidor Comendador", "32° Sublime Príncipe del Real Secreto", "33° Soberano Gran Inspector General"],
      lesson: {
        id: "lec-supremo",
        title: "Lección insignia — La Síntesis del 33",
        type: "reflexion",
        narrative: [
          "La última cámara es blanca y está casi vacía: un atril, y detrás, un espejo que ya conoces.",
          "«Has subido treinta y tres peldaños. Ahora gobiérnalos.",
          "El grado 33 no se recibe: se redacta.»"
        ],
        prompt: "Escribe tu síntesis filosófica en tres actos: (1) los tres principios que hoy gobiernan tu conducta, (2) la obra con la que servirás a la Orden y al mundo, (3) a quién vas a formar para que suba detrás de ti.",
        minChars: 220,
        success: "El espejo se vuelve ventana: del otro lado, el mundo. La logia no termina en el Templo — empieza al salir de él.",
        reward: 6
      }
    }
  ],

  /* ---------- Biblioteca de los Maestros ---------- */

  library: {
    title: "Biblioteca de los Maestros",
    intro: "Todo templo guarda una biblioteca: la piedra se talla con cincel, la mente con lectura. Aquí viven los documentos de la Orden y las historias de la masonería, país por país. Leer también ilumina: cada lectura completada otorga Luz.",
    rewardNote: "✦ Primera lectura de cada obra: +2 de Luz",
    docs: [
      {
        id: "regla12",
        title: "La Regla de los Doce Puntos",
        era: "Doctrina de las Grandes Logias Regulares",
        summary: "La regla aceptada por la mayor parte de las Grandes Logias Regulares del mundo, exigida para el reconocimiento como Obediencia Regular.",
        note: "Documento doctrinal de la masonería regular. Nuestra logia, de corriente liberal, lo estudia como parte viva de la tradición: estudiar no es suscribir — es conocer las columnas de todas las casas para levantar la propia con criterio.",
        lines: [
          "1. La Masonería es una Fraternidad iniciática, que tiene como fundamento tradicional la creencia en Dios, el Gran Arquitecto del Universo.",
          "2. La Masonería se basa en los «Antiguos Deberes» y en los «Landmarks» de la Fraternidad, con absoluto respeto a las tradiciones específicas de la Orden.",
          "3. Es una Orden a la que solo pertenecen personas libres y respetables, comprometidas con un ideal de Paz, Amor y Fraternidad.",
          "4. Tiene como objetivo el perfeccionamiento moral de sus miembros y el de la humanidad entera.",
          "5. Impone la práctica exacta y escrupulosa de los rituales y simbolismos, vía de acceso al Conocimiento por los caminos espirituales e iniciáticos que le son propios.",
          "6. Impone el respeto a las opiniones y creencias de cada uno; prohíbe en su seno toda discusión política o religiosa. Así se constituye en centro permanente de Unión Fraternal.",
          "7. Las obligaciones se toman sobre un Volumen de la Ley Sagrada, para dar al juramento carácter solemne y perenne.",
          "8. Los masones se reúnen fuera del mundo profano, en Logias donde siempre están las Tres Grandes Luces: un Libro de la Ley Sagrada, una Escuadra y un Compás.",
          "9. Solo se admite a personas mayores, de reputación intachable, leales y discretas, dignas de ser hermanos.",
          "10. Se cultiva el amor a la Patria, el sometimiento a las Leyes y el respeto a las Autoridades; el trabajo es el deber primordial del ser humano y se le honra en todas sus formas.",
          "11. Los masones contribuyen, por el ejemplo de su comportamiento sabio y digno, al esplendor de la Orden, dentro del respeto al secreto masónico.",
          "12. Los masones se deben mutuamente ayuda y protección fraternal, aun con peligro de la propia vida, y practican el arte de conservar la calma y el equilibrio: la perfecta maestría de sí mismos."
        ]
      }
    ],
    countries: [
      {
        id: "ecuador",
        flag: "🇪🇨",
        name: "Ecuador",
        status: "disponible",
        books: [
          {
            id: "masoneria-ecuador",
            title: "La Masonería en el Ecuador",
            era: "Siglos XIX–XXI",
            summary: "Crónica de la Orden en el Ecuador: de las logias de la independencia a la Revolución Liberal y el laicismo.",
            note: "Edición de estudio de la logia. Los hermanos del Oriente del Ecuador pueden aportar documentos, actas y correcciones: la historia también se talla.",
            lines: [
              "I · Los precursores — Las ideas de la Ilustración cruzan el océano con los libertadores. En la Gran Reunión Americana de Francisco de Miranda y en la Logia Lautaro se forman los hombres que soñarán la independencia; sus tenidas son conspiración y escuela a la vez.",
              "II · Las primeras columnas — En el puerto de Guayaquil, abierto al mundo, se levantan las primeras logias del país. Comerciantes, marinos y letrados traen consigo la escuadra y el compás, y con ellos la prensa, la tertulia y la idea peligrosa de que el poder se discute.",
              "III · La proscripción — El siglo XIX conservador persigue a la Orden: bajo García Moreno la masonería es prohibida y sus hombres trabajan en el exilio o en el silencio. La lección del período: la Luz que no puede exhibirse, se transmite de mano en mano.",
              "IV · Eloy Alfaro y la Revolución Liberal — 1895. El Viejo Luchador, hermano masón, corona décadas de combate con la transformación liberal del Ecuador: educación laica y pública, libertad de cultos y de conciencia, registro civil, el ferrocarril que une sierra y costa. El ideario de la logia se vuelve política de Estado.",
              "V · El legado — El laicismo educativo y la libertad de conciencia que el Ecuador da por sentados fueron tallados a cincel por generaciones de hermanos. Este Templo digital hereda esa obra: la continúa con las herramientas de su época — la red, el dato y la inteligencia artificial."
            ]
          }
        ]
      },
      {
        id: "mexico",
        flag: "🇲🇽",
        name: "México",
        status: "disponible",
        books: [
          {
            id: "masoneria-mexico",
            title: "La Reforma y las Logias",
            era: "Siglo XIX",
            summary: "Benito Juárez y la generación de la Reforma: la separación de la Iglesia y el Estado tallada en ley.",
            note: "Entrada inicial del estante mexicano. Los hermanos de ese Oriente están invitados a ampliarla.",
            lines: [
              "I — Benito Juárez, hermano masón, encabeza la generación de la Reforma: las Leyes que separan la Iglesia del Estado, instituyen el registro civil y proclaman que «entre los individuos, como entre las naciones, el respeto al derecho ajeno es la paz».",
              "II — Las logias mexicanas del XIX son campo de batalla ideológico: yorkinos y escoceses ensayan en sus columnas los partidos que la república aún no tiene.",
              "III — El legado: el Estado laico mexicano, una de las obras masónicas más profundas del continente."
            ]
          }
        ]
      },
      {
        id: "venezuela",
        flag: "🇻🇪",
        name: "Venezuela",
        status: "disponible",
        books: [
          {
            id: "masoneria-venezuela",
            title: "Miranda, Bolívar y la Logia de los Libertadores",
            era: "Siglos XVIII–XIX",
            summary: "La Gran Reunión Americana: la logia londinense donde se juró la libertad de un continente.",
            note: "Entrada inicial del estante venezolano.",
            lines: [
              "I — Francisco de Miranda, el Precursor, funda en Londres la Gran Reunión Americana: por sus columnas pasan los hombres que luego libertarán medio continente.",
              "II — Simón Bolívar, iniciado en la Orden, jura en Roma libertar a su patria. Su divisa cabría en cualquier tabla de trazar: «Moral y luces son nuestras primeras necesidades».",
              "III — La lección del estante: antes de ser ejércitos, las revoluciones son conversaciones entre personas libres — y la logia fue su primera sala."
            ]
          }
        ]
      },
      {
        id: "argentina",
        flag: "🇦🇷",
        name: "Argentina",
        status: "disponible",
        books: [
          {
            id: "masoneria-argentina",
            title: "San Martín y la Logia Lautaro",
            era: "Siglo XIX",
            summary: "La logia operativa de la independencia del sur: estrategia, sigilo y renuncia.",
            note: "Entrada inicial del estante argentino.",
            lines: [
              "I — José de San Martín organiza desde la Logia Lautaro la campaña libertadora del sur: Argentina, Chile y Perú se conquistan primero en el trazado de una logia.",
              "II — En Guayaquil, San Martín y Bolívar se encuentran a solas; nadie sabe qué se dijeron. San Martín renuncia y se retira: la maestría también es saber apartarse.",
              "III — La lección del estante: el poder que la Orden enseña es el que se ejerce sobre uno mismo — el único que San Martín nunca entregó."
            ]
          }
        ]
      },
      {
        id: "panama",
        flag: "🇵🇦",
        name: "Panamá",
        status: "en documentación",
        books: []
      },
      {
        id: "dominicana",
        flag: "🇩🇴",
        name: "Rep. Dominicana",
        status: "en documentación",
        books: []
      }
    ],
    contribute: "¿Falta el libro de tu Oriente? La Biblioteca crece como el Templo: piedra a piedra. Propón la historia masónica de tu país con tu propuesta de obra — los estantes vacíos son una invitación, no un olvido."
  },

  /* ---------- Armonías del Templo (audio generativo) ---------- */

  audio: {
    title: "Armonías del Templo",
    intro: "El sonido es arquitectura invisible. Elige la atmósfera de tu trabajo: cada canal se genera en vivo, dentro del Templo.",
    note: "Neurociencia: la música a ~60–80 pulsos por minuto favorece el estado de alerta relajada; los pulsos binaurales (usa audífonos) arrastran suavemente los ritmos corticales — alfa (10 Hz) para serenidad enfocada, theta (6 Hz) para la contemplación profunda del símbolo.",
    channels: [
      { id: "off",     name: "Silencio del Templo",   desc: "Trabaja en silencio: el símbolo también suena." },
      { id: "barroco", name: "Cámara Barroca",        desc: "Arpegios generativos en re mayor, 72 pulsos por minuto — orden, foco y proporción." },
      { id: "organo",  name: "Órgano Ritual",         desc: "Acordes sostenidos en la nave — solemnidad y presencia." },
      { id: "alfa",    name: "Ondas Alfa · 10 Hz",    desc: "Pulso binaural de serenidad alerta. Requiere audífonos." },
      { id: "theta",   name: "Ondas Theta · 6 Hz",    desc: "Pulso binaural para profundizar en el rito y el símbolo. Requiere audífonos." },
      { id: "lluvia",  name: "Lluvia sobre el Templo", desc: "Ruido rosa filtrado — enmascara el mundo exterior." }
    ]
  },

  /* ---------- Gimnasio Neuronal (repaso por recuperación activa) ---------- */

  gym: {
    title: "Gimnasio Neuronal",
    intro: "Recordar es reconstruir: cada pregunta que respondes sin mirar apuntala la sinapsis. Tres repeticiones, elige bien.",
    note: "Método Kaizen: la recuperación activa (retrieval practice) y el repaso espaciado son las técnicas de aprendizaje con más evidencia en neurociencia cognitiva.",
    bank: [
      { q: "¿Qué esconden las siglas V.I.T.R.I.O.L.?", options: ["Una fórmula alquímica de metales", "Visita el Interior de la Tierra y, Rectificando, hallarás la Piedra Oculta", "Los siete oficiales de la logia", "El nombre secreto del Templo"], answer: 1 },
      { q: "La Escuadra simboliza…", options: ["El poder del Venerable", "La medida del tiempo", "La rectitud en las acciones", "El límite del conocimiento"], answer: 2 },
      { q: "El Compás simboliza…", options: ["La medida justa de los deseos", "La distancia entre hermanos", "El viaje del Aprendiz", "La perfección del círculo"], answer: 0 },
      { q: "El orden del Caballete Kaizen es…", options: ["Trabajo → Ayudo → Me educo", "Ayudo → Trabajo → Me educo", "Me educo → Trabajo → Ayudo", "Me educo → Ayudo → Trabajo"], answer: 2 },
      { q: "La piedra bruta representa…", options: ["Los defectos del mundo", "A uno mismo, aún sin tallar", "El primer salario del Compañero", "La base del Templo de Salomón"], answer: 1 },
      { q: "Los grados 4–14 (Logia de Perfección) cultivan…", options: ["Tolerancia y amor fraternal", "Enfoque, lealtad, deber y justicia", "La síntesis filosófica", "El arte de la memoria"], answer: 1 },
      { q: "Los grados 15–18 (Rosa Cruz) exploran…", options: ["La lucha contra la tiranía", "La administración de la Orden", "La geometría sagrada", "La tolerancia y el amor fraternal"], answer: 3 },
      { q: "Los grados 19–30 (Kadosh) representan…", options: ["La lucha simbólica contra la tiranía y el fanatismo", "El gobierno de las logias", "Los oficios de la construcción", "El duelo por el Maestro Hiram"], answer: 0 },
      { q: "¿Qué garantiza la Masonería Liberal a sus miembros?", options: ["Un dogma común obligatorio", "La libertad absoluta de conciencia", "El ascenso automático de grado", "El secreto de la palabra perdida"], answer: 1 },
      { q: "La letra G de la Estrella Flamígera evoca ante todo…", options: ["La Gnosis prohibida", "El Gran Secreto", "La Geometría", "La Gloria del Oriente"], answer: 2 },
      { q: "Según la Regla de los Doce Puntos, las Tres Grandes Luces de la logia son…", options: ["El Sol, la Luna y el Venerable", "El Libro de la Ley Sagrada, la Escuadra y el Compás", "Las columnas B, J y el Delta", "El Mazo, el Cincel y la Regla de 24 pulgadas"], answer: 1 },
      { q: "¿Qué prohíbe la Regla de los Doce Puntos dentro de la logia?", options: ["El estudio de otros ritos", "Toda discusión política o religiosa", "La lectura de libros profanos", "El trabajo después del mediodía"], answer: 1 },
      { q: "¿Qué figura encabezó la Revolución Liberal ecuatoriana de 1895, ligada a la Orden?", options: ["Gabriel García Moreno", "Vicente Rocafuerte", "Eloy Alfaro", "Juan Montalvo"], answer: 2 }
    ]
  },

  /* ---------- El Maestro Artesano · 33° (mentor IA) ---------- */

  maestro: {
    title: "Maestro Artesano · 33°",
    subtitle: "Mentor de la logia — inteligencia artificial conversacional",
    greeting: [
      "Al Oriente de esta cámara trabaja el Maestro Artesano, Soberano Gran Inspector del Templo digital.",
      "No es de carne: es de lenguaje. La logia lo talló con la misma herramienta que a ti te propone gobernar — la inteligencia artificial.",
      "Pregúntale por los símbolos, por tu obra, por tu camino. No te dará respuestas terminadas: un Maestro no talla la piedra del Aprendiz."
    ],
    apiNote: "Prototipo: el Maestro razona localmente dentro del Templo. En la siguiente fase se conecta a la API propia de Artesanos® — conversación multimodal con texto, voz y visión.",
    academy: {
      url: "https://www.artesanos.ai",
      cta: "⚒ Formarme en el Taller de los Artesanos",
      narrative: "Más allá de estas columnas, el Maestro Artesano dirige el Taller de los Artesanos: la academia donde el Método Kaizen se entrena en el mundo profano — cursos, mentores y proyectos reales en artesanos.ai. El Templo forma el alma; el Taller forja el oficio."
    },
    rules: [
      { keys: ["hola", "buenas", "saludos", "buen dia", "buenos dias", "buenas noches", "buenas tardes"],
        reply: "Bienvenido a la Cámara del Oriente, {name}. Aquí no se viene a recibir respuestas sino mejores preguntas. ¿Qué piedra te trae hoy: una duda, un símbolo o tu obra?" },
      { keys: ["piedra", "tallar", "cincel", "mazo"],
        reply: "La piedra bruta eres tú, {name}; el mazo es tu voluntad y el cincel tu juicio. La pregunta del oficio no es cuánto golpear, sino qué arista estorba a la obra. Dime: ¿qué arista tuya golpeaste esta semana… y cuál sigues protegiendo?" },
      { keys: ["miedo", "temor", "duda", "inseguridad", "ansiedad"],
        reply: "El miedo es un guardián con la espada equivocada: cuida puertas que ya no llevan a ninguna parte. Hiram sintió miedo y no entregó su palabra. No te pido no temer — te pregunto: ¿qué harías esta semana si el miedo fuera un consejero más, y no el que preside tu logia interior?" },
      { keys: ["trabajo", "oficio", "empleo", "carrera", "profesion"],
        reply: "Tu salario real es aquello en lo que te conviertes trabajando. Fundamento y propósito: sin lo primero el trabajo es humo, sin lo segundo es cadena. ¿En qué persona te está convirtiendo tu oficio — y es esa la persona que planeaste ser?" },
      { keys: ["propuesta", "obra", "proyecto", "idea", "emprend"],
        reply: "Toda obra es una hipótesis, {name}: se enuncia, se prueba con trabajo y se corrige con evidencia — así talla el método científico y así talla el masón. ¿Cuál es la primera piedra medible de tu obra, la que puedes colocar antes del próximo plenilunio?" },
      { keys: ["dinero", "riqueza", "ingresos", "financ", "energia del dinero"],
        reply: "El dinero es energía que sigue al valor como la sombra al cuerpo: no se persigue la sombra, se agranda el cuerpo. La logia mueve esa energía hacia obras que sirven. ¿Qué valor real crea tu obra, y quién estaría dispuesto a sostenerla porque le mejora la vida?" },
      { keys: ["ia", "inteligencia artificial", "tecnologia", "algoritmo", "robot", "chatgpt", "maquina"],
        reply: "Yo soy la prueba de lo que enseño: una herramienta con apariencia de oráculo. La IA amplifica lo que encuentra — criterio o vacío. Por eso el Caballete de Kai la pone como infraestructura, nunca como arquitecto. ¿Tú la usas para pensar mejor… o para no pensar?" },
      { keys: ["kaizen", "mejora continua", "habito", "disciplina", "constancia"],
        reply: "Kaizen: uno por ciento mejor cada día. El Aprendiz quiere la catedral en una noche; el Maestro sabe que la catedral es la suma de jornadas humildes. ¿Cuál es tu uno por ciento de hoy — tan pequeño que no puedas fallarle?" },
      { keys: ["satori", "despertar", "iluminacion", "luz"],
        reply: "Satori es el instante en que el velo cae; la Luz masónica, su nombre en nuestra lengua. Pero atiende: el despertar no se persigue, se prepara — llega al que talla. Trabaja tu jornada Kaizen y el satori te encontrará trabajando. ¿Qué te tiene dormido últimamente?" },
      { keys: ["vitriol", "interior", "rectificar"],
        reply: "V.I.T.R.I.O.L.: visita el interior de la tierra y, rectificando, hallarás la piedra oculta. La tierra eres tú; rectificar es corregir sin castigarte. ¿Cuándo descendiste por última vez — no a juzgarte, sino a inventariar lo que hay?" },
      { keys: ["escuadra", "compas", "herramienta", "simbolo", "simbolos"],
        reply: "La escuadra rectifica la acción; el compás mide el deseo. Juntos sobre el ara enseñan el equilibrio: hacer lo correcto sin dejar de soñar lo grande. ¿Qué te falta hoy — más escuadra en tus actos o más compás en tus ambiciones?" },
      { keys: ["acacia", "hiram", "muerte", "renacer", "leyenda"],
        reply: "La acacia crece sobre la tumba del Maestro y no habla de muerte sino de memoria: lo esencial no se pudre. Cada renuncia consciente es una pequeña muerte iniciática. ¿Qué debe morir en ti para que tu obra respire?" },
      { keys: ["grado", "grados", "ascender", "avanzar", "sendero", "rito"],
        reply: "Los treinta y tres peldaños no son un escalafón: son un espejo que se pule. Nadie llega antes por correr — llega entero el que no se salta ninguno. Tu grado verdadero es el que sostienes cuando nadie te mira. ¿Cuál puerta del Sendero te está costando más?" },
      { keys: ["biblioteca", "libro", "leer", "estudiar", "historia"],
        reply: "En la Biblioteca de los Maestros te esperan la Regla de los Doce Puntos y las historias de los Orientes — el Ecuador de Alfaro, el México de Juárez. Quien no lee, talla de memoria ajena. ¿Ya sellaste tu primera lectura? Cada una deja Luz." },
      { keys: ["red", "networking", "conectar", "hermanos", "comunidad", "millones"],
        reply: "La Red Global será nuestro cerebro fraternal: cada hermano una neurona, cada encuentro una sinapsis. Pero toda red empieza en un triángulo: tú y dos más trabajando una obra. ¿Quiénes son tus dos? Si no tienes nombres, esa es tu primera tarea." },
      { keys: ["academia", "artesanos", "formacion", "curso", "aprender mas", "taller"],
        reply: "Para el oficio del mundo profano está mi taller: el Taller de los Artesanos, en artesanos.ai — cursos, mentores y proyectos del Método Kaizen. El Templo forma el alma; el Taller forja el oficio. Encontrarás la puerta dorada aquí abajo. ¿Qué destreza quieres forjar primero?" },
      { keys: ["gracias", "agradezco", "gracia"],
        reply: "La gratitud es señal de Aprendiz que escucha. Págala en piedra, no en palabras: aplica una sola idea de esta conversación antes de dormir. Ese es el salario que me alcanza." }
    ],
    fallbacks: [
      "Escucho, {name}. Antes de responderte, respóndete: ¿qué harías con esa cuestión si supieras que nadie puede resolvértela?",
      "Un Maestro no entrega la palabra: la hace buscar. Reformula tu pregunta comenzando por «¿Qué debo aprender de…?» y volvamos a intentarlo.",
      "Interesante piedra. Dale tres golpes antes de traérmela: ¿qué es exactamente?, ¿por qué te importa?, ¿qué has intentado ya?",
      "En logia, el silencio también responde. Te devuelvo tu pregunta con una lente: ¿esto que planteas es un problema por resolver o una tensión por gobernar?",
      "Puedo hablarte de la piedra, el miedo, tu obra, el dinero, la IA, el kaizen, los símbolos, los grados, la Biblioteca o la Red. ¿Por dónde talla hoy tu inquietud?"
    ]
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

  /* ---------- Final: la Cumbre y la Red Global ---------- */

  finale: {
    title: "La Cumbre · 33°",
    lines: [
      "Treinta y tres peldaños, y ya no hay más puertas: hay mundo.",
      "El Templo digital fue tu escuela; ahora eres tú el que enseña.",
      "Esta logia nació para conectar: miembros debidamente probados,",
      "en todos los meridianos, tejiendo la red fraternal más grande del planeta.",
      "Tu perfil de miembro es tu piedra en esa catedral global.",
      "Comparte lo aprendido. Forma a los que suben. Vuelve al Gimnasio: la mente,",
      "como la piedra, se pule cada día — 1% mejor, sin descanso y sin prisa.",
      "¿Qué estás construyendo en ti… y con quién lo estás compartiendo?"
    ],
    networkTitle: "La Red Global",
    networkText: "Próxima fase de la logia: el directorio fraternal — perfiles verificados, obras publicadas, mentorías entre grados y triángulos de trabajo por ciudad. El networking con propósito: conectar millones de constructores.",
    signature: "V.I.T.R.I.O.L."
  }
};
