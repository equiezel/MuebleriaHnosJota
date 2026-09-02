const productGrid = document.querySelector("#product-grid");
const productSearch = document.querySelector("#product-search");
const productCount = document.querySelector("#product-count");

let searchTimeout;
const DEBOUNCE_DELAY = 300;

if (!productGrid || !productSearch || !productCount) {
	console.error("Error: Elementos del DOM no encontrados");
}

const formatPrice = (price) => {
	try {
		return new Intl.NumberFormat("es-AR", {
			style: "currency",
			currency: "ARS",
			maximumFractionDigits: 0,
		}).format(price);
	} catch (error) {
		console.error("Error al formatear precio:", error);
		return `$${price}`;
	}
};


const escapeHTML = (text) => {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
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
						<a class="product-card__link" href="producto.html?id=${id}" aria-label="Ver detalle de ${nombre}">
							<img src="${imagen}" alt="${nombre}" loading="lazy">
							${destacado}
						</a>
					</div>
						<div class="product-card__content">
							<div>
								<h2>${nombre}</h2>
								<p>${descripcion}</p>
							</div>
							<div class="product-card__footer">
								<strong>${formatPrice(precio)}</strong>
								<a href="producto.html?id=${id}">Ver detalle <span aria-hidden="true">→</span></a>
								<button class="product-card__add" type="button" data-add-to-cart="${id}">Agregar</button>
							</div>
						</div>
				</article>`;
		})
		.join("");

	document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
		button.addEventListener("click", () => {
			const product = productos.find((item) => item.id === button.dataset.addToCart);
			if (!product) return;

			const cart = obtenerCarrito();
			const existing = cart.find((item) => item.id === product.id);
			if (existing) {
				existing.cantidad += 1;
			} else {
				cart.push({ ...product, cantidad: 1 });
			}
			guardarCarrito(cart);
			actualizarContadorCarrito();
			button.textContent = "Agregado";
			window.setTimeout(() => {
				button.textContent = "Agregar";
			}, 1400);
		});
	});
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

productSearch.addEventListener("input", (event) => {
	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(() => {
		filterProducts(event.target.value);
	}, DEBOUNCE_DELAY);
});

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

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeCatalog);
} else {
	initializeCatalog();
}
