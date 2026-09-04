// Validación del formulario de consulta.
// El <form> lleva novalidate: los mensajes los escribimos nosotros en el DOM,
// así todos los errores se ven igual y en el mismo lugar.

const formulario = document.getElementById("formContacto");
const campoNombre = document.getElementById("nombre");
const campoEmail = document.getElementById("email");
const campoMensaje = document.getElementById("mensaje");

const errorNombre = document.getElementById("errorNombre");
const errorEmail = document.getElementById("errorEmail");
const errorMensaje = document.getElementById("errorMensaje");

const contadorMensaje = document.getElementById("contadorMensaje");
const mensajeExito = document.getElementById("mensajeExito");

// algo@algo.algo, sin espacios. Alcanza para avisar de un error de tipeo;
// la validación de verdad la hace el servidor cuando exista.
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Muestra u oculta el error de un campo y lo marca para los lectores de pantalla.
function marcarError(campo, contenedorError, texto) {
  contenedorError.textContent = texto;

  if (texto === "") {
    campo.removeAttribute("aria-invalid");
  } else {
    campo.setAttribute("aria-invalid", "true");
  }
}

function limpiarErrores() {
  marcarError(campoNombre, errorNombre, "");
  marcarError(campoEmail, errorEmail, "");
  marcarError(campoMensaje, errorMensaje, "");
}

function actualizarContador() {
  contadorMensaje.textContent =
    campoMensaje.value.length + "/" + campoMensaje.maxLength;
}

// Devuelve el primer campo con problema, o null si está todo bien.
function validar() {
  let primerError = null;

  if (campoNombre.value.trim() === "") {
    marcarError(campoNombre, errorNombre, "Escribí tu nombre para saber cómo llamarte.");
    primerError = primerError || campoNombre;
  }

  const email = campoEmail.value.trim();

  if (email === "") {
    marcarError(campoEmail, errorEmail, "Necesitamos un email para poder responderte.");
    primerError = primerError || campoEmail;
  } else if (FORMATO_EMAIL.test(email) === false) {
    marcarError(
      campoEmail,
      errorEmail,
      "Ese email no parece completo. Revisá que tenga @ y un dominio."
    );
    primerError = primerError || campoEmail;
  }

  if (campoMensaje.value.trim() === "") {
    marcarError(campoMensaje, errorMensaje, "Contanos qué pieza te interesa.");
    primerError = primerError || campoMensaje;
  }

  return primerError;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  limpiarErrores();
  mensajeExito.textContent = "";

  const primerError = validar();

  if (primerError !== null) {
    // El foco va al primer problema: en celular, el error puede quedar fuera de pantalla.
    primerError.focus();
    return;
  }

  const consulta = Object.fromEntries(new FormData(formulario));

  // No hay backend: la consulta queda en la consola, como pide la consigna.
  console.log("Consulta recibida:", consulta);

  formulario.reset();
  limpiarErrores();
  actualizarContador();

  mensajeExito.textContent =
    "¡Gracias! Te respondemos dentro de las próximas 48 horas hábiles.";
});

// El contador se actualiza al tipear y arranca en 0/200 desde el HTML,
// así el bloque no cambia de alto cuando aparece.
campoMensaje.addEventListener("input", actualizarContador);

// Al corregir un campo, su error desaparece sin esperar a reenviar.
[campoNombre, campoEmail, campoMensaje].forEach(function (campo) {
  campo.addEventListener("input", function () {
    if (campo.getAttribute("aria-invalid") === "true") {
      const contenedor = document.getElementById(
        "error" + campo.id.charAt(0).toUpperCase() + campo.id.slice(1)
      );
      marcarError(campo, contenedor, "");
    }
  });
});

actualizarContador();
