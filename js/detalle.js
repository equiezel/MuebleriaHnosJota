document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("product-detail");
  const loader = document.getElementById("detail-loader");

  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    if (loader) loader.remove();
    contenedor.innerHTML =
      '<p class="empty-state">Producto no encontrado. <a href="productos.html">Volver al catálogo</a></p>';
    return;
  }

  const producto = await obtenerProductoPorId(id);
  if (loader) loader.remove();

  if (!producto) {
    contenedor.innerHTML =
      '<p class="empty-state">Producto no encontrado. <a href="productos.html">Volver al catálogo</a></p>';
    return;
  }

  document.title = `${producto.nombre} — Hermanos Jota`;

  const specs = producto.especificaciones;
  const specLabels = {
    medidas: "Medidas",
    materiales: "Materiales",
    acabado: "Acabado",
    peso: "Peso",
    capacidad: "Capacidad",
  };

  const filasSpecs = Object.entries(specs)
    .map(
      ([clave, valor]) => `
      <tr>
        <th scope="row">${specLabels[clave] || clave}</th>
        <td>${valor}</td>
      </tr>
    `
    )
    .join("");

  contenedor.innerHTML = `
    <div class="detail-layout">
      <div class="detail-image-card">
        <img src="${producto.imagen}" alt="${producto.nombre}" />
        ${producto.destacado ? '<span class="badge badge--sustainability">FSC® Certificado</span>' : ""}
      </div>
      <div class="detail-info">
        <p class="detail-breadcrumb"><a href="productos.html">Productos</a> / ${producto.nombre}</p>
        <h1 class="detail-title">${producto.nombre}</h1>
        <p class="detail-price">${formatearPrecio(producto.precio)}</p>
        <p class="detail-description">${producto.descripcion}</p>
        <button type="button" class="btn btn--primary btn-add-cart" data-id="${producto.id}">
          Añadir al Carrito
        </button>
        <div class="detail-specs">
          <h2>Especificaciones Técnicas</h2>
          <table class="specs-table">
            <tbody>${filasSpecs}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  inicializarBotonesCarrito(contenedor);
});
