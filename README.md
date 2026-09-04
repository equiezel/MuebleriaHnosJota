# Mueblería Hermanos Jota - E-commerce frontend

Sitio web de una mueblería artesanal, desarrollado como trabajo práctico de los Sprints 1 y 2. Es una experiencia de compra simulada que funciona completamente en el navegador: no utiliza backend, base de datos ni servicios de pago.

Repositorio: https://github.com/equiezel/MuebleriaHnosJota

## Integrantes

- P1 - Ramiro Berruezo
- P2 - Augusto Freire
- P3 - Agustin Rivero
- P4 - Ezequiel Monterichel


Los nombres pendientes deben reemplazarse cuando se complete la información del equipo.

## Qué permite hacer

- Ver una página de inicio con la presentación de la marca, el taller y cuatro productos destacados.
- Simular una carga asíncrona de los productos destacados mediante `async/await` y `setTimeout`.
- Recorrer un catálogo de 11 productos.
- Buscar productos por nombre o descripción.
- Consultar el detalle de un producto mediante el parámetro `id` de la URL.
- Ver imagen, descripción, precio y especificaciones técnicas de cada producto.
- Elegir una cantidad y agregar productos al carrito.
- Consultar el carrito desde el encabezado de cualquier página.
- Aumentar, disminuir o eliminar productos del carrito.
- Conservar el carrito en el navegador mediante `localStorage`.
- Completar un formulario de contacto con validación del lado del cliente.

## Tecnologías

- **HTML5** semántico.
- **CSS3** con variables, Flexbox, Grid y diseño responsive mobile-first.
- **JavaScript vanilla**, usando DOM, eventos, `async/await`, `setTimeout` e `Intl.NumberFormat`.
- **`localStorage`** para la persistencia local del carrito.
- **Git y GitHub** para el control de versiones y el trabajo colaborativo.

No se utilizan frameworks, bundlers, dependencias npm ni APIs externas.

## Estructura del proyecto

```
MuebleriaHnosJota/
├── index.html                 # Página de inicio
├── productos.html             # Catálogo y buscador
├── producto.html              # Detalle de un producto
├── contacto.html              # Formulario de contacto
├── css/
│   ├── styles.css             # Estilos y variables globales
│   ├── home.css               # Estilos de la página de inicio
│   ├── catalogo.css           # Estilos del catálogo
│   ├── producto.css           # Estilos del detalle
│   └── contacto.css           # Estilos del formulario
├── js/
│   ├── data.js                # Array local con los productos
│   ├── main.js                # Contador y comportamiento global
│   ├── carrito.js              # Panel y operaciones del carrito
│   ├── home.js                # Productos destacados
│   ├── catalogo.js            # Renderizado y búsqueda
│   ├── detalle.js             # Ficha y compra de un producto
│   └── contacto.js             # Validación del formulario
├── assets/
│   ├── images/                # Imágenes de los productos
│   ├── logo/                  # Logotipos
│   └── catalogo.md            # Catálogo referencial
├── especificacion_hermanos_jota.md
└── README.md
```

## Flujo principal

1. El usuario ingresa a la página de inicio.
2. Puede navegar al catálogo o abrir un producto destacado.
3. En el catálogo puede buscar productos y acceder a sus detalles.
4. Desde una tarjeta o desde el detalle puede agregar unidades al carrito.
5. El contador del encabezado muestra la cantidad total de unidades.
6. El panel del carrito permite modificar cantidades y consultar el subtotal.
7. El usuario puede completar una consulta desde la página de contacto.

## Cómo ejecutarlo

No hace falta instalar dependencias. Se puede abrir `index.html` directamente en el navegador. Para una experiencia más consistente con las rutas relativas, se recomienda utilizar una extensión como Live Server o cualquier servidor HTTP local.

## Alcance actual

El proyecto es una demo frontend. El carrito se guarda únicamente en el navegador actual y no representa una compra real.

Actualmente no están implementados:

- Checkout y procesamiento de pagos.
- Registro o inicio de sesión de usuarios.
- Gestión de stock, pedidos o envíos.
- Persistencia en un servidor o base de datos.
- Envío real del formulario de contacto.

El botón **Finalizar compra** se muestra en el carrito, pero todavía no tiene un flujo asociado.

## Estado de la documentación

La especificación técnica y el archivo `assets/catalogo.md` son documentos de referencia. Los datos que utiliza la aplicación son los definidos actualmente en `js/data.js`, que es la fuente efectiva del catálogo.

El archivo `ORGANIZACION-EQUIPO.md` no forma parte del repositorio actual; por eso el reparto de tareas no se documenta aquí mediante un enlace externo.

## Contribución

1. Actualizar la rama local con `git pull origin main`.
2. Crear una rama descriptiva, por ejemplo `git checkout -b feature/nombre-de-la-tarea`.
3. Realizar commits pequeños y claros.
4. Abrir un Pull Request y solicitar la revisión de otro integrante antes de fusionar los cambios.

