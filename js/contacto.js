document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (!formulario) return;

  const campos = {
    nombre: formulario.querySelector("#nombre"),
    email: formulario.querySelector("#email"),
    mensaje: formulario.querySelector("#mensaje"),
  };

  function mostrarError(input, mensaje) {
    const grupo = input.closest(".form-group");
    const errorEl = grupo.querySelector(".field-error");
    input.classList.add("is-invalid");
    errorEl.textContent = mensaje;
  }

  function limpiarError(input) {
    const grupo = input.closest(".form-group");
    const errorEl = grupo.querySelector(".field-error");
    input.classList.remove("is-invalid");
    errorEl.textContent = "";
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarFormulario() {
    let valido = true;

    Object.values(campos).forEach(limpiarError);

    if (!campos.nombre.value.trim()) {
      mostrarError(campos.nombre, "El nombre es obligatorio.");
      valido = false;
    }

    if (!campos.email.value.trim()) {
      mostrarError(campos.email, "El email es obligatorio.");
      valido = false;
    } else if (!validarEmail(campos.email.value.trim())) {
      mostrarError(campos.email, "Ingresá un email válido.");
      valido = false;
    }

    if (!campos.mensaje.value.trim()) {
      mostrarError(campos.mensaje, "El mensaje es obligatorio.");
      valido = false;
    }

    return valido;
  }

  Object.values(campos).forEach((input) => {
    input.addEventListener("input", () => limpiarError(input));
  });

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    feedback.hidden = false;
    feedback.className = "form-feedback form-feedback--success";
    feedback.innerHTML = `
      <strong>¡Gracias, ${campos.nombre.value.trim()}!</strong>
      Recibimos tu consulta y te responderemos a <em>${campos.email.value.trim()}</em> dentro de las próximas 24 horas hábiles.
      Mientras tanto, podés visitar nuestro showroom en San Cristóbal.
    `;

    formulario.reset();
    formulario.querySelector("button[type=submit]").disabled = true;

    setTimeout(() => {
      formulario.querySelector("button[type=submit]").disabled = false;
    }, 3000);
  });
});
