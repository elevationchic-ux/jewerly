function ensureLoader() {
   let loader = document.getElementById('siteLoader');
   if (!loader) {
      loader = document.createElement('div');
      loader.id = 'siteLoader';
      loader.setAttribute('aria-live', 'polite');
      loader.setAttribute('aria-label', 'Loading Aurelia Atelier');
      loader.innerHTML = `
         <div class="loader-core">
            <div class="loader-mark" aria-hidden="true"></div>
            <div class="loader-brand">Aurelia Atelier</div>
            <div class="loader-line" aria-hidden="true"></div>
         </div>
      `;
      document.body.insertBefore(loader, document.body.firstChild);
   }

   document.body.classList.add('is-loading');
   window.addEventListener('load', () => {
      window.setTimeout(() => {
         loader.classList.add('hidden');
         document.body.classList.remove('is-loading');
      }, 650);
   });
}

ensureLoader();

const header = document.getElementById('header');
if (header) {
   const applyHeaderState = () => {
      if (window.scrollY > 40) {
         header.classList.add('scrolled');
      } else {
         header.classList.remove('scrolled');
      }
   };

   applyHeaderState();
   window.addEventListener('scroll', applyHeaderState, { passive: true });
}


// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

function openMobileNav() {
   if (!mobileNav || !mobileOverlay) return;
   mobileNav.classList.add('active');
   mobileOverlay.classList.add('active');
   document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
   if (!mobileNav || !mobileOverlay) return;
   mobileNav.classList.remove('active');
   mobileOverlay.classList.remove('active');
   document.body.style.overflow = '';
}

if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

mobileNavLinks.forEach(link => {
   link.addEventListener('click', closeMobileNav);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href === '#') {
         window.scrollTo({
            top: 0,
            behavior: 'smooth'
         });
         return;
      }
      const target = document.querySelector(href);
      if (target) {
         const headerHeight = header.offsetHeight;
         const targetPosition = target.offsetTop - headerHeight;
         window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
         });
      }
   });
});

// Hero image slideshow
const slides = document.querySelectorAll('.hero-slide');
const heroTitle = document.getElementById('heroTitle');
const heroPrice = document.getElementById('heroPrice');
let currentSlide = 0;

if (slides.length > 0 && heroTitle && heroPrice) {
   function changeSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;

      // Fade out text
      heroTitle.style.opacity = '0';
      heroPrice.style.opacity = '0';

      setTimeout(() => {
         heroTitle.textContent = slides[currentSlide].dataset.title;
         heroPrice.textContent = slides[currentSlide].dataset.price;
         heroTitle.style.opacity = '1';
         heroPrice.style.opacity = '1';
      }, 500);

      slides[currentSlide].classList.add('active');
   }

   setInterval(changeSlide, 4000);
}

// Premium collection filters and sorting
const normalizeCategory = (value = '') => {
   const normalized = String(value || '').trim().toLowerCase();
   if (!normalized) return 'all';
   if (['pendant', 'necklace', 'earrings', 'chain'].includes(normalized)) return 'necklace';
   if (['bangle', 'cuff', 'wrap'].includes(normalized)) return 'cuff';
   return normalized;
};

const getProductCards = () => Array.from(document.querySelectorAll('.product-card'));
const getCardPriceValue = (card) => {
   const rawPrice = card.dataset.price || card.querySelector('.product-price')?.textContent || '0';
   const cleaned = String(rawPrice).replace(/[^0-9.-]/g, '');
   const parsed = Number.parseFloat(cleaned || '0');
   return Number.isFinite(parsed) ? parsed : 0;
};

const applyProductFilters = () => {
   const activeFilter = document.querySelector('.filter-pill.is-active')?.dataset.filter || 'all';
   const normalizedActive = normalizeCategory(activeFilter);

   getProductCards().forEach(card => {
      const matches = normalizedActive === 'all' || normalizeCategory(card.dataset.category) === normalizedActive;
      card.classList.toggle('is-hidden', !matches);
   });
};

const sortProductCards = (grid, mode = 'featured') => {
   if (!grid) return;

   const cards = Array.from(grid.querySelectorAll('.product-card'));
   if (cards.length < 2) return;

   const sortedCards = [...cards].sort((a, b) => {
      if (mode === 'low') return getCardPriceValue(a) - getCardPriceValue(b);
      if (mode === 'high') return getCardPriceValue(b) - getCardPriceValue(a);
      return 0;
   });

   sortedCards.forEach(card => grid.appendChild(card));
};

