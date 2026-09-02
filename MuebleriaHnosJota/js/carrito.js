function crearMarkupCarrito() {
  const carrito = obtenerCarrito();

  if (!carrito.length) {
    return `
      <div class="cart-empty">
        <p>Tu carrito está vacío por ahora.</p>
        <a href="productos.html" class="btn btn--secondary">Ver catálogo</a>
      </div>
    `;
  }

  const subtotal = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const items = carrito
    .map(
      (item) => `
        <article class="cart-item" data-id="${item.id}">
          <img class="cart-item__image" src="${item.imagen}" alt="${item.nombre}" />
          <div class="cart-item__content">
            <h3>${item.nombre}</h3>
            <p class="cart-item__price">${formatearPrecio(item.precio)}</p>
            <div class="cart-item__controls">
              <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Disminuir cantidad">−</button>
              <span class="qty-value">${item.cantidad}</span>
              <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
              <button type="button" class="cart-item__remove" data-action="remove" data-id="${item.id}">Eliminar</button>
            </div>
          </div>
          <div class="cart-item__total">${formatearPrecio(item.precio * item.cantidad)}</div>
        </article>
      `
    )
    .join("");

  return `
    ${items}
    <div class="cart-summary">
      <span>Subtotal</span>
      <strong>${formatearPrecio(subtotal)}</strong>
    </div>
  `;
}

function abrirCarrito() {
  const overlay = document.querySelector(".cart-overlay");
  const panel = document.querySelector(".cart-panel");

  if (!overlay || !panel) {
    const root = document.body;
    root.insertAdjacentHTML(
      "beforeend",
      `
        <div class="cart-overlay is-visible" aria-hidden="false"></div>
        <aside class="cart-panel is-open" aria-label="Carrito de compras">
          <div class="cart-panel__header">
            <h2>Mi carrito</h2>
            <button type="button" class="cart-panel__close" aria-label="Cerrar carrito">×</button>
          </div>
          <div class="cart-panel__items"></div>
          <div class="cart-panel__footer">
            <button type="button" class="btn btn--primary">Finalizar compra</button>
          </div>
        </aside>
      `
    );

    const nuevoOverlay = document.querySelector(".cart-overlay");
    const nuevoPanel = document.querySelector(".cart-panel");
    const cerrar = nuevoPanel.querySelector(".cart-panel__close");

    nuevoOverlay.addEventListener("click", cerrarCarrito);
    cerrar.addEventListener("click", cerrarCarrito);

    document.body.classList.add("cart-open");
    renderizarCarrito();
    return;
  }

  overlay.classList.add("is-visible");
  panel.classList.add("is-open");
  document.body.classList.add("cart-open");
  renderizarCarrito();
}

function cerrarCarrito() {
  const overlay = document.querySelector(".cart-overlay");
  const panel = document.querySelector(".cart-panel");

  if (!overlay || !panel) return;

  overlay.classList.remove("is-visible");
  panel.classList.remove("is-open");
  document.body.classList.remove("cart-open");
}

function actualizarCantidadCarrito(id, delta) {
  const carrito = obtenerCarrito();
  const producto = carrito.find((item) => item.id === id);

  if (!producto) return;

  producto.cantidad += delta;

  if (producto.cantidad <= 0) {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    guardarCarrito(nuevoCarrito);
  } else {
    guardarCarrito(carrito);
  }

  actualizarContadorCarrito();
  renderizarCarrito();
}

function quitarProductoCarrito(id) {
  const carrito = obtenerCarrito().filter((item) => item.id !== id);
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  renderizarCarrito();
}

function bindearAccionesCarrito() {
  const panel = document.querySelector(".cart-panel");
  if (!panel) return;

  const items = panel.querySelector(".cart-panel__items");

  if (!items) return;

  items.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const { action, id } = button.dataset;

      if (action === "increase") {
        actualizarCantidadCarrito(id, 1);
      }

      if (action === "decrease") {
        actualizarCantidadCarrito(id, -1);
      }

      if (action === "remove") {
        quitarProductoCarrito(id);
      }
    });
  });
}

function renderizarCarrito() {
  const panel = document.querySelector(".cart-panel");
  if (!panel) return;

  const itemsContainer = panel.querySelector(".cart-panel__items");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = crearMarkupCarrito();
  bindearAccionesCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".cart-overlay");
  const panel = document.querySelector(".cart-panel");

  if (overlay) {
    overlay.addEventListener("click", cerrarCarrito);
  }

  if (panel) {
    const closeButton = panel.querySelector(".cart-panel__close");
    if (closeButton) {
      closeButton.addEventListener("click", cerrarCarrito);
    }
  }

  renderizarCarrito();
});

window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.renderizarCarrito = renderizarCarrito;
