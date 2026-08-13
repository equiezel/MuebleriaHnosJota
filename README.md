# Mueblería Hermanos Jota — E-commerce (front-end)

Sitio de e-commerce para una mueblería artesanal, desarrollado como trabajo práctico (Sprint 1 y 2). Es una experiencia de compra simulada, 100% del lado del cliente: no hay backend, el catálogo se gestiona con JavaScript local.

## Integrantes

- P1 — Nombre y apellido
- P2 — Nombre y apellido
- P3 — Nombre y apellido
- P4 — Nombre y apellido
- P5 — Nombre y apellido

_(Ver reparto detallado de tareas por sprint en [`ORGANIZACION-EQUIPO.md`](./ORGANIZACION-EQUIPO.md))_

## Descripción del proyecto

El sitio permite:

- Ver una página de inicio con productos destacados cargados dinámicamente.
- Recorrer el catálogo completo de productos, con buscador.
- Ver el detalle de cada producto (imagen, descripción, materiales, precio).
- Agregar productos a un carrito simulado, con contador visible en el header.
- Enviar un formulario de contacto con validación en el cliente.

No hay conexión a una base de datos ni servidor: los productos viven en un array de objetos de JavaScript (`js/data.js`) y la carga se simula como si fuera una petición asíncrona real.

## Tecnologías utilizadas

- **HTML5** semántico
- **CSS3** — mobile first, Flexbox, sin frameworks
- **JavaScript** vanilla — manipulación del DOM, `addEventListener`, `async/await` / `setTimeout`, `localStorage` para el carrito
- **Git y GitHub** para el trabajo colaborativo

## Estructura del proyecto

```
mueblería-hermanos-jota/
├── index.html
├── productos.html
├── producto.html
├── contacto.html
├── css/
│   ├── styles.css       (base y variables comunes)
│   ├── home.css
│   ├── catalogo.css
│   ├── producto.css
│   └── contacto.css
├── js/
│   ├── data.js           (array de objetos de productos)
│   ├── main.js            (header, nav, utilidades comunes)
│   ├── carrito.js         (lógica del carrito con localStorage)
│   ├── home.js
│   ├── catalogo.js
│   ├── detalle.js
│   └── contacto.js
├── assets/
│   └── img/
├── README.md
└── ORGANIZACION-EQUIPO.md
```

## Cómo correrlo localmente

No hace falta instalar nada. Alcanza con abrir `index.html` en el navegador, o usar una extensión tipo Live Server para evitar problemas de rutas relativas.

## Sitio desplegado

Completar con el link una vez publicado (GitHub Pages, Netlify o Vercel):

`https://usuario.github.io/mueblería-hermanos-jota/`

## Cómo contribuir (equipo interno)

1. `git pull origin main` antes de arrancar.
2. Crear una rama por tarea: `git checkout -b feature/nombre-de-la-tarea`.
3. Commits chicos y con mensajes claros.
4. Pull Request + revisión de un compañero/a antes de mergear a `main`.

Más detalle de comandos y del reparto de tareas en [`ORGANIZACION-EQUIPO.md`](./ORGANIZACION-EQUIPO.md).
