// Initialize Lucide Icons & Particles
document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Canvas Subtle Champagne/Gold Particle System
    const canvas = document.getElementById("particles-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particlesArray = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            const numberOfParticles = Math.floor((window.innerWidth * window.innerHeight) / 20000);
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // Live Status Widget
    const liveStatus = document.getElementById("live-status");
    if (liveStatus) {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        if (day >= 2 && day <= 6 && hour >= 10 && hour < 20) {
            liveStatus.textContent = "● Abierto ahora mismo";
            liveStatus.className = "text-xs text-emerald-400 font-medium mt-1";
        } else {
            liveStatus.textContent = "● Cerrado (Abre Martes 10:00 hrs)";
            liveStatus.className = "text-xs text-gray-400 font-medium mt-1";
        }
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // Cart Drawer
    const cartDrawer = document.getElementById("cart-drawer");
    const cartPanel = document.getElementById("cart-panel");
    const openCartBtns = document.querySelectorAll("#open-cart-btn");
    const closeCartBtn = document.getElementById("close-cart-btn");

    function openCart() {
        if (cartDrawer && cartPanel) {
            cartDrawer.classList.remove("hidden");
            setTimeout(() => {
                cartPanel.classList.remove("translate-x-full");
            }, 10);
        }
    }

    function closeCart() {
        if (cartDrawer && cartPanel) {
            cartPanel.classList.add("translate-x-full");
            setTimeout(() => {
                cartDrawer.classList.add("hidden");
            }, 300);
        }
    }

    openCartBtns.forEach(btn => btn.addEventListener("click", openCart));
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (cartDrawer) {
        cartDrawer.addEventListener("click", (e) => {
            if (e.target === cartDrawer) closeCart();
        });
    }

    // Cart Management & localStorage
    let cart = JSON.parse(localStorage.getItem("esquina_cart")) || [];

    function saveCart() {
        localStorage.setItem("esquina_cart", JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        const counter = document.getElementById("cart-counter");
        const container = document.getElementById("cart-items-container");
        const totalEl = document.getElementById("cart-total");

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (counter) counter.textContent = totalItems;

        if (container) {
            if (cart.length === 0) {
                container.innerHTML = `<p class="text-gray-400 text-center py-12 text-sm font-light">Tu carrito está vacío.</p>`;
            } else {
                container.innerHTML = cart.map((item, index) => `
                    <div class="flex items-center justify-between p-4 rounded-2xl bg-[#d4af37]/5 border border-[#d4af37]/20">
                        <div>
                            <h4 class="text-sm font-semibold text-white">${item.name}</h4>
                            <p class="text-xs text-[#d4af37] font-light">$${item.price.toLocaleString()} CLP</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-gray-400">Cant: ${item.quantity}</span>
                            <button onclick="window.removeFromCart(${index})" class="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (totalEl) totalEl.textContent = `$${totalPrice.toLocaleString()} CLP`;
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
    };

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".service-card");
            if (!card) return;
            const name = card.getAttribute("data-name");
            const price = parseInt(card.getAttribute("data-price"));

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            saveCart();
            openCart();
        });
    });

    updateCartUI();

    // WhatsApp Checkout (+56 9 3863 7808)
    const checkoutWhatsappBtn = document.getElementById("checkout-whatsapp");
    if (checkoutWhatsappBtn) {
        checkoutWhatsappBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Por favor agrega al menos un servicio antes de cotizar.");
                return;
            }
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let message = "Hola *ESQUINA Studio* (Gral. Gorostiaga 881, Ñuñoa)[cite: 1], me gustaría solicitar la siguiente reserva/cotización:\n\n";
            cart.forEach(item => {
                message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()} CLP\n`;
            });
            message += `\n*Total Estimado:* $${totalPrice.toLocaleString()} CLP\n\nQuedo atento/a para coordinar fecha y hora. ¡Gracias!`;

            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/56938637808?text=${encoded}`, '_blank');
        });
    }

    // Services Filter & Search
    const filterButtons = document.querySelectorAll(".filter-btn");
    const serviceCards = document.querySelectorAll(".service-card");
    const searchInput = document.getElementById("service-search");

    function filterServices() {
        const activeCategory = document.querySelector(".filter-btn.bg-\\[\\#d4af37\\]")?.getAttribute("data-filter") || "all";
        const query = searchInput ? searchInput.value.toLowerCase() : "";

        serviceCards.forEach(card => {
            const category = card.getAttribute("data-category");
            const name = card.getAttribute("data-name").toLowerCase();

            const matchesCategory = activeCategory === "all" || category === activeCategory;
            const matchesSearch = name.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => {
                b.className = "filter-btn px-5 py-2.5 rounded-xl bg-[#d4af37]/5 hover:bg-[#d4af37]/15 text-gray-300 font-medium text-sm transition border border-[#d4af37]/20";
            });
            btn.className = "filter-btn px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-sm transition shadow-md";
            filterServices();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", filterServices);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        item.addEventListener("click", () => {
            const content = item.querySelector(".faq-content");
            const icon = item.querySelector("svg");
            const isOpen = !content.classList.contains("hidden");

            faqItems.forEach(i => {
                i.querySelector(".faq-content").classList.add("hidden");
                i.querySelector("svg").style.transform = "rotate(0deg)";
            });

            if (!isOpen) {
                content.classList.remove("hidden");
                icon.style.transform = "rotate(180deg)";
            }
        });
    });

    // Contact Form
    const contactForm = document.getElementById("contact-form");
    const formSuccess = document.getElementById("form-success");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            formSuccess.classList.remove("hidden");
            contactForm.reset();
            setTimeout(() => {
                formSuccess.classList.add("hidden");
            }, 5000);
        });
    }
});