document.querySelectorAll('.filter-pill').forEach(button => {
   button.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.toggle('is-active', btn === button));
      applyProductFilters();
   });
});

document.querySelectorAll('.catalog-sort select').forEach(select => {
   select.addEventListener('change', () => {
      const mode = select.value.toLowerCase().includes('low') ? 'low' : select.value.toLowerCase().includes('high') ? 'high' : 'featured';
      const grid = select.closest('.catalog-toolbar')?.nextElementSibling;
      if (grid) {
         sortProductCards(grid, mode);
      }
   });
});

const PREMIUM_PRODUCT_LOOKUP = {
    amour: { id: 'amour', name: 'Amour', price: 7420, image: 'images/product-pink-sapphire.jpg', category: 'Ring', variants: [{"label": "Bridal Gold", "price": 0}, {"label": "Diamond Pavé Band", "price": 1900}, {"label": "Rose Gold Setting", "price": 840}] },
    apex: { id: 'apex', name: 'Apex', price: 4880, image: 'images/product-apex.jpg', category: 'Pendant', variants: [{"label": "Architectural Gold", "price": 0}, {"label": "Sapphire Core", "price": 950}, {"label": "Onyx Contrast", "price": 700}] },
    arcade: { id: 'arcade', name: 'Arcade', price: 3380, image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=900&q=80', category: 'Ring', variants: [{"label": "Royal Sapphire", "price": 0}, {"label": "Emerald Variant", "price": 800}, {"label": "Platinum Arch", "price": 920}] },
    aster: { id: 'aster', name: 'Aster', price: 4380, image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80', category: 'Pendant', variants: [{"label": "Classic Pearl Gold", "price": 0}, {"label": "Diamond Spacers", "price": 1100}, {"label": "Rose Gold Accent", "price": 450}] },
    atlas: { id: 'atlas', name: 'Atlas', price: 2840, image: 'images/product-atlas.jpg', category: 'Bracelet', variants: [{"label": "Polished 18K Gold", "price": 0}, {"label": "Satin Brushed Finish", "price": 320}, {"label": "Diamond Pavé Rim", "price": 1180}] },
    aurel: { id: 'aurel', name: 'Aurel', price: 4420, image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80', category: 'Earrings', variants: [{"label": "Gold & Pearl Drop", "price": 0}, {"label": "Emerald Pivot", "price": 980}, {"label": "Diamond Drop Cascade", "price": 1450}] },
    aurora: { id: 'aurora', name: 'Aurora', price: 4850, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80', category: 'Pendant', variants: [{"label": "Classic 18K Gold", "price": 0}, {"label": "Rose Gold", "price": 250}, {"label": "Platinum Setting", "price": 680}] },
    celeste: { id: 'celeste', name: 'Céleste', price: 4200, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80', category: 'Pendant', variants: [{"label": "Champagne Gold", "price": 0}, {"label": "Emerald Accent", "price": 1100}, {"label": "Pearl Drop", "price": 650}] },
    clair: { id: 'clair', name: 'Clair', price: 3870, image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=900&q=80', category: 'Pendant', variants: [{"label": "Pure Yellow Gold", "price": 0}, {"label": "Diamond Pavé Drop", "price": 820}, {"label": "Warm Rose Gold", "price": 280}] },
    crest: { id: 'crest', name: 'Crest', price: 3650, image: 'images/product-crest.jpg', category: 'Pendant', variants: [{"label": "Solid Gold Shield", "price": 0}, {"label": "Black Diamond Pavé", "price": 1100}, {"label": "Hand-Engraved Initials", "price": 350}] },
    dorian: { id: 'dorian', name: 'Dorian', price: 4610, image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=80', category: 'Pendant', variants: [{"label": "Fluted 18K Gold", "price": 0}, {"label": "Sapphire Core", "price": 950}, {"label": "Patina Bronze Tone", "price": 420}] },
    echo: { id: 'echo', name: 'Echo', price: 4560, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', category: 'Pendant', variants: [{"label": "Warm Gold", "price": 0}, {"label": "Moonstone Accent", "price": 820}, {"label": "Sapphire Core", "price": 1300}] },
    epoque: { id: 'epoque', name: 'Époque', price: 5180, image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=900&q=80', category: 'Bracelet', variants: [{"label": "Archival Braided Gold", "price": 0}, {"label": "Gemstone Finials", "price": 1380}, {"label": "Diamond Pavé Clasp", "price": 1540}] },
    etoile: { id: 'etoile', name: 'Étoile', price: 6400, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80', category: 'Ring', variants: [{"label": "Bridal 18K Gold", "price": 0}, {"label": "Platinum Setting", "price": 1600}, {"label": "Rose Gold Arc", "price": 950}] },
    lumiere: { id: 'lumiere', name: 'Lumière', price: 5290, image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=900&q=80', category: 'Earrings', variants: [{"label": "Emerald & Gold", "price": 0}, {"label": "Royal Blue Sapphire", "price": 780}, {"label": "Diamond Pavé Chandelier", "price": 1850}] },
    luna: { id: 'luna', name: 'Luna', price: 2950, image: 'images/product-wedding-rings.jpg', category: 'Ring', variants: [{"label": "Classic 18K Gold", "price": 0}, {"label": "White Gold", "price": 300}, {"label": "Rose Gold Glow", "price": 250}] },
    lune: { id: 'lune', name: 'Lune', price: 3280, image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80', category: 'Ring', variants: [{"label": "Dual Gold Classic", "price": 0}, {"label": "Single Tone Yellow Gold", "price": 200}, {"label": "Full Platinum Band", "price": 950}] },
    maison: { id: 'maison', name: 'Maison', price: 3480, image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80', category: 'Bracelet', variants: [{"label": "Classic Gold", "price": 0}, {"label": "Diamanté Accent", "price": 1140}, {"label": "Pearl Charm Inset", "price": 760}] },
    marceau: { id: 'marceau', name: 'Marceau', price: 3880, image: 'images/product-marceau.jpg', category: 'Ring', variants: [{"label": "Heritage Yellow Gold", "price": 0}, {"label": "Antique Patina Gold", "price": 350}, {"label": "Diamond Pavé Center", "price": 1250}] },
    mason: { id: 'mason', name: 'Mason', price: 4200, image: 'images/product-mason.jpg', category: 'Ring', variants: [{"label": "Chiseled Gold", "price": 0}, {"label": "Matte White Gold", "price": 380}, {"label": "Diamond Channel Inset", "price": 1400}] },
    mireille: { id: 'mireille', name: 'Mireille', price: 2970, image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80', category: 'Bracelet', variants: [{"label": "Heirloom Yellow Gold", "price": 0}, {"label": "Rose Gold Tint", "price": 290}, {"label": "Diamond Charm Inset", "price": 860}] },
    miroir: { id: 'miroir', name: 'Miroir', price: 2980, image: 'images/product-miroir.jpg', category: 'Ring', variants: [{"label": "Classic 18K Gold", "price": 0}, {"label": "Diamond Encrusted", "price": 880}, {"label": "Platinum Alloy", "price": 650}] },
    monarch: { id: 'monarch', name: 'Monarch', price: 3260, image: 'images/product-monarch.jpg', category: 'Ring', variants: [{"label": "Bold 18K Gold", "price": 0}, {"label": "Obsidian Finish", "price": 480}, {"label": "Diamond Encrusted", "price": 1350}] },
    nera: { id: 'nera', name: 'Nera', price: 3340, image: 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=900&q=80', category: 'Ring', variants: [{"label": "Sculpted Gold", "price": 0}, {"label": "Pavé Diamond Inset", "price": 1120}, {"label": "Brushed Rose Gold", "price": 420}] },
    nero: { id: 'nero', name: 'Nero', price: 2980, image: 'images/product-nero.jpg', category: 'Ring', variants: [{"label": "Solid Gold Signet", "price": 0}, {"label": "Onyx Crown Plate", "price": 540}, {"label": "Diamond Corner Inset", "price": 920}] },
    nivara: { id: 'nivara', name: 'Nivara', price: 3650, image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80', category: 'Bracelet', variants: [{"label": "Gemstone Cabochon Gold", "price": 0}, {"label": "Sapphire & Emerald Inset", "price": 920}, {"label": "Diamond Orbit", "price": 1340}] },
    nocturne: { id: 'nocturne', name: 'Nocturne', price: 4190, image: 'images/product-nocturne.jpg', category: 'Pendant', variants: [{"label": "Archival Gold Medallion", "price": 0}, {"label": "Diamond Star Cluster", "price": 1200}, {"label": "Blue Enamel Inlay", "price": 780}] },
    noir: { id: 'noir', name: 'Noir', price: 3650, image: 'images/product-noir.jpg', category: 'Ring', variants: [{"label": "Obsidian Gold", "price": 0}, {"label": "Diamond Cut Bezel", "price": 1280}, {"label": "Onyx Detail", "price": 600}] },
    orion: { id: 'orion', name: 'Orion', price: 3610, image: 'images/product-orion.jpg', category: 'Bracelet', variants: [{"label": "Solid Gold Torque", "price": 0}, {"label": "Matte Gunmetal Accent", "price": 490}, {"label": "Black Diamond Terminals", "price": 1250}] },
    rosalie: { id: 'rosalie', name: 'Rosalie', price: 4120, image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80', category: 'Bracelet', variants: [{"label": "Brilliant Diamond Gold", "price": 0}, {"label": "Platinum Tennis Setting", "price": 1450}, {"label": "Rose Gold Setting", "price": 680}] },
    serein: { id: 'serein', name: 'Serein', price: 3210, image: 'images/maison-doree-05.jpg', category: 'Bracelet', variants: [{"label": "Pure Yellow Gold", "price": 0}, {"label": "White Gold Polish", "price": 280}, {"label": "Rose Gold Glow", "price": 250}] },
    serin: { id: 'serin', name: 'Serin', price: 3120, image: 'images/product-serin.jpg', category: 'Ring', variants: [{"label": "Warm 18K Gold", "price": 0}, {"label": "Diamond Pavé Edge", "price": 980}, {"label": "Rose Gold Arc", "price": 720}] },
    solstice: { id: 'solstice', name: 'Solstice', price: 3680, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80', category: 'Cuff', variants: [{"label": "Classic Sculpted Gold", "price": 0}, {"label": "Pearl Accent Finials", "price": 750}, {"label": "Sapphire Inset Edge", "price": 1200}] },
    vale: { id: 'vale', name: 'Vale', price: 3410, image: 'images/product-vale.jpg', category: 'Bracelet', variants: [{"label": "Solid Heavy Gold", "price": 0}, {"label": "Brushed Titanium & Gold", "price": 650}, {"label": "Diamond Pavé Bar", "price": 1420}] },
    valence: { id: 'valence', name: 'Valence', price: 3510, image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80', category: 'Earrings', variants: [{"label": "Polished 18K Gold", "price": 0}, {"label": "Diamond Tip Accent", "price": 820}, {"label": "Brushed Rose Gold", "price": 340}] },
    vallee: { id: 'vallee', name: 'Vallée', price: 3520, image: 'images/product-vallee.jpg', category: 'Bracelet', variants: [{"label": "Classic Vallée Gold", "price": 0}, {"label": "Diamond Link Accents", "price": 1150}, {"label": "Two-Tone Gold Mix", "price": 480}] },
    vanta: { id: 'vanta', name: 'Vanta', price: 3940, image: 'images/product-vanta.jpg', category: 'Necklace', variants: [{"label": "Classic Heavy Gold", "price": 0}, {"label": "Black Onyx Insets", "price": 620}, {"label": "Sapphire Set Clasp", "price": 1320}] },
    vesper: { id: 'vesper', name: 'Vesper', price: 4210, image: 'images/maison-hero-03.jpg', category: 'Pendant', variants: [{"label": "Evening Emerald", "price": 0}, {"label": "Royal Sapphire", "price": 620}, {"label": "Diamond Solitaire Drop", "price": 1450}] }
};

const STORAGE_KEYS = {
   cart: 'maison-doree-cart-v1',
   wishlist: 'maison-doree-wishlist-v1'
};

const formatMoney = (value) => new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
   maximumFractionDigits: 0
}).format(value);

function getStoredJSON(key, fallback) {
   try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
   } catch (error) {
      return fallback;
   }
}

function setStoredJSON(key, value) {
   try {
      localStorage.setItem(key, JSON.stringify(value));
   } catch (error) {
      console.warn('Unable to persist local store', error);
   }
}

function getCartItems() {
   return getStoredJSON(STORAGE_KEYS.cart, []);
}

function getWishlistItems() {
   return getStoredJSON(STORAGE_KEYS.wishlist, []);
}

function saveCartItems(items) {
   setStoredJSON(STORAGE_KEYS.cart, items);
}

function saveWishlistItems(items) {
   setStoredJSON(STORAGE_KEYS.wishlist, items);
}

function showLuxuryToast(message) {
   let toast = document.getElementById('luxuryToast');
   if (!toast) {
      toast = document.createElement('div');
      toast.id = 'luxuryToast';
      toast.className = 'luxury-toast';
      document.body.appendChild(toast);
   }
   toast.innerHTML = `<span class="toast-mark">✧</span> <span class="toast-text">${message}</span>`;
   toast.classList.add('is-visible');
   clearTimeout(toast._timeout);
   toast._timeout = setTimeout(() => {
      toast.classList.remove('is-visible');
   }, 3000);
}

function addToCart(productId, quantity = 1, variantLabel = 'Default', customDetails = {}) {
   const product = PREMIUM_PRODUCT_LOOKUP[productId] || PREMIUM_PRODUCT_LOOKUP.aurora;
   const variantDetails = product.variants.find(item => item.label === variantLabel) || null;
   const finalPrice = product.price + (variantDetails ? variantDetails.price : 0) + (customDetails && customDetails.engraving ? 280 : 0) + (customDetails && customDetails.giftWrap ? 180 : 0) + (customDetails && customDetails.warranty ? 450 : 0);
   const cart = getCartItems();
   const engravingSegment = customDetails && customDetails.engraving ? `-${customDetails.engraving.trim().replace(/\s+/g, '-').toLowerCase()}` : '';
   const completionSegment = customDetails && customDetails.completion ? `-${customDetails.completion}` : '';
   const cartKey = `${productId}-${variantLabel}${engravingSegment}${completionSegment}`;
   const existing = cart.find(item => item.cartKey === cartKey);

   if (existing) {
      existing.quantity += quantity;
   } else {
      cart.push({
         cartKey,
         productId,
         name: product.name,
         price: finalPrice,
         variant: variantLabel,
         image: product.image,
         customDetails,
         quantity
      });
   }

   saveCartItems(cart);
   renderCartPanel();
   showLuxuryToast(`${product.name} added to your shopping bag`);
   window.dispatchEvent(new CustomEvent('maisonDoree:cartUpdated'));
}

function toggleWishlist(productId) {
   const wishlist = getWishlistItems();
   const existingIndex = wishlist.indexOf(productId);
   const product = PREMIUM_PRODUCT_LOOKUP[productId] || { name: 'Signature piece' };

   if (existingIndex >= 0) {
      wishlist.splice(existingIndex, 1);
      showLuxuryToast(`${product.name} removed from wishlist`);
   } else {
      wishlist.push(productId);
      showLuxuryToast(`${product.name} saved to wishlist`);
   }

   saveWishlistItems(wishlist);
   renderWishlistPanel();
   updateWishlistButtons();
}

function buildCartItemMarkup(item) {
   const detailBits = [];
   if (item.variant) detailBits.push(item.variant);
   if (item.customDetails && item.customDetails.engraving) detailBits.push(`Engraving: ${item.customDetails.engraving}`);
   if (item.customDetails && item.customDetails.completion) detailBits.push(item.customDetails.completion);
   const detailText = detailBits.join(' · ');

   return `
      <div class="panel-item">
         <div class="panel-item-media">
            <img src="${item.image}" alt="${item.name}">
         </div>
         <div class="panel-item-copy">
            <h4>${item.name}</h4>
            <p>${detailText || 'Signature atelier finish'}</p>
            <div class="panel-item-meta">
               <span>${item.quantity} × ${formatMoney(item.price)}</span>
               <button type="button" data-cart-remove="${item.cartKey}">Remove</button>
            </div>
         </div>
      </div>
   `;
}

function renderCartPanel() {
   const panel = document.getElementById('premiumCartPanel');
   if (!panel) return;

   const cart = getCartItems();
   const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
   const count = cart.reduce((sum, item) => sum + item.quantity, 0);

   const list = cart.length ? cart.map(buildCartItemMarkup).join('') : '<p class="panel-empty">Your bag is empty.</p>';
   panel.innerHTML = `
      <div class="premium-panel-header">
         <div>
            <p class="text-label">Your selection</p>
            <h3>Shopping bag</h3>
         </div>
         <button type="button" class="panel-close" data-close-panel="cart">×</button>
      </div>
      <div class="premium-panel-items">${list}</div>
      <div class="premium-panel-footer">
         <div class="panel-total-row">
            <span>Total</span>
            <strong>${formatMoney(total)}</strong>
         </div>
         <a href="cart.html" class="btn-primary panel-checkout">Proceed to checkout</a>
      </div>
   `;

   const countBadge = document.getElementById('cartCount');
   if (countBadge) countBadge.textContent = count;
}

function renderWishlistPanel() {
   const panel = document.getElementById('premiumWishlistPanel');
   if (!panel) return;

   const wishlist = getWishlistItems();
   const countBadge = document.getElementById('wishlistCount');
   if (countBadge) countBadge.textContent = wishlist.length;

   if (!wishlist.length) {
      panel.innerHTML = `
         <div class="premium-panel-header">
            <div>
               <p class="text-label">Saved pieces</p>
               <h3>Wishlist</h3>
            </div>
            <button type="button" class="panel-close" data-close-panel="wishlist">×</button>
         </div>
         <div class="panel-empty-block"><p>Your wishlist is empty.</p></div>
      `;
      return;
   }

   const items = wishlist.map(id => {
      const product = PREMIUM_PRODUCT_LOOKUP[id] || PREMIUM_PRODUCT_LOOKUP.aurora;
      return `
         <div class="panel-item panel-item-compact">
            <div class="panel-item-media">
               <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="panel-item-copy">
               <h4>${product.name}</h4>
               <p>${product.category}</p>
               <div class="panel-item-meta">
                  <span>${formatMoney(product.price)}</span>
                  <a href="product.html?product=${product.id}">View</a>
               </div>
            </div>
         </div>
      `;
   }).join('');

   panel.innerHTML = `
      <div class="premium-panel-header">
         <div>
            <p class="text-label">Saved pieces</p>
            <h3>Wishlist</h3>
         </div>
         <button type="button" class="panel-close" data-close-panel="wishlist">×</button>
      </div>
      <div class="premium-panel-items">${items}</div>
   `;
}

function removeCartItem(cartKey) {
   const cart = getCartItems().filter(item => item.cartKey !== cartKey);
   saveCartItems(cart);
   renderCartPanel();
}

function setupPremiumPanels() {
   if (document.getElementById('siteCommerceDock')) return;

   const dock = document.createElement('div');
   dock.id = 'siteCommerceDock';
   dock.className = 'site-commerce-dock';
   dock.innerHTML = `
      <button type="button" class="commerce-pill" id="cartTrigger" aria-label="Open shopping bag">
         <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 11H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>
         <strong id="cartCount">0</strong>
      </button>
      <button type="button" class="commerce-pill" id="wishlistTrigger" aria-label="Open wishlist">
         <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5c-5.3-3.5-8-6.4-8-10.1A4.6 4.6 0 0 1 8.6 6c1.4 0 2.7.7 3.4 1.8A4.3 4.3 0 0 1 15.4 6 4.6 4.6 0 0 1 20 10.4c0 3.7-2.7 6.6-8 10.1Z"/></svg>
         <strong id="wishlistCount">0</strong>
      </button>
      <aside class="premium-panel" id="premiumCartPanel"></aside>
      <aside class="premium-panel" id="premiumWishlistPanel"></aside>
   `;
   document.body.appendChild(dock);

   document.getElementById('cartTrigger').addEventListener('click', () => {
      const panel = document.getElementById('premiumCartPanel');
      panel.classList.toggle('is-open');
      document.getElementById('premiumWishlistPanel').classList.remove('is-open');
   });

   document.getElementById('wishlistTrigger').addEventListener('click', () => {
      const panel = document.getElementById('premiumWishlistPanel');
      panel.classList.toggle('is-open');
      document.getElementById('premiumCartPanel').classList.remove('is-open');
   });

   document.addEventListener('click', (event) => {
      const removeButton = event.target.closest('[data-cart-remove]');
      if (removeButton) {
         removeCartItem(removeButton.dataset.cartRemove);
      }

      const closeTarget = event.target.closest('[data-close-panel]');
      if (closeTarget) {
         const targetPanel = closeTarget.dataset.closePanel === 'cart' ? document.getElementById('premiumCartPanel') : document.getElementById('premiumWishlistPanel');
         targetPanel.classList.remove('is-open');
      }
   });

   renderCartPanel();
   renderWishlistPanel();
}

function updateWishlistButtons() {
   const wishlist = getWishlistItems();
   document.querySelectorAll('[data-toggle-wishlist]').forEach(button => {
      const productId = button.dataset.productId;
      const active = wishlist.includes(productId);
      button.classList.toggle('is-saved', active);
      button.textContent = active ? 'Saved to wishlist' : 'Save to wishlist';
   });

   document.querySelectorAll('[data-wishlist-card-toggle]').forEach(button => {
      const productId = button.dataset.productId;
      const active = wishlist.includes(productId);
      button.classList.toggle('is-saved', active);
      button.innerHTML = active ? '<span style="color: #b8860b;">♥</span>' : '♡';
      button.setAttribute('title', active ? 'Saved to wishlist' : 'Save to wishlist');
   });
}

function bindQuickProductActions() {
   const wishlist = getWishlistItems();
   document.querySelectorAll('.product-card').forEach(card => {
      const link = card.querySelector('a[href*="product.html"]');
      if (!link || card.querySelector('[data-wishlist-card-toggle]')) return;

      let productId = 'aurora';
      try {
         const parsed = new URL(link.getAttribute('href'), window.location.href);
         productId = parsed.searchParams.get('product') || 'aurora';
      } catch (e) {
         const m = (link.getAttribute('href') || '').match(/product=([a-zA-Z0-9_-]+)/);
         if (m) productId = m[1];
      }

      const isSaved = wishlist.includes(productId);
      const quickActions = document.createElement('div');
      quickActions.className = 'product-card-actions';
      quickActions.innerHTML = `
         <button type="button" class="mini-action-btn" data-product-id="${productId}" data-add-to-cart aria-label="Add to bag">
            <span>✦ Add to Bag</span>
         </button>
         <button type="button" class="mini-action-btn mini-action-btn-secondary ${isSaved ? 'is-saved' : ''}" data-product-id="${productId}" data-wishlist-card-toggle aria-label="Save to wishlist">
            ${isSaved ? '<span style="color: #b8860b;">♥</span>' : '♡'}
         </button>
      `;
      card.appendChild(quickActions);
   });
}

window.bindQuickProductActions = bindQuickProductActions;

// Auto-observe dynamic grid rendering
if (typeof MutationObserver !== 'undefined') {
   const gridObserver = new MutationObserver(() => {
      bindQuickProductActions();
   });
   const startObserving = () => {
      document.querySelectorAll('.product-grid').forEach(grid => {
         gridObserver.observe(grid, { childList: true });
      });
   };
   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startObserving);
   } else {
      startObserving();
   }
}

document.addEventListener('click', (event) => {
   const cartButton = event.target.closest('[data-add-to-cart]');
   const wishlistButton = event.target.closest('[data-wishlist-card-toggle]');

   if (cartButton) {
      event.preventDefault();
      const productId = cartButton.dataset.productId;
      addToCart(productId, 1, 'Default');
   }

   if (wishlistButton) {
      event.preventDefault();
      const productId = wishlistButton.dataset.productId;
      toggleWishlist(productId);
   }
});

function openCustomizationModal(productId) {
   const product = PREMIUM_PRODUCT_LOOKUP[productId] || PREMIUM_PRODUCT_LOOKUP.aurora;
   const existing = document.getElementById('customizationModal');
   if (existing) existing.remove();

   const modal = document.createElement('div');
   modal.id = 'customizationModal';
   modal.className = 'customization-modal is-open';
   modal.innerHTML = `
      <div class="customization-backdrop" data-close-customization="true"></div>
      <div class="customization-dialog" role="dialog" aria-modal="true" aria-labelledby="customizationTitle">
          <button type="button" class="customization-close" aria-label="Close customization" data-close-customization="true">×</button>
          <div class="customization-header">
              <p class="text-label">Private atelier service</p>
              <h3 id="customizationTitle">Personalize ${product.name}</h3>
          </div>
          <div class="customization-body">
              <div class="customization-media">
                  <img src="${product.image}" alt="${product.name}">
              </div>
              <div class="customization-form">
                  <label>
                      <span>Stone / finish</span>
                      <select id="customStoneSelect">
                          ${product.variants.map(option => `<option value="${option.label}">${option.label}${option.price ? ' (+$' + option.price.toLocaleString() + ')' : ' (Included)'}</option>`).join('')}
                      </select>
                  </label>
                  <label>
                      <span>Engraving</span>
                      <input id="customEngravingInput" type="text" maxlength="18" placeholder="e.g. Always" />
                  </label>
                  <label>
                      <span>Completion</span>
                      <select id="customCompletionSelect">
                          <option value="standard">Standard atelier finish</option>
                          <option value="signature">Signature polishing</option>
                          <option value="heirloom">Heirloom finishing</option>
                      </select>
                  </label>
                  <div class="customization-checklist">
                      <label><input type="checkbox" id="customGiftWrap" /> Gift wrap</label>
                      <label><input type="checkbox" id="customWarranty" /> 5-year care warranty</label>
                  </div>
                  <div class="customization-total-row">
                      <span>Estimated total</span>
                      <strong>${formatMoney(product.price)}</strong>
                  </div>
              </div>
          </div>
          <div class="customization-footer">
              <button type="button" class="btn-secondary" data-close-customization="true">Continue browsing</button>
              <button type="button" class="btn-primary" id="confirmCustomizationButton">Add to bag</button>
          </div>
      </div>
  `;

   document.body.appendChild(modal);

   const select = modal.querySelector('#customStoneSelect');
   const engravingInput = modal.querySelector('#customEngravingInput');
   const giftWrap = modal.querySelector('#customGiftWrap');
   const warranty = modal.querySelector('#customWarranty');
   const total = modal.querySelector('.customization-total-row strong');

   function refreshEstimate() {
      const selected = product.variants.find(item => item.label === select.value) || product.variants[0];
      const engravingCharge = engravingInput.value.trim() ? 280 : 0;
      const giftWrapCharge = giftWrap.checked ? 180 : 0;
      const warrantyCharge = warranty.checked ? 450 : 0;
      const amount = product.price + (selected.price || 0) + engravingCharge + giftWrapCharge + warrantyCharge;
      total.textContent = formatMoney(amount);
   }

   select.addEventListener('change', refreshEstimate);
   engravingInput.addEventListener('input', refreshEstimate);
   giftWrap.addEventListener('change', refreshEstimate);
   warranty.addEventListener('change', refreshEstimate);

   modal.addEventListener('click', (event) => {
      if (event.target.matches('[data-close-customization="true"]')) {
         modal.remove();
      }
   });

   modal.querySelector('#confirmCustomizationButton').addEventListener('click', () => {
      const selectedStone = select.value || 'Default';
      const engravingValue = engravingInput.value.trim();
      addToCart(productId, 1, selectedStone, {
         engraving: engravingValue,
         giftWrap: giftWrap.checked,
         warranty: warranty.checked,
         completion: modal.querySelector('#customCompletionSelect').value
      });
      modal.remove();
   });
}

function renderCartSummaryFromStorage() {
   const cart = getCartItems();
   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
   const shipping = subtotal > 0 ? 120 : 0;
   const insurance = subtotal > 0 ? 180 : 0;
   const total = subtotal + shipping + insurance;

   const subtotalNode = document.getElementById('summarySubtotal');
   const shippingNode = document.getElementById('summaryShipping');
   const insuranceNode = document.getElementById('summaryInsurance');
   const totalNode = document.getElementById('summaryTotal');

   if (subtotalNode) subtotalNode.textContent = formatMoney(subtotal);
   if (shippingNode) shippingNode.textContent = formatMoney(shipping);
   if (insuranceNode) insuranceNode.textContent = formatMoney(insurance);
   if (totalNode) totalNode.textContent = formatMoney(total);
}

function bindDetailWishlistButton() {
   const button = document.querySelector('[data-toggle-wishlist]');
   if (!button) return;

   const productId = button.dataset.productId || 'aurora';
   const wishlist = getWishlistItems();
   button.classList.toggle('is-saved', wishlist.includes(productId));
   button.textContent = wishlist.includes(productId) ? 'Saved to wishlist' : 'Save to wishlist';

   button.addEventListener('click', (event) => {
      event.preventDefault();
      toggleWishlist(productId);
      updateWishlistButtons();
   });
}

function bindAddToBagButton() {
   const button = document.querySelector('[data-add-to-cart-primary]');
   if (!button) return;

   button.addEventListener('click', () => {
      const productId = button.dataset.productId || 'aurora';
      openCustomizationModal(productId);
   });
}

// Form submission
const form = document.getElementById('appointmentForm');
if (form) {
   form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for your inquiry! We will contact you within 24 hours to confirm your appointment.');
      form.reset();
   });
}

setupPremiumPanels();
renderCartPanel();
renderWishlistPanel();
updateWishlistButtons();
bindQuickProductActions();
bindDetailWishlistButton();
bindAddToBagButton();

// Intersection Observer for scroll animations
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

// Add fade-in animation to sections
document.querySelectorAll('section:not(.hero)').forEach(section => {
   section.style.opacity = '0';
   section.style.transform = 'translateY(30px)';
   section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
   observer.observe(section);
});