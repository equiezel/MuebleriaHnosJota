# Especificación Técnica y de Diseño: E-commerce Hermanos Jota (v1.0)

Este documento detalla la arquitectura, reglas de negocio, guía de estilos y especificación de datos para el desarrollo del sitio e-commerce de **Mueblería Hermanos Jota** (Sprints 1 y 2).

---

## 🏛️ 1. Arquitectura Frontend & Estructura del Proyecto

El proyecto está diseñado para ejecutarse 100% del lado del cliente (**Vanilla JavaScript, HTML5 semántico y CSS3**), sin dependencias de backend ni bibliotecas externas.

### Estructura de Páginas
* `index.html`: Home principal. Incluye Header con navegación, Hero Banner, sección de 3–4 productos destacados (cargados dinámicamente) y Footer.
* `productos.html`: Catálogo completo con grilla interactiva de productos y campo de búsqueda en tiempo real.
* `producto.html`: Ficha de detalle de producto individual con especificaciones técnicas completas y botón de compra.
* `contacto.html`: Formulario de consulta con validaciones en JS y respuesta dinámica en el DOM.

### Organización de Archivos
```
/
├── index.html
├── productos.html
├── producto.html
├── contacto.html
├── css/
│   └── styles.css
├── js/
│   ├── products.js       # Array de objetos con el catálogo
│   ├── app.js            # Lógica global (Header, Carrito, DOM)
│   ├── catalog.js        # Lógica para catálogo y búsqueda
│   ├── detail.js         # Lógica para la vista de producto
│   └── contact.js        # Validaciones de formulario
└── assets/
    ├── logo/
    └── images/
```

---

## 🎨 2. Sistema de Diseño y Estilos (Brand Identity)

Basado en el **Manual de Marca de Hermanos Jota**:

### Variables CSS (`:root`)
```css
:root {
  /* Paleta de Colores Principal */
  --color-primary: #A0522D;        /* Siena Tostado - Títulos principales, marca */
  --color-secondary: #87A96B;      /* Verde Salvia - Sustentabilidad, badges */
  --color-bg-main: #F5E6D3;        /* Alabastro Cálido - Fondos principales y cards */
  --color-accent-gold: #D4A437;    /* Vara de Oro - Acentos premium, botones CTA */
  --color-accent-rose: #C47A6D;    /* Rosa Polvoriento - Acentos suaves */
  --color-text-dark: #2B2B2B;      /* Texto de cuerpo */
  --color-border-subtle: #E0D0C0;  /* Bordes y divisores */

  /* Tipografías */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Reglas Tipográficas
* **Títulos (`h1`, `h2`, `h3`):** `Playfair Display`. Aplicar mayúsculas y `letter-spacing: 0.1em`.
* **Cuerpo de texto y elementos UI:** `Inter`.
  * Light (`300`): Leyendas y textos secundarios.
  * Regular (`400`): Texto general (line-height: `1.6`).
  * Medium (`500`): Botones, subtítulos y badges.
  * Bold (`700`): Títulos de cards y énfasis.

---

## 📦 3. Estructura del Objeto de Producto

A partir del diseño visual de la ficha de producto ("Aparador Uspallata"), la estructura en `js/products.js` incluye todos los atributos técnicos y descriptivos:

```javascript
const productos = [
  {
    id: "aparador-uspallata",
    nombre: "Aparador Uspallata",
    descripcion: "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón. Su silueta minimalista realza el veteado natural de la madera, creando una pieza que combina funcionalidad y elegancia atemporal para espacios contemporáneos.",
    imagen: "assets/images/aparador-uspallata.webp",
    precio: 185000,
    destacado: true,
    especificaciones: {
      medidas: "180 × 45 × 75 cm",
      materiales: "Nogal macizo FSC®, herrajes de latón",
      acabado: "Aceite natural ecológico",
      peso: "68 kg",
      capacidad: "6 compartimentos interiores"
    }
  }
];
```

---

## ⚙️ 4. Reglas de Negocio y Funcionalidades Clave

1. **Simulación Asíncrona de Carga de Datos:**
   * Las funciones de renderizado deben simular la respuesta de una API mediante `async/await` o `setTimeout` antes de inyectar el contenido en el DOM.

2. **Navegación & Carrito de Compras Simulados:**
   * El Header mantendrá un contador visual de ítems seleccionados.
   * La acción en el botón "Añadir al Carrito" actualizará este contador mediante eventos de JavaScript (`addEventListener`).

3. **Vista de Detalle (`producto.html`):**
   * Muestra la imagen principal del producto en una tarjeta destacada con fondo Alabastro Cálido (`#F5E6D3`).
   * Despliega la tabla/lista de especificaciones técnicas (Medidas, Materiales, Acabado, Peso, Capacidad).

4. **Validación del Formulario de Contacto:**
   * Verificación de campos obligatorios (Nombre, Email, Mensaje).
   * Validación del formato de correo electrónico.
   * Feedback visual inmediato inyectado en el DOM tras el envío exitoso.

5. **Tono y Comunicación:**
   * La redacción del sitio debe reflejar calidez, artesanía y sustentabilidad, destacando detalles como maderas FSC®, acabados ecológicos y producción local.
