const detalleContainer = document.querySelector("#product-detail");
const productId = new URLSearchParams(window.location.search).get("id");
const product = productId
	? productos.find((item) => item.id === productId)
	: productos[0];

function formatPrice(price) {
	return new Intl.NumberFormat("es-AR", {
		style: "currency",
		currency: "ARS",
		maximumFractionDigits: 0,
	}).format(price);
}

function renderProduct() {
	if (!product) {
		detalleContainer.innerHTML = `
			<section class="product-error">
				<h1>Producto no encontrado</h1>
				<p>La pieza que buscás no está disponible en esta colección.</p>
				<a href="productos.html">Volver al catálogo</a>
			</section>`;
		return;
	}

	const specs = Object.entries(product.especificaciones)
		.map(([label, value]) => `<li><strong>${label}</strong><span>${value}</span></li>`)
		.join("");

	detalleContainer.innerHTML = `
		<section class="product-gallery">
			<img src="${product.imagen}" alt="${product.nombre}" />
		</section>
		<section class="product-copy">
			<p class="product-eyebrow">Pieza de colección / ${product.id}</p>
			<h1>${product.nombre}</h1>
			<p class="product-description">${product.descripcion}</p>
			<p class="product-price">${formatPrice(product.precio)}</p>
			<div class="purchase-row">
				<div class="quantity-control" aria-label="Cantidad">
					<button type="button" data-quantity="decrease" aria-label="Disminuir cantidad">-</button>
					<output id="quantity" aria-live="polite">1</output>
					<button type="button" data-quantity="increase" aria-label="Aumentar cantidad">+</button>
				</div>
				<button class="add-button" type="button" id="add-to-cart">Agregar al carrito</button>
			</div>
			<p class="purchase-note">Envío coordinado a todo el país. Cada pieza se revisa y embala en Casa Taller.</p>
		</section>
		<section class="specs" aria-labelledby="specs-title">
			<h2 id="specs-title">Detalles de la pieza</h2>
			<ul class="spec-list">${specs}</ul>
		</section>`;

	bindProductActions();
}

const CANTIDAD_MINIMA = 1;

function setQuantityDisplay(output, quantity) {
	output.value = quantity;
	output.textContent = quantity;
}

function addToCart(quantity) {
	const unidades = Math.max(CANTIDAD_MINIMA, Math.floor(Number(quantity)) || CANTIDAD_MINIMA);
	const cart = obtenerCarrito();
	const existing = cart.find((item) => item.id === product.id);

	if (existing) {
		existing.cantidad = (Number(existing.cantidad) || 0) + unidades;
	} else {
		cart.push({ ...product, cantidad: unidades });
	}

	guardarCarrito(cart);
	actualizarContadorCarrito();

	if (typeof renderizarCarrito === "function") {
		renderizarCarrito();
	}

	const button = document.querySelector("#add-to-cart");
	button.textContent = "Agregado";
	window.setTimeout(() => {
		button.textContent = "Agregar al carrito";
	}, 1400);
}

function bindProductActions() {
	let quantity = CANTIDAD_MINIMA;
	const quantityOutput = document.querySelector("#quantity");

	document.querySelectorAll("[data-quantity]").forEach((button) => {
		button.addEventListener("click", () => {
			quantity = button.dataset.quantity === "increase"
				? quantity + 1
				: Math.max(CANTIDAD_MINIMA, quantity - 1);
			setQuantityDisplay(quantityOutput, quantity);
		});
	});

	document.querySelector("#add-to-cart").addEventListener("click", () => {
		addToCart(quantity);
		quantity = CANTIDAD_MINIMA;
		setQuantityDisplay(quantityOutput, quantity);
	});
}

document.addEventListener("DOMContentLoaded", () => {
	renderProduct();
	actualizarContadorCarrito();
});
