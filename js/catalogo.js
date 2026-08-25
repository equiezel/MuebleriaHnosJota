const productGrid = document.querySelector("#product-grid");
const productSearch = document.querySelector("#product-search");
const productCount = document.querySelector("#product-count");

const formatPrice = (price) =>
	new Intl.NumberFormat("es-AR", {
		style: "currency",
		currency: "ARS",
		maximumFractionDigits: 0,
	}).format(price);

const renderProducts = (products) => {
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
		.map(
			(product) => `
				<article class="product-card">
					<a class="product-card__link" href="producto.html?id=${encodeURIComponent(product.id)}" aria-label="Ver detalle de ${product.nombre}">
						<div class="product-card__image-wrap">
							<img src="${product.imagen}" alt="${product.nombre}" loading="lazy">
							${product.destacado ? '<span class="product-badge">Destacado</span>' : ""}
						</div>
						<div class="product-card__content">
							<div>
								<h2>${product.nombre}</h2>
								<p>${product.descripcion}</p>
							</div>
							<div class="product-card__footer">
								<strong>${formatPrice(product.precio)}</strong>
								<span>Ver detalle <span aria-hidden="true">→</span></span>
							</div>
						</div>
					</a>
				</article>`
		)
		.join("");
};

const filterProducts = (query) => {
	const normalizedQuery = query.trim().toLocaleLowerCase("es");
	const filteredProducts = productos.filter((product) =>
		`${product.nombre} ${product.descripcion}`.toLocaleLowerCase("es").includes(normalizedQuery)
	);
	renderProducts(filteredProducts);
};

productSearch.addEventListener("input", (event) => filterProducts(event.target.value));

setTimeout(() => renderProducts(productos), 650);
