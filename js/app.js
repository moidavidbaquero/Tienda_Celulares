/**
 * MóvilWire - Main Application JavaScript
 * ==========================================
 * Paleta de colores vibrante con imágenes de productos
 */

// ===== Product Data =====
const products = [
    {
        id: 1,
        brand: "Apple",
        name: "iPhone 15 Pro",
        specs: "Titanio Natural, 256GB",
        price: 1199.00,
        status: "available",
        image: "assets/iphone15pro.svg",
        category: ["iPhone", "Gama Alta"],
        badge: "Nuevo"
    },
    {
        id: 2,
        brand: "Samsung",
        name: "Samsung Galaxy S24",
        specs: "Phantom Black, 128GB",
        price: 899.00,
        status: "available",
        image: "assets/galaxys24.svg",
        category: ["Samsung", "Gama Alta"],
        badge: null
    },
    {
        id: 3,
        brand: "Xiaomi",
        name: "Xiaomi 14 Ultra",
        specs: "Leica Edition, 512GB",
        price: 1049.00,
        status: "out_of_stock",
        image: "assets/xiaomi14ultra.svg",
        category: ["Xiaomi", "Gama Alta"],
        badge: "Agotado"
    },
    {
        id: 4,
        brand: "Samsung",
        name: "Samsung Galaxy A54",
        specs: "Awesome Black, 128GB",
        price: 449.00,
        status: "available",
        image: "assets/galaxya54.svg",
        category: ["Samsung", "Gama Media"],
        badge: "Popular"
    },
    {
        id: 5,
        brand: "Xiaomi",
        name: "Xiaomi 13T",
        specs: "Black, 256GB",
        price: 599.00,
        status: "available",
        image: "assets/xiaomi13t.svg",
        category: ["Xiaomi", "Gama Media"],
        badge: null
    },
    {
        id: 6,
        brand: "Apple",
        name: "iPhone 15",
        specs: "Negro, 128GB",
        price: 899.00,
        status: "available",
        image: "assets/iphone15.svg",
        category: ["iPhone", "Gama Alta"],
        badge: "Oferta"
    }
];

// ===== Cart State =====
let cart = [];
let wishlist = [];

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    initSearch();
    initCategoryFilters();
    initScrollAnimations();
    initNavScroll();
});

// ===== Render Products =====
function renderProducts(productsToRender) {
    const container = document.getElementById('productsList');
    if (!container) return;

    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="mb-3">
                    <i class="bi bi-search" style="font-size: 3rem; color: var(--primary-light);"></i>
                </div>
                <h5 class="text-muted">No se encontraron productos</h5>
                <p class="text-muted">Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }

    container.innerHTML = productsToRender.map((product, index) => `
        <div class="product-card p-4" style="animation-delay: ${index * 0.1}s">
            <div class="d-flex align-items-start gap-4">
                <!-- Product Image -->
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-img" width="120" height="120">
                    ${product.badge ? `<span class="product-badge badge-notification">${product.badge}</span>` : ''}
                </div>

                <!-- Info -->
                <div class="flex-grow-1">
                    <span class="product-brand">${product.brand}</span>
                    <h5 class="product-name mb-1">${product.name}</h5>
                    <p class="product-specs mb-2">${product.specs}</p>

                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <span class="product-price">$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span class="${product.status === 'available' ? 'product-status-available' : 'product-status-out'}">
                            <i class="bi ${product.status === 'available' ? 'bi-check-circle' : 'bi-x-circle'} me-1"></i>
                            ${product.status === 'available' ? 'Disponible' : 'Agotado'}
                        </span>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <button class="btn btn-details" onclick="showDetails(${product.id})">
                            <i class="bi bi-eye me-1"></i> Detalles
                        </button>
                        <div class="d-flex align-items-center gap-2">
                            ${product.status === 'available'
                                ? `<button class="btn btn-add-cart" onclick="addToCart(${product.id})">
                                        <i class="bi bi-cart-plus me-1"></i> Agregar
                                   </button>`
                                : `<button class="btn btn-notify" onclick="notifyMe(${product.id})">
                                        <i class="bi bi-bell me-1"></i> Avisarme
                                   </button>`
                            }
                        </div>
                    </div>
                </div>

                <!-- Wishlist -->
                <button class="btn-wishlist ${wishlist.includes(product.id) ? 'active' : ''}"
                        onclick="toggleWishlist(${product.id}, this)"
                        title="Agregar a favoritos">
                    <i class="bi ${wishlist.includes(product.id) ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== Search Functionality =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();

            if (query === '') {
                renderProducts(products);
                return;
            }

            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.brand.toLowerCase().includes(query) ||
                product.specs.toLowerCase().includes(query)
            );

            renderProducts(filtered);
        }, 300);
    });
}

// ===== Category Filters =====
function initCategoryFilters() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active state from all
            categoryItems.forEach(i => i.classList.remove('active'));

            // Add active state to clicked
            item.classList.add('active');

            const categoryText = item.querySelector('span').textContent.trim();
            const filtered = products.filter(product =>
                product.category.includes(categoryText)
            );

            renderProducts(filtered);

            // Scroll to products
            document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });

    // Observe promo cards
    document.querySelectorAll('.promo-card-1, .promo-card-2, .promo-card-3').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// ===== Nav Scroll Effect =====
function initNavScroll() {
    const header = document.querySelector('.header-main');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(108, 60, 225, 0.3)';
        } else {
            header.style.boxShadow = 'var(--shadow-md)';
        }
    });
}

// ===== Add to Cart =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    cart.push(product);
    updateCartBadge();
    showToast(`${product.name} agregado al carrito`);

    // Animate cart icon
    const cartIcon = document.querySelector('.bi-cart3');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

// ===== Update Cart Badge =====
function updateCartBadge() {
    const badge = document.querySelector('.badge.rounded-pill');
    if (badge) {
        badge.textContent = cart.length + 3; // +3 for initial count
        badge.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            badge.style.animation = '';
        }, 300);
    }
}

// ===== Toggle Wishlist =====
function toggleWishlist(productId, button) {
    const icon = button.querySelector('i');

    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        button.classList.remove('active');
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
        showToast('Eliminado de favoritos');
    } else {
        wishlist.push(productId);
        button.classList.add('active');
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
        showToast('Agregado a favoritos');

        // Heart animation
        button.style.transform = 'scale(1.3)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }
}

// ===== Show Product Details =====
function showDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductBrand').textContent = product.brand;
    document.getElementById('modalProductSpecs').textContent = product.specs;
    document.getElementById('modalProductPrice').textContent = `$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    // Update modal image
    const modalImage = document.getElementById('modalProductImage');
    if (modalImage) {
        modalImage.src = product.image;
        modalImage.alt = product.name;
    }

    const statusEl = document.getElementById('modalProductStatus');
    if (product.status === 'available') {
        statusEl.textContent = '✓ Disponible para entrega inmediata';
        statusEl.className = 'product-status-available';
    } else {
        statusEl.textContent = '✗ Producto agotado temporalmente';
        statusEl.className = 'product-status-out';
    }

    const addBtn = document.getElementById('modalAddToCart');
    if (product.status === 'available') {
        addBtn.style.display = 'block';
        addBtn.onclick = () => {
            addToCart(product.id);
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        };
    } else {
        addBtn.style.display = 'none';
    }

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// ===== Notify Me =====
function notifyMe(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    showToast(`Te notificaremos cuando ${product.name} esté disponible`);
}

// ===== Show Toast =====
function showToast(message) {
    const toastEl = document.getElementById('cartToast');
    const messageEl = document.getElementById('toastMessage');
    messageEl.textContent = message;

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
