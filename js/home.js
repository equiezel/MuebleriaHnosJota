// Productos destacados de la página de inicio.
// Toma los que tienen destacado: true en js/data.js y arma las tarjetas.
// Antes de mostrarlas espera un rato para simular la demora de un servidor.

const listaDestacados = document.getElementById("destacados-lista");

// Cuántas piezas mostramos como máximo.
const CANTIDAD_DESTACADOS = 4;

// Cuánto tarda la carga simulada, en milisegundos.
const DEMORA_SIMULADA = 800;

// Promesa que se resuelve después de los milisegundos pedidos.
function esperar(milisegundos) {
  return new Promise(function (resolve) {
    setTimeout(resolve, milisegundos);
  });
}

// Tarjeta vacía del mismo tamaño que las reales, para que la grilla
// ya ocupe su alto mientras carga.
function crearEsqueleto() {
  const tarjeta = document.createElement("article");
  tarjeta.className = "producto-card producto-card--esqueleto";
  tarjeta.setAttribute("aria-hidden", "true");
  const figura = document.createElement("div");
  figura.className = "producto-card__figura";

  const cuerpo = document.createElement("div");
  cuerpo.className = "producto-card__cuerpo";

  const anchos = ["", "--media", "--corta"];

  anchos.forEach(function (modificador) {
    const linea = document.createElement("p");
    linea.className = "esqueleto-linea";

    if (modificador !== "") {
      linea.classList.add("esqueleto-linea" + modificador);
    }

    cuerpo.appendChild(linea);
  });

  tarjeta.appendChild(figura);
  tarjeta.appendChild(cuerpo);

  return tarjeta;
}

function mostrarEsqueletos() {
  listaDestacados.textContent = "";

  for (let i = 0; i < CANTIDAD_DESTACADOS; i++) {
    listaDestacados.appendChild(crearEsqueleto());
  }
}

// Muestra un mensaje en el lugar de la grilla.
function mostrarEstado(texto) {
  listaDestacados.textContent = "";

  const aviso = document.createElement("p");
  aviso.className = "destacados__estado";
  aviso.textContent = texto;

  listaDestacados.appendChild(aviso);
}

// Arma la tarjeta de un producto.
function crearTarjeta(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "producto-card";

  // Mismo formato de URL que usan catalogo.js y detalle.js.
  const enlace = document.createElement("a");
  enlace.className = "producto-card__enlace";
  enlace.href = "producto.html?id=" + producto.id;

  const figura = document.createElement("div");
  figura.className = "producto-card__figura";

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  // alt vacío: el h3 de abajo ya dice el nombre y si no se lee dos veces.
  imagen.alt = "";
  imagen.width = 1024;
  imagen.height = 1024;
  imagen.loading = "lazy";
  imagen.decoding = "async";
  // Encuadre por pieza, definido en css/home.css.
  imagen.classList.add("encuadre-" + producto.id);

  figura.appendChild(imagen);

  const cuerpo = document.createElement("div");
  cuerpo.className = "producto-card__cuerpo";

  const material = document.createElement("p");
  material.className = "producto-card__material";
  material.textContent = producto.especificaciones.materiales;

  const nombre = document.createElement("h3");
  nombre.className = "producto-card__nombre";
  nombre.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "producto-card__precio";
  precio.textContent = window.formatearPrecio(producto.precio);

  const accion = document.createElement("p");
  accion.className = "producto-card__accion";
  accion.textContent = "Ver detalle →";

  cuerpo.appendChild(material);
  cuerpo.appendChild(nombre);
  cuerpo.appendChild(precio);
  cuerpo.appendChild(accion);

  enlace.appendChild(figura);
  enlace.appendChild(cuerpo);
  tarjeta.appendChild(enlace);

  return tarjeta;
}

async function cargarDestacados() {
  if (listaDestacados === null) {
    return;
  }

  try {
    // Reservamos el espacio antes de esperar.
    mostrarEsqueletos();

    // Acá está la espera simulada.
    await esperar(DEMORA_SIMULADA);

    // Nos quedamos con los destacados.
    const destacados = [];

    productos.forEach(function (producto) {
      if (producto.destacado === true) {
        destacados.push(producto);
      }
    });

    if (destacados.length === 0) {
      mostrarEstado("Por ahora no hay piezas destacadas.");
      return;
    }

    // Sacamos los placeholders y ponemos las tarjetas.
    listaDestacados.textContent = "";

    for (let i = 0; i < destacados.length && i < CANTIDAD_DESTACADOS; i++) {
      listaDestacados.appendChild(crearTarjeta(destacados[i]));
    }
  } catch (error) {
    // Entra acá si, por ejemplo, no se cargó js/data.js.
    console.error(error);
    mostrarEstado("No pudimos cargar las piezas destacadas. Probá recargando la página.");
  }
}

// DOMContentLoaded y no load: si no, la espera arranca recién cuando
// terminan de bajar todas las imágenes.
document.addEventListener("DOMContentLoaded", cargarDestacados);
