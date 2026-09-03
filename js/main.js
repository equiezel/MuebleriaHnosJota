// Lógica común a las cuatro páginas: navegación activa, formato de precios
// y el almacén del carrito.
//
// El panel del carrito vive en js/carrito.js y usa las funciones de acá.
// Orden de carga en el HTML: data.js -> main.js -> carrito.js -> script de la página.

// Única clave de localStorage del sitio. Si se cambia acá, se cambia en todos lados.
const CLAVE_CARRITO = "carritoHermanosJota";

// Tope de unidades por pieza. Vive acá, junto al almacén, para que el panel y
// las dos páginas que agregan al carrito respeten el mismo límite.
const CARRITO_MAXIMO_POR_PIEZA = 99;

const botonCarrito = document.getElementById("boton-carrito");
const contadorCarrito = document.getElementById("contador-carrito");

/* ── Navegación ── */

// Marca en el header el enlace de la página que se está viendo.
// Antes la clase venía escrita a mano en cada HTML y quedaba siempre en Inicio.
function marcarNavegacionActiva() {
  const enlaces = document.querySelectorAll(".nav-principal__lista a");

  if (enlaces.length === 0) {
    return;
  }

  // Servido desde una carpeta, la URL puede terminar en "/" en vez de "/index.html".
  let paginaActual = window.location.pathname.split("/").pop();

  if (paginaActual === "") {
    paginaActual = "index.html";
  }

  // La ficha de una pieza es parte del catálogo, así que se ilumina "Catálogo".
  if (paginaActual === "producto.html") {
    paginaActual = "productos.html";
  }

  enlaces.forEach(function (enlace) {
    const destino = enlace.getAttribute("href");

    if (destino === paginaActual) {
      enlace.classList.add("is-activa");
      enlace.setAttribute("aria-current", "page");
    } else {
      enlace.classList.remove("is-activa");
      enlace.removeAttribute("aria-current");
    }
  });
}

/* ── Precios ── */

// 185000 -> "$ 185.000". Un solo formato para todo el sitio.
function formatearPrecio(precio) {
  // null, undefined y la cadena vacía se convierten en 0 sin chistar, así que
  // se descartan antes de mirar el número: sin dato no hay precio que mostrar.
  if (precio === null || precio === undefined || String(precio).trim() === "") {
    return "Precio a consultar";
  }

  const numero = Number(precio);

  if (Number.isFinite(numero) === false) {
    return "Precio a consultar";
  }

  return "$ " + numero.toLocaleString("es-AR", { maximumFractionDigits: 0 });
}

/* ── Carga simulada ── */

// Cuánto tarda la carga simulada, en milisegundos. Un solo valor para las tres
// páginas que dibujan datos, así la espera se siente igual en todo el sitio.
const DEMORA_SIMULADA = 800;

// Promesa que se resuelve después de los milisegundos pedidos. Con await
// delante, frena el render hasta que pasa la demora, como si contestara un
// servidor. Cuando exista la API de verdad, se reemplaza por el fetch.
function esperar(milisegundos) {
  return new Promise(function (resolve) {
    setTimeout(resolve, milisegundos);
  });
}

/* ── Almacén del carrito ── */

// Una cantidad guardada puede venir rota, con decimales o de una versión vieja
// sin tope. Devuelve siempre un entero usable entre 1 y el máximo.
function normalizarCantidad(valor) {
  const cantidad = Number(valor);

  if (Number.isFinite(cantidad) === false || cantidad < 1) {
    return 1;
  }

  return Math.min(Math.floor(cantidad), CARRITO_MAXIMO_POR_PIEZA);
}

// Devuelve siempre un array, aunque lo guardado esté roto o no exista.
function obtenerCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);

  if (guardado === null) {
    return [];
  }

  try {
    const carrito = JSON.parse(guardado);

    if (Array.isArray(carrito) === false) {
      return [];
    }

    // Filtramos lo que no sirva para dibujar una línea y dejamos la cantidad
    // en un número usable. Normalizar acá, a la entrada, es lo que hace que el
    // panel, el contador y los totales digan siempre lo mismo.
    return carrito
      .filter(function (item) {
        return item !== null && typeof item === "object" && typeof item.id === "string";
      })
      .map(function (item) {
        item.cantidad = normalizarCantidad(item.cantidad);
        return item;
      });
  } catch (error) {
    console.error("No se pudo leer el carrito guardado:", error);
    return [];
  }
}

