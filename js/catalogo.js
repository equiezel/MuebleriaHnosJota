// Catálogo completo con buscador en vivo.
// El formato de precio viene de js/main.js, para que sea el mismo en todo el sitio.

const productGrid = document.querySelector("#product-grid");
const productSearch = document.querySelector("#product-search");
const productCount = document.querySelector("#product-count");

let searchTimeout;
const DEBOUNCE_DELAY = 300;

const hayCatalogo = productGrid && productSearch && productCount;

if (!hayCatalogo) {
	console.error("Error: faltan nodos del catálogo en el HTML");
}

// Estas tarjetas se arman con plantillas de texto, así que hay que escapar
// todo lo que venga de los datos. textContent no escapa comillas y acá el
// nombre entra en atributos (alt, aria-label), por eso van también.
const escapeHTML = (text) => {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};

const renderProducts = (products) => {

	if (!Array.isArray(products)) {
		console.error("Error: productos no es un array válido");
		products = [];
	}

	productGrid.setAttribute("aria-busy", "false");
	productCount.textContent = `${products.length} ${products.length === 1 ? "producto" : "productos"}`;

	if (!products.length) {
		productGrid.innerHTML = `
			<div class="catalog-status catalog-status--empty">
				<h2>No encontramos ese mueble</h2>
				<p>Probá con otro nombre o alguna característica del producto.</p>
			</div>`;
		return;
	}

	productGrid.innerHTML = products
		.map((product) => {
			const id = encodeURIComponent(product.id || "");
			const nombre = escapeHTML(product.nombre || "Sin nombre");
			const descripcion = escapeHTML(product.descripcion || "");
			const imagen = product.imagen || "";
			const precio = product.precio || 0;
			const destacado = product.destacado ? '<span class="product-badge">Destacado</span>' : "";

			return `
				<article class="product-card">
					<div class="product-card__image-wrap">
						<a class="product-card__link" href="producto.html?id=${id}" tabindex="-1" aria-hidden="true">
							<img src="${imagen}" alt="${nombre}" loading="lazy">
						</a>
						${destacado}
					</div>
					<div class="product-card__content">
						<div>
							<h2>${nombre}</h2>
							<p>${descripcion}</p>
						</div>
						<div class="product-card__footer">
							<strong>${window.formatearPrecio(precio)}</strong>
							<div class="product-card__acciones">
								<a class="product-card__detalle" href="producto.html?id=${id}" aria-label="Ver detalle de ${nombre}">Ver detalle <span aria-hidden="true">→</span></a>
								<button class="product-card__add" type="button" data-add-to-cart="${id}" aria-label="Agregar ${nombre} al carrito">Agregar</button>
							</div>
						</div>
					</div>
				</article>`;
		})
		.join("");
};

const filterProducts = (query) => {
	if (!Array.isArray(productos)) {
		console.error("Error: datos de productos no disponibles");
		return;
	}

	const normalizedQuery = query.trim().toLocaleLowerCase("es");
	const filteredProducts = productos.filter((product) => {
		const searchText = `${product.nombre || ""} ${product.descripcion || ""}`
			.toLocaleLowerCase("es");
		return searchText.includes(normalizedQuery);
	});
	renderProducts(filteredProducts);
};

if (hayCatalogo) {
	productGrid.addEventListener("click", (event) => {
		const button = event.target.closest("[data-add-to-cart]");

		if (!button) return;

		const product = productos.find(
			(item) => item.id === decodeURIComponent(button.dataset.addToCart)
		);

		if (!product) return;

		window.agregarAlCarrito(product, 1);

		button.textContent = "Agregado";
		window.setTimeout(() => {
			button.textContent = "Agregar";
		}, 1400);
	});

	productSearch.addEventListener("input", (event) => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			filterProducts(event.target.value);
		}, DEBOUNCE_DELAY);
	});
}

const initializeCatalog = () => {
	if (typeof productos !== "undefined" && Array.isArray(productos)) {
		renderProducts(productos);
	} else {
		console.error("Error: La variable 'productos' no está disponible. Verifica que data.js cargó correctamente.");
		productGrid.innerHTML = `
			<div class="catalog-status catalog-status--empty">
				<h2>Error al cargar el catálogo</h2>
				<p>Por favor, recarga la página.</p>
			</div>`;
	}
};

if (hayCatalogo) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeCatalog);
	} else {
		initializeCatalog();
	}
}
