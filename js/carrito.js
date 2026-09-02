// Panel lateral del carrito. Se arma una sola vez al cargar la página y se
// muestra u oculta con el botón del header.
//
// El almacén (leer, guardar, sumar, contar) está en js/main.js: acá solo se dibuja.

const CARRITO_MAXIMO_POR_PIEZA = 99;

let panelCarrito = null;
let fondoCarrito = null;
// Para devolver el foco a donde estaba cuando se cierra el panel.
let focoPrevio = null;

/* ── Armado ── */

// Crea el panel vacío y lo deja oculto en el DOM.
function construirPanelCarrito() {
  fondoCarrito = document.createElement("div");
  fondoCarrito.className = "cart-overlay";
  fondoCarrito.hidden = true;

  panelCarrito = document.createElement("aside");
  panelCarrito.className = "cart-panel";
  panelCarrito.setAttribute("role", "dialog");
  panelCarrito.setAttribute("aria-modal", "true");
  panelCarrito.setAttribute("aria-labelledby", "cart-panel-titulo");
  panelCarrito.hidden = true;

  const encabezado = document.createElement("div");
  encabezado.className = "cart-panel__header";

  const titulo = document.createElement("h2");
  titulo.id = "cart-panel-titulo";
  titulo.textContent = "Tu carrito";

  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "cart-panel__close";
  cerrar.setAttribute("aria-label", "Cerrar el carrito");
  cerrar.textContent = "×";

  encabezado.appendChild(titulo);
  encabezado.appendChild(cerrar);

  const items = document.createElement("div");
  items.className = "cart-panel__items";

  const pie = document.createElement("div");
  pie.className = "cart-panel__footer";

  panelCarrito.appendChild(encabezado);
  panelCarrito.appendChild(items);
  panelCarrito.appendChild(pie);

  document.body.appendChild(fondoCarrito);
  document.body.appendChild(panelCarrito);

  fondoCarrito.addEventListener("click", cerrarCarrito);
  cerrar.addEventListener("click", cerrarCarrito);

  // Un clic en cualquier control de una línea: no hace falta un listener por botón.
  items.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-accion]");

    if (boton === null) {
      return;
    }

    const id = boton.dataset.id;

    if (boton.dataset.accion === "sumar") {
      cambiarCantidad(id, 1);
    } else if (boton.dataset.accion === "restar") {
      cambiarCantidad(id, -1);
    } else if (boton.dataset.accion === "quitar") {
      quitarDelCarrito(id);
    }
  });
}

/* ── Dibujado ── */

// Una línea del carrito.
function crearLineaCarrito(item) {
  const linea = document.createElement("article");
  linea.className = "cart-item";

  const imagen = document.createElement("img");
  imagen.className = "cart-item__image";
  imagen.src = item.imagen;
  imagen.alt = "";
  imagen.loading = "lazy";
  imagen.decoding = "async";

  const cuerpo = document.createElement("div");
  cuerpo.className = "cart-item__content";

  const nombre = document.createElement("h3");
  nombre.className = "cart-item__nombre";
  nombre.textContent = item.nombre;

  const unitario = document.createElement("p");
  unitario.className = "cart-item__price";
  unitario.textContent = window.formatearPrecio(item.precio) + " c/u";

  const controles = document.createElement("div");
  controles.className = "cart-item__controls";

  const restar = document.createElement("button");
  restar.type = "button";
  restar.className = "qty-btn";
  restar.dataset.accion = "restar";
  restar.dataset.id = item.id;
  restar.setAttribute("aria-label", "Quitar una unidad de " + item.nombre);
  restar.textContent = "−";

  const cantidad = document.createElement("span");
  cantidad.className = "qty-value";
  cantidad.textContent = item.cantidad;

  const sumar = document.createElement("button");
  sumar.type = "button";
  sumar.className = "qty-btn";
  sumar.dataset.accion = "sumar";
  sumar.dataset.id = item.id;
  sumar.setAttribute("aria-label", "Sumar una unidad de " + item.nombre);
  sumar.textContent = "+";
  sumar.disabled = item.cantidad >= CARRITO_MAXIMO_POR_PIEZA;

  const quitar = document.createElement("button");
  quitar.type = "button";
  quitar.className = "cart-item__remove";
  quitar.dataset.accion = "quitar";
  quitar.dataset.id = item.id;
  quitar.setAttribute("aria-label", "Sacar " + item.nombre + " del carrito");
  quitar.textContent = "Eliminar";

  controles.appendChild(restar);
  controles.appendChild(cantidad);
  controles.appendChild(sumar);
  controles.appendChild(quitar);

  const total = document.createElement("p");
  total.className = "cart-item__total";
  total.textContent = window.formatearPrecio(item.precio * item.cantidad);

  cuerpo.appendChild(nombre);
  cuerpo.appendChild(unitario);
  cuerpo.appendChild(controles);
  cuerpo.appendChild(total);

  linea.appendChild(imagen);
  linea.appendChild(cuerpo);

  return linea;
}

