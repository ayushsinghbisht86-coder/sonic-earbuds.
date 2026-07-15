/* =========================================================
   SONICBUDS PRO — Cart state, Nav, Cart drawer
   ========================================================= */

const SB_PRODUCT = {
  id: "sonicbuds-pro-black",
  name: "SonicBuds Pro",
  variant: "Midnight Black",
  price: 129,
  image: "product ear.png",
};

function money(n) { return "$" + n.toFixed(2); }
function money0(n) { return "$" + n.toFixed(0); }

/* ---------------- Cart storage (persists like the original — localStorage) ---------------- */
const CART_KEY = "sonic_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function saveCart(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
  renderCartUI();
}
function cartCount(items) { return items.reduce((n, i) => n + i.qty, 0); }
function cartSubtotal(items) { return items.reduce((n, i) => n + i.price * i.qty, 0); }

function addToCart(item, qty) {
  qty = qty || 1;
  const items = getCart();
  const idx = items.findIndex((p) => p.id === item.id);
  if (idx >= 0) items[idx].qty += qty;
  else items.push(Object.assign({}, item, { qty }));
  saveCart(items);
  openCart();
}
function removeFromCart(id) { saveCart(getCart().filter((p) => p.id !== id)); }
function setCartQty(id, qty) {
  qty = Math.max(1, qty);
  saveCart(getCart().map((p) => (p.id === id ? Object.assign({}, p, { qty }) : p)));
}
function clearCart() { saveCart([]); }

/* ---------------- Master render: drawer + page-specific views ---------------- */
function renderCartUI() {
  const items = getCart();
  const count = cartCount(items);

  document.querySelectorAll(".cart-badge").forEach((el) => {
    el.textContent = count;
    el.classList.toggle("show", count > 0);
  });

  renderDrawer(items);

  if (typeof renderCartPage === "function" && document.getElementById("cartPageRoot")) renderCartPage();
  if (typeof renderOrderBox === "function" && document.getElementById("orderBox")) renderOrderBox();
}

function renderDrawer(items) {
  const body = document.getElementById("drawerBody");
  const footer = document.getElementById("drawerFooter");
  if (!body) return;
  const subtotal = cartSubtotal(items);

  if (items.length === 0) {
    body.innerHTML =
      '<div class="cart-drawer-empty"><p>Your cart is quiet.</p>' +
      '<a href="product.html" class="btn-electric" onclick="closeCart()">Shop SonicBuds Pro</a></div>';
    if (footer) footer.classList.remove("show");
    return;
  }

  body.innerHTML = items
    .map(
      (i) => `
    <div class="cart-row glass">
      <div class="thumb"><img src="${i.image}" alt="${i.name}"></div>
      <div class="info">
        <div class="name">${i.name}</div>
        <div class="variant">${i.variant}</div>
        <div class="row2">
          <div class="qty-control">
            <button onclick="setCartQty('${i.id}',${i.qty - 1})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg></button>
            <span>${i.qty}</span>
            <button onclick="setCartQty('${i.id}',${i.qty + 1})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button>
          </div>
          <div class="price">${money0(i.price * i.qty)}</div>
        </div>
      </div>
      <button class="remove" onclick="removeFromCart('${i.id}')" aria-label="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
      </button>
    </div>`
    )
    .join("");

  if (footer) {
    footer.classList.add("show");
    footer.innerHTML = `
      <div class="row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <a href="checkout.html" class="btn-electric w-full" onclick="closeCart()">Checkout →</a>
      <button class="continue" onclick="closeCart()">Continue shopping</button>
    `;
  }
}

/* ---------------- Cart drawer open/close ---------------- */
function openCart() {
  document.getElementById("cartOverlay").classList.add("show");
  document.getElementById("cartDrawer").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cartOverlay").classList.remove("show");
  document.getElementById("cartDrawer").classList.remove("show");
  document.body.style.overflow = "";
}

/* ---------------- Nav ---------------- */
function initNav() {
  const nav = document.getElementById("siteNav");
  if (!nav) return;
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) cartBtn.addEventListener("click", openCart);
  const overlay = document.getElementById("cartOverlay");
  if (overlay) overlay.addEventListener("click", closeCart);
  const drawerClose = document.getElementById("drawerClose");
  if (drawerClose) drawerClose.addEventListener("click", closeCart);
}

/* ---------------- Reveal-on-scroll ---------------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.15, rootMargin: "-80px" }
  );
  els.forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  renderCartUI();
  initReveal();
});
