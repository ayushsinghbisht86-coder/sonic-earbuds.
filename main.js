/* =========================================================
   SONICBUDS PRO — Page-specific interactive components
   ========================================================= */

/* ---------------- Hero / about parallax ---------------- */
function initParallax(heroId) {
  const hero = document.getElementById(heroId);
  if (!hero) return;
  const media = hero.querySelector(".hero-media");
  function onScroll() {
    const rect = hero.getBoundingClientRect();
    const total = hero.offsetHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / total));
    media.style.transform = `translateY(${progress * 35}%) scale(${1 + progress * 0.15})`;
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------- Product page ---------------- */
function initProductPage() {
  const gallery = document.getElementById("galleryMain");
  if (!gallery) return;

  const images = ["product ear.png", "product earbud.png", "heroic image.png"];
  const mainImg = document.getElementById("galleryMainImg");
  const thumbs = document.querySelectorAll(".gallery-thumbs button");
  thumbs.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      mainImg.style.opacity = 0;
      setTimeout(() => { mainImg.src = images[i]; mainImg.style.opacity = 1; }, 150);
      thumbs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  let variant = "Midnight Black";
  const variantBtns = document.querySelectorAll(".variant-btn");
  const variantLabel = document.getElementById("variantLabel");
  variantBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      variant = btn.dataset.variant;
      variantBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (variantLabel) variantLabel.textContent = variant;
    });
  });

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart({
      id: `sonicbuds-pro-${variant.toLowerCase().replace(/\s/g, "-")}`,
      name: "SonicBuds Pro",
      variant,
      price: 129,
      image: images[0],
    }, 1);
  });

  document.querySelectorAll(".spec").forEach((spec) => {
    spec.querySelector(".spec-q").addEventListener("click", () => {
      const wasOpen = spec.classList.contains("open");
      document.querySelectorAll(".spec").forEach((s) => s.classList.remove("open"));
      if (!wasOpen) spec.classList.add("open");
    });
  });
}

/* ---------------- Cart page ---------------- */
function renderCartPage() {
  const root = document.getElementById("cartPageRoot");
  if (!root) return;
  const items = getCart();
  const subtotal = cartSubtotal(items);

  if (items.length === 0) {
    root.innerHTML = `
      <div class="cart-page-empty glass">
        <p>Nothing in the cart yet.</p>
        <a href="product.html" class="btn-electric">Shop SonicBuds Pro</a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="cart-page-grid">
      <div class="cart-page-items">
        ${items
          .map(
            (i) => `
          <div class="cart-page-row glass">
            <div class="thumb"><img src="${i.image}" alt="${i.name}"></div>
            <div class="info">
              <div class="name">${i.name}</div>
              <div class="variant">${i.variant}</div>
              <div class="actions">
                <div class="qty-control">
                  <button onclick="setCartQty('${i.id}',${i.qty - 1})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg></button>
                  <span>${i.qty}</span>
                  <button onclick="setCartQty('${i.id}',${i.qty + 1})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button>
                </div>
                <button class="remove-link" onclick="removeFromCart('${i.id}')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  Remove
                </button>
              </div>
            </div>
            <div class="price">${money0(i.price * i.qty)}</div>
          </div>`
          )
          .join("")}
      </div>
      <aside class="summary-box glass">
        <div class="h">Summary</div>
        <div class="row"><span class="lbl">Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="row"><span class="lbl">Shipping</span><span style="color:var(--electric)">Free</span></div>
        <div class="row total"><span>Total</span><span>${money(subtotal)}</span></div>
        <a href="checkout.html" class="btn-electric">Checkout →</a>
      </aside>
    </div>
  `;
}

/* ---------------- Checkout page ---------------- */
function initCheckout() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  renderOrderBox();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (getCart().length === 0) return;
    clearCart();
    document.getElementById("checkoutFormView").style.display = "none";
    document.getElementById("orderDoneView").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => { window.location.href = "account.html"; }, 2200);
  });
}

function renderOrderBox() {
  const box = document.getElementById("orderBox");
  if (!box) return;
  const items = getCart();
  const subtotal = cartSubtotal(items);
  const submitBtn = document.getElementById("checkoutSubmit");

  let html = '<div class="h">Order</div>';

  if (items.length === 0) {
    html += `<p class="order-box-empty">Your cart is empty. <a href="product.html">Shop</a>.</p>`;
    if (submitBtn) submitBtn.disabled = true;
  } else {
    html +=
      '<div class="order-list">' +
      items
        .map(
          (i) => `
        <div class="order-row2">
          <div class="thumb"><img src="${i.image}" alt=""></div>
          <div class="info">
            <div class="name">${i.name}</div>
            <div class="variant">${i.variant} · ×${i.qty}</div>
          </div>
          <div class="price">${money0(i.price * i.qty)}</div>
        </div>`
        )
        .join("") +
      "</div>" +
      `<div class="order-totals">
        <div class="row"><span class="lbl">Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="row"><span class="lbl">Shipping</span><span style="color:var(--electric)">Free</span></div>
        <div class="total"><span>Total</span><span>${money(subtotal)}</span></div>
      </div>`;
    if (submitBtn) submitBtn.disabled = false;
  }

  box.innerHTML = html;

  if (submitBtn) submitBtn.querySelector(".pay-amount").textContent = money(subtotal);
}

document.addEventListener("DOMContentLoaded", () => {
  initParallax("hero");
  initParallax("aboutHero");
  initProductPage();
  renderCartPage();
  initCheckout();
});
