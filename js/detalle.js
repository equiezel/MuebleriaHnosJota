// Ficha de una pieza. Lee el id de la URL (producto.html?id=...) y arma el detalle.
// El carrito y el formato de precio vienen de js/main.js.

const detalleContainer = document.querySelector("#product-detail");
const idProducto = new URLSearchParams(window.location.search).get("id");

// Sin id no inventamos una pieza: mostramos el error y ofrecemos el catálogo.
const producto = idProducto
  ? productos.find(function (item) {
      return item.id === idProducto;
    })
  : undefined;

// Las claves de especificaciones son minúsculas; en pantalla van con mayúscula
// y con el nombre que usa el taller.
const ETIQUETAS_ESPECIFICACIONES = {
  medidas: "Medidas",
  materiales: "Materiales",
  acabado: "Acabado",
  peso: "Peso",
  capacidad: "Capacidad",
};

function etiquetaDeEspecificacion(clave) {
  if (ETIQUETAS_ESPECIFICACIONES[clave]) {
    return ETIQUETAS_ESPECIFICACIONES[clave];
  }

  // Una clave nueva en data.js sigue mostrándose legible.
  return clave.charAt(0).toUpperCase() + clave.slice(1);
}

/* ── Pieza no encontrada ── */

function mostrarNoEncontrado() {
  detalleContainer.textContent = "";
  detalleContainer.classList.add("product-detail--error");

  const bloque = document.createElement("section");
  bloque.className = "product-error";

  const titulo = document.createElement("h1");
  titulo.textContent = "No encontramos esa pieza";

  const texto = document.createElement("p");
  texto.textContent =
    "Puede que la hayamos retirado del catálogo o que el enlace esté incompleto.";

  const enlace = document.createElement("a");
  enlace.className = "boton boton--primario";
  enlace.href = "productos.html";
  enlace.textContent = "Ver el catálogo";

  bloque.appendChild(titulo);
  bloque.appendChild(texto);
  bloque.appendChild(enlace);
  detalleContainer.appendChild(bloque);
}

/* ── Ficha ── */

function crearGaleria() {
  const galeria = document.createElement("section");
  galeria.className = "product-gallery";

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre + ", " + producto.especificaciones.materiales;
  imagen.width = 1024;
  imagen.height = 1024;
  imagen.fetchPriority = "high";
  imagen.decoding = "async";

  galeria.appendChild(imagen);

  return galeria;
}

function crearControlCantidad() {
  const control = document.createElement("div");
  control.className = "quantity-control";

  const restar = document.createElement("button");
  restar.type = "button";
  restar.className = "quantity-control__boton";
  restar.dataset.cantidad = "restar";
  restar.setAttribute("aria-label", "Quitar una unidad");
  restar.textContent = "−";

  const valor = document.createElement("output");
  valor.id = "quantity";
  valor.className = "quantity-control__valor";
  valor.setAttribute("aria-live", "polite");
  valor.setAttribute("aria-label", "Cantidad");
  valor.textContent = "1";

  const sumar = document.createElement("button");
  sumar.type = "button";
  sumar.className = "quantity-control__boton";
  sumar.dataset.cantidad = "sumar";
  sumar.setAttribute("aria-label", "Sumar una unidad");
  sumar.textContent = "+";

  control.appendChild(restar);
  control.appendChild(valor);
  control.appendChild(sumar);

  return control;
}

function crearEspecificaciones() {
  const bloque = document.createElement("section");
  bloque.className = "specs";
  bloque.setAttribute("aria-labelledby", "specs-title");

  const titulo = document.createElement("h2");
  titulo.id = "specs-title";
  titulo.textContent = "Detalles de la pieza";

  // Una lista de definiciones: cada dato es un par etiqueta/valor.
  const lista = document.createElement("dl");
  lista.className = "spec-list";

  Object.entries(producto.especificaciones).forEach(function (entrada) {
    const fila = document.createElement("div");
    fila.className = "spec-list__item";

    const etiqueta = document.createElement("dt");
    etiqueta.textContent = etiquetaDeEspecificacion(entrada[0]);

    const valor = document.createElement("dd");
    valor.textContent = entrada[1];

    fila.appendChild(etiqueta);
    fila.appendChild(valor);
    lista.appendChild(fila);
  });

  bloque.appendChild(titulo);
  bloque.appendChild(lista);

  return bloque;
}

function crearTextoProducto() {
  const copy = document.createElement("section");
  copy.className = "product-copy";

  const volanta = document.createElement("p");
  volanta.className = "eyebrow product-eyebrow";
  volanta.textContent = producto.destacado
    ? "Selección de la casa"
    : "Pieza de colección";

  const titulo = document.createElement("h1");
  titulo.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.className = "product-description";
  descripcion.textContent = producto.descripcion;

  const precio = document.createElement("p");
  precio.className = "product-price";
  precio.textContent = window.formatearPrecio(producto.precio);

  const fila = document.createElement("div");
  fila.className = "purchase-row";

  const agregar = document.createElement("button");
  agregar.type = "button";
  agregar.className = "add-button";
  agregar.id = "add-to-cart";
  agregar.textContent = "Agregar al carrito";

  fila.appendChild(crearControlCantidad());
  fila.appendChild(agregar);

  const nota = document.createElement("p");
  nota.className = "purchase-note";
  nota.textContent =
    "Envío coordinado a todo el país. Cada pieza se revisa y embala en la Casa Taller.";

  copy.appendChild(volanta);
  copy.appendChild(titulo);
  copy.appendChild(descripcion);
  copy.appendChild(precio);
  copy.appendChild(fila);
  copy.appendChild(nota);

  return copy;
}

function renderizarProducto() {
  detalleContainer.textContent = "";
  detalleContainer.appendChild(crearGaleria());
  detalleContainer.appendChild(crearTextoProducto());
  detalleContainer.appendChild(crearEspecificaciones());

  conectarAcciones();
}

/* ── Interacción ── */

function conectarAcciones() {
  let cantidad = 1;

  const valor = detalleContainer.querySelector("#quantity");
  const agregar = detalleContainer.querySelector("#add-to-cart");
  const restar = detalleContainer.querySelector('[data-cantidad="restar"]');

  function pintarCantidad() {
    valor.value = cantidad;
    valor.textContent = cantidad;
    // En 1 no hay nada que restar: el botón se apaga en vez de no hacer nada.
    restar.disabled = cantidad === 1;
  }

  detalleContainer.querySelectorAll("[data-cantidad]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      if (boton.dataset.cantidad === "sumar") {
        cantidad = Math.min(cantidad + 1, 99);
      } else {
        cantidad = Math.max(1, cantidad - 1);
      }

      pintarCantidad();
    });
  });

  pintarCantidad();

  agregar.addEventListener("click", function () {
    window.agregarAlCarrito(producto, cantidad);

    // Confirmación en el mismo botón y vuelta al texto original.
    agregar.textContent =
      cantidad === 1 ? "Agregada al carrito" : cantidad + " agregadas al carrito";
    agregar.classList.add("is-agregado");

    window.setTimeout(function () {
      agregar.textContent = "Agregar al carrito";
      agregar.classList.remove("is-agregado");
    }, 1800);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (detalleContainer === null) {
    return;
  }

  if (producto === undefined) {
    mostrarNoEncontrado();
    document.title = "Pieza no encontrada | Hermanos Jota";
    return;
  }

  renderizarProducto();
  // La pestaña dice qué pieza se está mirando.
  document.title = producto.nombre + " | Hermanos Jota";
});
