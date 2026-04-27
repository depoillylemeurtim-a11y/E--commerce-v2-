/* =========================================
   LUMIÈRE — Sérum Éclat Précieux
   App JS
   ========================================= */

const PRODUCT = {
  name: 'Sérum Éclat Précieux',
  price: 69,
  unit: '30 ml',
};

/* ---- STATE ---- */
let cart = [];
let qty = 1;

/* ---- DOM REFS ---- */
const header       = document.getElementById('header');
const cartBtn      = document.getElementById('cartBtn');
const cartCount    = document.getElementById('cartCount');
const cartOverlay  = document.getElementById('cartOverlay');
const cartDrawer   = document.getElementById('cartDrawer');
const cartClose    = document.getElementById('cartClose');
const cartBody     = document.getElementById('cartBody');
const cartFooter   = document.getElementById('cartFooter');
const cartTotal    = document.getElementById('cartTotal');
const toast        = document.getElementById('toast');
const qtyMinus     = document.getElementById('qtyMinus');
const qtyPlus      = document.getElementById('qtyPlus');
const qtyValue     = document.getElementById('qtyValue');
const heroAddCart  = document.getElementById('heroAddCart');
const buyAddCart   = document.getElementById('buyAddCart');
const heroCta      = document.getElementById('heroCta');
const burger       = document.getElementById('burger');
const newsletterForm = document.getElementById('newsletterForm');

/* ---- SCROLL: sticky header ---- */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- QUANTITY CONTROLS ---- */
qtyMinus.addEventListener('click', () => {
  if (qty > 1) { qty--; qtyValue.textContent = qty; }
});

qtyPlus.addEventListener('click', () => {
  if (qty < 10) { qty++; qtyValue.textContent = qty; }
});

/* ---- CART LOGIC ---- */
function addToCart(quantity = 1) {
  const existing = cart.find(i => i.name === PRODUCT.name);
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({ ...PRODUCT, qty: quantity });
  }
  renderCart();
  openCart();
  showToast(`${quantity > 1 ? quantity + 'x ' : ''}${PRODUCT.name} ajouté au panier`);
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  renderCart();
}

function renderCart() {
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const count = cart.reduce((acc, i) => acc + i.qty, 0);

  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
    cartFooter.style.display = 'none';
    return;
  }

  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__qty">${item.unit} · Qté: ${item.qty}</div>
      </div>
      <div class="cart-item__price">${(item.price * item.qty).toFixed(0)} €</div>
      <button class="cart-item__remove" data-name="${item.name}" aria-label="Supprimer">✕</button>
    </div>
  `).join('');

  cartBody.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.name));
  });

  cartTotal.textContent = `${total.toFixed(0)} €`;
  cartFooter.style.display = 'flex';
}

function openCart() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

heroCta.addEventListener('click', () => {
  document.getElementById('buy').scrollIntoView({ behavior: 'smooth' });
});

heroAddCart.addEventListener('click', () => addToCart(1));
buyAddCart.addEventListener('click', () => addToCart(qty));

/* ---- TOAST ---- */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ---- MOBILE BURGER ---- */
let mobileOpen = false;
const navLinks = document.querySelector('.nav__links');
const navActions = document.querySelector('.nav__actions');

burger.addEventListener('click', () => {
  mobileOpen = !mobileOpen;
  if (mobileOpen) {
    navLinks.style.cssText = `
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(26,18,9,0.97);
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      z-index: 99;
    `;
    navLinks.querySelectorAll('a').forEach(a => {
      a.style.cssText = 'font-size: 1.5rem; color: #e8d5b0; letter-spacing: 0.1em;';
      a.addEventListener('click', closeMobile, { once: true });
    });
  } else {
    closeMobile();
  }
});

function closeMobile() {
  mobileOpen = false;
  navLinks.removeAttribute('style');
}

/* ---- INTERSECTION OBSERVER: fade-in ---- */
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animTargets = [
  '.ingredient-card',
  '.ritual__step',
  '.review-card',
  '.stat',
  '.about__image-wrap',
  '.about__text',
  '.buy__card',
];

animTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.cssText = `opacity:0; transform: translateY(24px); transition: opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s;`;
    observer.observe(el);
  });
});

document.head.insertAdjacentHTML('beforeend', `
  <style>.visible { opacity: 1 !important; transform: none !important; }</style>
`);

/* ---- NEWSLETTER ---- */
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input');
  showToast('Merci ! Vous êtes inscrite avec succès.');
  input.value = '';
});

/* ---- INIT ---- */
renderCart();
