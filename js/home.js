async function renderizarDestacados() {
  const contenedor = document.getElementById("featured-products");
  const loader = document.getElementById("home-loader");

  if (!contenedor) return;

  const productosData = await obtenerProductos();
  const destacados = productosData.filter((p) => p.destacado).slice(0, 4);

  if (loader) loader.remove();

  contenedor.innerHTML = destacados.map(crearTarjetaProducto).join("");
  inicializarBotonesCarrito(contenedor);
}

document.addEventListener("DOMContentLoaded", renderizarDestacados);
