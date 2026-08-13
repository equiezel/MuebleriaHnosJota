const CART_KEY = "hj_carrito";

function simularCarga(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(precio);
}

function obtenerCarrito() {
  try {
    const datos = localStorage.getItem(CART_KEY);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
}

function guardarCarrito(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function contarItemsCarrito() {
  return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

function actualizarContadorCarrito() {
  const contador = document.querySelector(".cart-count");
  if (contador) {
    const total = contarItemsCarrito();
    contador.textContent = total;
    contador.hidden = total === 0;
  }
}

function agregarAlCarrito(productoId) {
  const producto = productos.find((p) => p.id === productoId);
  if (!producto) return;

  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.id === productoId);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
    });
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
}

async function obtenerProductos() {
  await simularCarga();
  return [...productos];
}

async function obtenerProductoPorId(id) {
  await simularCarga();
  return productos.find((p) => p.id === id) || null;
}

function crearTarjetaProducto(producto) {
  const badge = producto.destacado
    ? '<span class="badge badge--sustainability">FSC® Certificado</span>'
    : "";

  return `
    <article class="product-card" data-id="${producto.id}">
      <a href="producto.html?id=${producto.id}" class="product-card__link">
        <div class="product-card__image-wrap">
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />
          ${badge}
        </div>
        <div class="product-card__body">
          <h3 class="product-card__title">${producto.nombre}</h3>
          <p class="product-card__price">${formatearPrecio(producto.precio)}</p>
        </div>
      </a>
      <div class="product-card__actions">  
        <button type="button" class="btn btn--secondary btn--sm btn-add-cart" data-id="${producto.id}">
          Añadir al Carrito
        </button>
      </div>
    </article>
  `;
}

function inicializarBotonesCarrito(contenedor) {
  contenedor.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      agregarAlCarrito(btn.dataset.id);
      btn.textContent = "¡Agregado!";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "Añadir al Carrito";
        btn.disabled = false;
      }, 1500);
    });
  });
}

function renderizarHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const paginaActual = document.body.dataset.page || "";

  header.innerHTML = `
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="Hermanos Jota — Inicio">
        <img src="assets/logo/logo.svg" alt="Hermanos Jota" width="140" height="40" />
      </a>
      <button type="button" class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="main-nav" aria-label="Navegación principal">
        <ul class="nav-list">
          <li><a href="index.html" class="${paginaActual === "home" ? "active" : ""}">Inicio</a></li>
          <li><a href="productos.html" class="${paginaActual === "productos" ? "active" : ""}">Productos</a></li>
          <li><a href="contacto.html" class="${paginaActual === "contacto" ? "active" : ""}">Contacto</a></li>
        </ul>
      </nav>
      <button type="button" class="cart-btn" aria-label="Carrito de compras">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6h15l-1.5 9H7.5L6 6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
          <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
          <path d="M6 6L5 3H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="cart-count" hidden>0</span>
      </button>
    </div>
  `;

  const toggle = header.querySelector(".nav-toggle");
  const nav = header.querySelector(".main-nav");

  toggle.addEventListener("click", () => {
    const abierto = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(abierto));
  });

  actualizarContadorCarrito();
}

function renderizarFooter() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="assets/logo/logo.svg" alt="Hermanos Jota" width="120" height="34" />
        <p>Cada pieza cuenta la historia de manos expertas y materiales nobles. Madera certificada FSC®, acabados ecológicos y producción local en Buenos Aires.</p>
      </div>
      <div class="footer-col">
        <h4>Showroom</h4>
        <p>Av. San Juan 2847<br>San Cristóbal, CABA</p>
        <p>Lun–Vie 10:00–19:00<br>Sáb 10:00–14:00</p>
      </div>
      <div class="footer-col">
        <h4>Contacto</h4>
        <p><a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a></p>
        <p><a href="mailto:ventas@hermanosjota.com.ar">ventas@hermanosjota.com.ar</a></p>
        <p>+54 11 4567-8900</p>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Hermanos Jota Muebles. Programa Herencia Viva — garantía extendida 10 años.</p>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarHeader();
  renderizarFooter();
});
