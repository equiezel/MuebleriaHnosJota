const productos = [
  {
    id: "aparador-uspallata",
    nombre: "Aparador Uspallata",
    descripcion:
      "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón. Su silueta minimalista realza el veteado natural de la madera, creando una pieza que combina funcionalidad y elegancia atemporal para espacios contemporáneos.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Aparador%20Uspallata.png",
    precio: 185000,
    destacado: true,
    especificaciones: {
      medidas: "180 × 45 × 75 cm",
      materiales: "Nogal macizo FSC®, herrajes de latón",
      acabado: "Aceite natural ecológico",
      peso: "68 kg",
      capacidad: "6 compartimentos interiores",
    },
  },
  {
    id: "biblioteca-recoleta",
    nombre: "Biblioteca Recoleta",
    descripcion:
      "Estantería modular de cinco niveles en algarrobo certificado FSC®, pensada para colecciones que crecen con el tiempo. Cada repisa respeta la curvatura natural de la madera, aportando calidez y orden a salas de lectura y estudios.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Biblioteca%20Recoleta.png",
    precio: 142000,
    destacado: true,
    especificaciones: {
      medidas: "120 × 35 × 200 cm",
      materiales: "Algarrobo macizo FSC®, uniones encoladas de bajo COV",
      acabado: "Aceite de lino prensado en frío",
      peso: "52 kg",
      capacidad: "5 repisas ajustables",
    },
  },
  {
    id: "sofa-patagonia",
    nombre: "Sofá Patagonia",
    descripcion:
      "Sofá de tres cuerpos con estructura en quebracho y tapizado en lino orgánico tejido localmente. Su profundidad generosa invita al descanso, mientras los acabados ecológicos garantizan una pieza que envejece con gracia en el corazón del hogar.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Sofá%20Patagonia.png",
    precio: 298000,
    destacado: true,
    especificaciones: {
      medidas: "220 × 95 × 85 cm",
      materiales: "Quebracho FSC®, lino orgánico, espuma de origen vegetal",
      acabado: "Tinte vegetal base agua",
      peso: "78 kg",
      capacidad: "3 plazas",
    },
  },
  {
    id: "mesa-comedor-pampa",
    nombre: "Mesa Comedor Pampa",
    descripcion:
      "Mesa extensible para seis comensales, elaborada en caldén de bosques responsables argentinos. Su tablero macizo celebra el veteado natural y se complementa con patas torneadas a mano en nuestro taller de San Cristóbal.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Mesa%20Comedor%20Pampa.png",
    precio: 215000,
    destacado: true,
    especificaciones: {
      medidas: "160–220 × 90 × 76 cm",
      materiales: "Caldén macizo FSC®, herrajes extensibles de acero",
      acabado: "Cera de abejas de origen local",
      peso: "64 kg",
      capacidad: "6–8 comensales",
    },
  },
  {
    id: "sillon-copacabana",
    nombre: "Sillón Copacabana",
    descripcion:
      "Butaca de diseño retro con respaldo envolvente y base en madera curvada. Una reinterpretación nostálgica de los clásicos años 60, fabricada con materiales recuperados y acabados de bajo impacto ambiental.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Sillón%20Copacabana.png",
    precio: 168000,
    destacado: false,
    especificaciones: {
      medidas: "75 × 80 × 90 cm",
      materiales: "Madera recuperada, tapizado en algodón orgánico",
      acabado: "Aceite natural ecológico",
      peso: "22 kg",
      capacidad: "1 plaza",
    },
  },
  {
    id: "escritorio-costa",
    nombre: "Escritorio Costa",
    descripcion:
      "Escritorio compacto con cajón integrado y pasacables oculto. Ideal para espacios de trabajo en casa, combina la solidez del roble certificado con líneas limpias que favorecen la concentración y el orden.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Escritorio%20Costa.png",
    precio: 98000,
    destacado: false,
    especificaciones: {
      medidas: "120 × 60 × 75 cm",
      materiales: "Roble FSC®, herrajes ocultos de acero inoxidable",
      acabado: "Aceite de lino 100% natural",
      peso: "38 kg",
      capacidad: "1 cajón + superficie de trabajo",
    },
  },
  {
    id: "mesa-centro-araucaria",
    nombre: "Mesa de Centro Araucaria",
    descripcion:
      "Mesa baja de líneas suaves con doble nivel, perfecta para living contemporáneos. El nogal claro aporta luminosidad al espacio mientras la producción local reduce la huella de carbono de cada unidad.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Mesa%20de%20Centro%20Araucaria.png",
    precio: 72000,
    destacado: false,
    especificaciones: {
      medidas: "110 × 60 × 42 cm",
      materiales: "Nogal claro FSC®, base de acero reciclado",
      acabado: "Aceite natural ecológico",
      peso: "18 kg",
      capacidad: "Doble nivel de apoyo",
    },
  },
  {
    id: "mesa-noche-aconcagua",
    nombre: "Mesa de Noche Aconcagua",
    descripcion:
      "Par de mesas de luz con cajón silencioso y repisa superior amplia. Diseñadas en pareja, reflejan la artesanía local con maderas nativas seleccionadas una a una en nuestro proceso de curado.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Mesa%20de%20Noche%20Aconcagua.png",
    precio: 54000,
    destacado: false,
    especificaciones: {
      medidas: "45 × 40 × 55 cm (c/u)",
      materiales: "Algarrobo FSC®, correderas ocultas",
      acabado: "Cera de abejas certificada",
      peso: "12 kg c/u",
      capacidad: "1 cajón + repisa superior",
    },
  },
  {
    id: "butaca-mendoza",
    nombre: "Butaca Mendoza",
    descripcion:
      "Butaca tapizada con respaldo medio y patas cónicas en madera torneada. Una pieza versátil que acompaña rincones de lectura y dormitorios con la calidez de la artesanía argentina y fibras naturales.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Butaca%20Mendoza.png",
    precio: 89000,
    destacado: false,
    especificaciones: {
      medidas: "70 × 75 × 85 cm",
      materiales: "Pata de madera en caldén FSC®, tapizado en lana local",
      acabado: "Tinte vegetal base agua",
      peso: "15 kg",
      capacidad: "1 plaza",
    },
  },
  {
    id: "silla-trabajo-belgrano",
    nombre: "Silla de Trabajo Belgrano",
    descripcion:
      "Silla ergonómica de respaldo curvo y asiento acolchado en lino. Pensada para jornadas prolongadas frente al escritorio, une confort y sustentabilidad con una silueta que honra el diseño mid-century.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Silla%20de%20Trabajo%20Belgrano.png",
    precio: 76000,
    destacado: false,
    especificaciones: {
      medidas: "48 × 52 × 82 cm",
      materiales: "Madera curvada FSC®, tapizado en lino orgánico",
      acabado: "Aceite de lino prensado en frío",
      peso: "8 kg",
      capacidad: "1 plaza",
    },
  },
  {
    id: "sillas-cordoba",
    nombre: "Sillas Córdoba",
    descripcion:
      "Set de cuatro sillas apilables con respaldo de listones verticales. Livianas pero robustas, son el complemento ideal para la Mesa Comedor Pampa y representan la versatilidad de la madera nativa en espacios conviviales.",
    imagen:
      "https://b3rzvs.github.io/imagenes_muebleria_hermanosJota/Sillas%20Córdoba.png",
    precio: 112000,
    destacado: false,
    especificaciones: {
      medidas: "45 × 50 × 88 cm (c/u)",
      materiales: "Caldén FSC®, unión encolada de bajo COV",
      acabado: "Aceite natural ecológico",
      peso: "5 kg c/u",
      capacidad: "Set de 4 sillas apilables",
    },
  },
];
