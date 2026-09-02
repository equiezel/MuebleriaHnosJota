// Contador de ítems del carrito que se muestra en el header.
// El panel del carrito está en js/carrito.js; acá solo leemos localStorage.

// Ojo: js/carrito.js tiene que guardar con esta misma clave.
const CLAVE_CARRITO = "carritoHermanosJota";

const botonCarrito = document.getElementById("boton-carrito");
const contadorCarrito = document.getElementById("contador-carrito");

// Devuelve cuántas unidades hay en el carrito, o 0 si no hay nada usable.
function contarUnidadesDelCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);

  if (guardado === null) {
    return 0;
  }

  try {
    const carrito = JSON.parse(guardado);

    if (Array.isArray(carrito) === false) {
      return 0;
    }

    let unidades = 0;

    carrito.forEach(function (item) {
      // La cantidad puede venir como texto desde un input.
      const cantidad = Number(item.cantidad);

      if (Number.isFinite(cantidad) && cantidad > 0) {
        unidades = unidades + Math.floor(cantidad);
      } else {
        unidades = unidades + 1;
      }
    });

    return unidades;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

// Escribe el número y apaga el globito cuando está en cero.
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
}

// El botón viene deshabilitado del HTML porque todavía no hay panel que abrir.
// La comprobación va acá adentro y no suelta: si fuera suelta correría antes
// de que se cargue js/carrito.js y el botón quedaría deshabilitado para
// siempre. Con DOMContentLoaded ya se ejecutaron todos los <script>.
document.addEventListener("DOMContentLoaded", function () {
  if (botonCarrito === null) {
    return;
  }

  if (typeof window.abrirCarrito !== "function") {
    return;
  }

  botonCarrito.disabled = false;

  botonCarrito.addEventListener("click", function () {
    window.abrirCarrito();
  });
});

// Para que otros archivos puedan refrescar el número.
window.actualizarContadorCarrito = actualizarContadorCarrito;

actualizarContadorCarrito();
