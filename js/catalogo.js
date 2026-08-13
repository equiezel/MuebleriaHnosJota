document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("catalog-grid");
  const buscador = document.getElementById("search-input");
  const contador = document.getElementById("catalog-count");
  const loader = document.getElementById("catalog-loader");

  if (!grid) return;

  const todosLosProductos = await obtenerProductos();
  if (loader) loader.remove();

  function renderizarCatalogo(lista) {
    if (lista.length === 0) {
      grid.innerHTML =
        '<p class="empty-state">No encontramos productos que coincidan con tu búsqueda. Probá con otro término.</p>';
      if (contador) contador.textContent = "0 productos";
      return;
    }

    grid.innerHTML = lista.map(crearTarjetaProducto).join("");
    inicializarBotonesCarrito(grid);
    if (contador) {
      contador.textContent = `${lista.length} producto${lista.length !== 1 ? "s" : ""}`;
    }
  }

  function filtrarProductos(termino) {
    const normalizado = termino.trim().toLowerCase();
    if (!normalizado) return todosLosProductos;

    return todosLosProductos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(normalizado) ||
        p.descripcion.toLowerCase().includes(normalizado) ||
        p.especificaciones.materiales.toLowerCase().includes(normalizado)
    );
  }

  renderizarCatalogo(todosLosProductos);

  if (buscador) {
    buscador.addEventListener("input", () => {
      renderizarCatalogo(filtrarProductos(buscador.value));
    });
  }
});
