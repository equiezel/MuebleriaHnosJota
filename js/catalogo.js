// Catálogo completo con buscador en vivo.
// El formato de precio y la espera simulada vienen de js/main.js, para que sean
// los mismos en todo el sitio.

const productGrid = document.querySelector("#product-grid");
const productSearch = document.querySelector("#product-search");
const productCount = document.querySelector("#product-count");

let searchTimeout;
const DEBOUNCE_DELAY = 300;

// Cuántas tarjetas vacías mostramos mientras "llega" el catálogo.
const CANTIDAD_ESQUELETOS = 6;

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

// Tarjetas vacías del mismo alto que las reales, para que la grilla ya ocupe
// su espacio y no salte cuando entran los productos.
const renderSkeletons = () => {
	productGrid.setAttribute("aria-busy", "true");
	productCount.textContent = "Cargando piezas…";

	productGrid.innerHTML = `
		<article class="product-card product-card--esqueleto" aria-hidden="true">
			<div class="product-card__image-wrap"></div>
			<div class="product-card__content">
				<div>
					<p class="esqueleto-linea esqueleto-linea--media"></p>
					<p class="esqueleto-linea"></p>
					<p class="esqueleto-linea esqueleto-linea--corta"></p>
				</div>
				<p class="esqueleto-linea esqueleto-linea--media"></p>
			</div>
		</article>`.repeat(CANTIDAD_ESQUELETOS);
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
			const imagen = escapeHTML(product.imagen || "");
			// Sin el "|| 0": window.formatearPrecio() ya contesta "Precio a consultar"
			// cuando el dato falta, y un "$ 0" sería un precio inventado.
			const precio = product.precio;
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

		const agregadas = window.agregarAlCarrito(product, 1);

		// Con la pieza en el tope no entra ninguna: el botón no puede decir
		// "Agregado" si no agregó nada.
		button.textContent = agregadas === 0 ? "Ya está el máximo" : "Agregado";
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

// La primera pintada simula la respuesta de una API: esqueletos, espera y
// recién ahí los datos. El buscador no espera: filtra sobre lo ya cargado.
const initializeCatalog = async () => {
	renderSkeletons();

	await window.esperar(window.DEMORA_SIMULADA);

	if (typeof productos !== "undefined" && Array.isArray(productos)) {
		renderProducts(productos);
	} else {
		productGrid.setAttribute("aria-busy", "false");
		productCount.textContent = "";
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
