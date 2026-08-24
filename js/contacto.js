const formulario = document.getElementById("formContacto");
const contadorMensaje = document.getElementById("contadorMensaje");

formulario.addEventListener("submit", (event) => {
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");

  const errorNombre = document.getElementById("errorNombre");
  const errorEmail = document.getElementById("errorEmail");
  const errorMensaje = document.getElementById("errorMensaje");
  errorNombre.textContent = "";
  errorEmail.textContent = "";
  errorMensaje.textContent = "";
  mensajeExito.textContent = "";

  event.preventDefault();
  let errores = false;
  if (nombre.value.trim() === "") {
    errorNombre.textContent = "El nombre es obligatorio.";
    errores = true;
  }
  if (email.value.trim() === "") {
    errorEmail.textContent = "El email es obligatorio.";
    errores = true;
  }
  if (mensaje.value.trim() === "") {
    errorMensaje.textContent = "El mensaje es obligatorio.";
    errores = true;
  }
  if (errores) {
    return;
  }
  const datos = new FormData(formulario);
  const consulta = Object.fromEntries(datos);
  formulario.reset();
  contadorMensaje.textContent = "";
  console.log(consulta);
  mensajeExito.textContent = "¡Consulta enviada correctamente!";
});

mensaje.addEventListener("input", () => {
  const cantidad = mensaje.value.length;
  const maxLength = mensaje.maxLength;
  contadorMensaje.textContent = `${cantidad}/${maxLength}`;
});
