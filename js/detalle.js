// Ficha de una pieza. Lee el id de la URL (producto.html?id=...) y arma el detalle.
// El carrito, el formato de precio y la espera simulada vienen de js/main.js.

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

/* ── Carga ── */

// Bloques vacíos con la forma de la ficha real, para que la página no salte
// cuando entra el contenido.
function mostrarEsqueletoFicha() {
  detalleContainer.textContent = "";
  detalleContainer.setAttribute("aria-busy", "true");

  const galeria = document.createElement("div");
  galeria.className = "product-gallery product-gallery--esqueleto";
  galeria.setAttribute("aria-hidden", "true");

  const copy = document.createElement("div");
  copy.className = "product-copy";
  copy.setAttribute("aria-hidden", "true");

  // Volanta, título, dos de descripción y precio.
  const anchos = ["--corta", "--media", "", "", "--corta"];

  anchos.forEach(function (modificador) {
    const linea = document.createElement("p");
    linea.className = "esqueleto-linea";

    if (modificador !== "") {
      linea.classList.add("esqueleto-linea" + modificador);
    }

    copy.appendChild(linea);
  });

  detalleContainer.appendChild(galeria);
  detalleContainer.appendChild(copy);
}

/* ── Pieza no encontrada ── */

function mostrarNoEncontrado() {
  detalleContainer.textContent = "";
  detalleContainer.setAttribute("aria-busy", "false");
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
  detalleContainer.setAttribute("aria-busy", "false");
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
  const sumar = detalleContainer.querySelector('[data-cantidad="sumar"]');

  function pintarCantidad() {
    valor.value = cantidad;
    valor.textContent = cantidad;
    // En 1 no hay nada que restar y en el tope no hay nada que sumar: los
    // botones se apagan en vez de no hacer nada.
    restar.disabled = cantidad === 1;
    sumar.disabled = cantidad === window.CARRITO_MAXIMO_POR_PIEZA;
  }

  detalleContainer.querySelectorAll("[data-cantidad]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      if (boton.dataset.cantidad === "sumar") {
        cantidad = Math.min(cantidad + 1, window.CARRITO_MAXIMO_POR_PIEZA);
      } else {
        cantidad = Math.max(1, cantidad - 1);
      }

      pintarCantidad();
    });
  });

  pintarCantidad();

  agregar.addEventListener("click", function () {
    const agregadas = window.agregarAlCarrito(producto, cantidad);

    // Confirmación en el mismo botón y vuelta al texto original. Decimos las
    // que entraron, no las que se pidieron: con el carrito en el tope pueden
    // ser menos, o ninguna.
    if (agregadas === 0) {
      agregar.textContent = "Ya tenés el máximo";
    } else if (agregadas === 1) {
      agregar.textContent = "Agregada al carrito";
    } else {
      agregar.textContent = agregadas + " agregadas al carrito";
    }

    agregar.classList.add("is-agregado");

    window.setTimeout(function () {
      agregar.textContent = "Agregar al carrito";
      agregar.classList.remove("is-agregado");
    }, 1800);
  });
}

// La ficha simula la respuesta de una API: esqueleto, espera y recién ahí el
// contenido. El "no encontramos esa pieza" también espera, porque en el sitio
// real esa respuesta la daría el servidor.
document.addEventListener("DOMContentLoaded", async function () {
  if (detalleContainer === null) {
    return;
  }

  mostrarEsqueletoFicha();

  await window.esperar(window.DEMORA_SIMULADA);

  if (producto === undefined) {
    mostrarNoEncontrado();
    document.title = "Pieza no encontrada | Hermanos Jota";
    return;
  }

  renderizarProducto();
  // La pestaña dice qué pieza se está mirando.
  document.title = producto.nombre + " | Hermanos Jota";
});