function guardarCarrito(carrito) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (error) {
    // Pasa en modo incógnito o con el almacenamiento lleno.
    console.error("No se pudo guardar el carrito:", error);
  }
}

// Cuántas unidades hay en total, sumando las cantidades de cada línea.
function contarUnidadesDelCarrito() {
  return obtenerCarrito().reduce(function (unidades, item) {
    return unidades + item.cantidad;
  }, 0);
}

// Suma una pieza al carrito. Si ya estaba, le suma la cantidad.
// Devuelve cuántas unidades entraron de verdad, que puede ser menos de las
// pedidas si la línea llegó al tope: quien llama avisa eso y no lo que pidió.
function agregarAlCarrito(producto, cantidad) {
  const unidades = Number(cantidad) > 0 ? Math.floor(Number(cantidad)) : 1;
  const carrito = obtenerCarrito();
  const existente = carrito.find(function (item) {
    return item.id === producto.id;
  });
  let agregadas = 0;

  if (existente) {
    // Se capa acá y no solo en la UI: si no, el panel muestra el "+" apagado
    // pero la cantidad guardada ya se pasó del tope.
    const previa = existente.cantidad;

    existente.cantidad = Math.min(previa + unidades, CARRITO_MAXIMO_POR_PIEZA);
    agregadas = existente.cantidad - previa;
  } else {
    agregadas = Math.min(unidades, CARRITO_MAXIMO_POR_PIEZA);

    // Guardamos solo lo que el panel necesita mostrar, no el producto entero.
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: agregadas,
    });
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();

  return agregadas;
}

/* ── Contador del header ── */

// Escribe el número, apaga el globito en cero y deja el botón con un nombre
// que un lector de pantalla pueda anunciar.
function actualizarContadorCarrito() {
  if (contadorCarrito === null) {
    return;
  }

  const unidades = contarUnidadesDelCarrito();

  contadorCarrito.textContent = unidades;

  if (unidades === 0) {
    contadorCarrito.classList.add("esta-vacio");
  } else {
    contadorCarrito.classList.remove("esta-vacio");
  }

  if (botonCarrito !== null) {
    let etiqueta = "Abrir el carrito, está vacío";

    if (unidades === 1) {
      etiqueta = "Abrir el carrito, 1 pieza";
    } else if (unidades > 1) {
      etiqueta = "Abrir el carrito, " + unidades + " piezas";
    }

    botonCarrito.setAttribute("aria-label", etiqueta);
  }
}

// El botón viene deshabilitado del HTML: sin JavaScript no hay panel que abrir.
// La comprobación va acá adentro y no suelta, porque si fuera suelta correría
// antes de que se cargue js/carrito.js y el botón quedaría muerto para siempre.
document.addEventListener("DOMContentLoaded", function () {
  marcarNavegacionActiva();
  actualizarContadorCarrito();

  if (botonCarrito === null || typeof window.abrirCarrito !== "function") {
    return;
  }

  botonCarrito.disabled = false;

  botonCarrito.addEventListener("click", function () {
    window.abrirCarrito();
  });
});

// Otro archivo puede haber cambiado el carrito en otra pestaña.
window.addEventListener("storage", function (evento) {
  if (evento.key === CLAVE_CARRITO) {
    actualizarContadorCarrito();

    if (typeof window.renderizarCarrito === "function") {
      window.renderizarCarrito();
    }
  }
});

// Para que los scripts de cada página usen el mismo almacén.
window.obtenerCarrito = obtenerCarrito;
window.guardarCarrito = guardarCarrito;
window.agregarAlCarrito = agregarAlCarrito;
window.formatearPrecio = formatearPrecio;
window.actualizarContadorCarrito = actualizarContadorCarrito;
window.esperar = esperar;
window.DEMORA_SIMULADA = DEMORA_SIMULADA;
window.CARRITO_MAXIMO_POR_PIEZA = CARRITO_MAXIMO_POR_PIEZA;