// Estado vacío: no es un error, así que invita a seguir mirando.
function crearCarritoVacio() {
  const vacio = document.createElement("div");
  vacio.className = "cart-empty";

  const texto = document.createElement("p");
  texto.textContent = "Todavía no elegiste ninguna pieza.";

  const enlace = document.createElement("a");
  enlace.className = "boton boton--secundario";
  enlace.href = "productos.html";
  enlace.textContent = "Ver el catálogo";

  vacio.appendChild(texto);
  vacio.appendChild(enlace);

  return vacio;
}

function renderizarCarrito() {
  if (panelCarrito === null) {
    return;
  }

  const items = panelCarrito.querySelector(".cart-panel__items");
  const pie = panelCarrito.querySelector(".cart-panel__footer");
  const carrito = window.obtenerCarrito();

  items.textContent = "";
  pie.textContent = "";

  if (carrito.length === 0) {
    items.appendChild(crearCarritoVacio());
    return;
  }

  carrito.forEach(function (item) {
    items.appendChild(crearLineaCarrito(item));
  });

  const subtotal = carrito.reduce(function (total, item) {
    return total + item.precio * item.cantidad;
  }, 0);

  const resumen = document.createElement("div");
  resumen.className = "cart-summary";

  const etiqueta = document.createElement("span");
  etiqueta.textContent = "Subtotal";

  const monto = document.createElement("strong");
  monto.textContent = window.formatearPrecio(subtotal);

  resumen.appendChild(etiqueta);
  resumen.appendChild(monto);

  const aviso = document.createElement("p");
  aviso.className = "cart-summary__nota";
  aviso.textContent = "El envío se coordina por WhatsApp una vez confirmado el pedido.";

  const finalizar = document.createElement("button");
  finalizar.type = "button";
  finalizar.className = "boton boton--primario cart-panel__finalizar";
  finalizar.textContent = "Finalizar compra";

  // Es una compra simulada: no hay checkout detrás, y conviene decirlo.
  finalizar.addEventListener("click", function () {
    finalizar.disabled = true;
    finalizar.textContent = "Te escribimos para coordinar";
  });

  pie.appendChild(resumen);
  pie.appendChild(aviso);
  pie.appendChild(finalizar);
}

/* ── Cantidades ── */

function cambiarCantidad(id, delta) {
  const carrito = window.obtenerCarrito();
  const item = carrito.find(function (linea) {
    return linea.id === id;
  });

  if (item === undefined) {
    return;
  }

  const nueva = Number(item.cantidad) + delta;

  if (nueva <= 0) {
    quitarDelCarrito(id);
    return;
  }

  item.cantidad = Math.min(nueva, CARRITO_MAXIMO_POR_PIEZA);
  window.guardarCarrito(carrito);
  window.actualizarContadorCarrito();
  renderizarCarrito();
}

function quitarDelCarrito(id) {
  const carrito = window.obtenerCarrito().filter(function (item) {
    return item.id !== id;
  });

  window.guardarCarrito(carrito);
  window.actualizarContadorCarrito();
  renderizarCarrito();
}

/* ── Abrir y cerrar ── */

function abrirCarrito() {
  if (panelCarrito === null) {
    return;
  }

  focoPrevio = document.activeElement;

  renderizarCarrito();

  fondoCarrito.hidden = false;
  panelCarrito.hidden = false;

  // Un cuadro para que la transición arranque desde el estado cerrado.
  window.requestAnimationFrame(function () {
    fondoCarrito.classList.add("is-visible");
    panelCarrito.classList.add("is-open");
  });

  document.body.classList.add("cart-open");
  panelCarrito.querySelector(".cart-panel__close").focus();
}

function cerrarCarrito() {
  if (panelCarrito === null || panelCarrito.hidden) {
    return;
  }

  fondoCarrito.classList.remove("is-visible");
  panelCarrito.classList.remove("is-open");
  document.body.classList.remove("cart-open");

  // Se oculta recién cuando termina de deslizarse, para no cortar la transición.
  window.setTimeout(function () {
    fondoCarrito.hidden = true;
    panelCarrito.hidden = true;
  }, 250);

  if (focoPrevio !== null && typeof focoPrevio.focus === "function") {
    focoPrevio.focus();
  }
}

// Escape cierra, y el tabulador no se escapa del panel mientras está abierto.
document.addEventListener("keydown", function (evento) {
  if (panelCarrito === null || panelCarrito.hidden) {
    return;
  }

  if (evento.key === "Escape") {
    cerrarCarrito();
    return;
  }

  if (evento.key !== "Tab") {
    return;
  }

  const focadles = panelCarrito.querySelectorAll(
    "button:not(:disabled), a[href]"
  );

  if (focadles.length === 0) {
    return;
  }

  const primero = focadles[0];
  const ultimo = focadles[focadles.length - 1];

  if (evento.shiftKey && document.activeElement === primero) {
    evento.preventDefault();
    ultimo.focus();
  } else if (evento.shiftKey === false && document.activeElement === ultimo) {
    evento.preventDefault();
    primero.focus();
  }
});

document.addEventListener("DOMContentLoaded", construirPanelCarrito);

window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.renderizarCarrito = renderizarCarrito;
