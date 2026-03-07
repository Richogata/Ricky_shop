(function () {
  const products = window.PRODUCTS || [];
  const store = window.STORE || {};

  const getProduct = (id) => products.find((p) => p.id === id);
  const cartKey = "ricky_cart_v2";

  function cartRead() {
    try { return JSON.parse(localStorage.getItem(cartKey) || "[]"); }
    catch { return []; }
  }
  function cartWrite(data) {
    localStorage.setItem(cartKey, JSON.stringify(data));
    updateCount();
  }

  function updateCount() {
    const count = cartRead().reduce((sum, it) => sum + it.qty, 0);
    document.querySelectorAll("[data-count]").forEach((el) => el.textContent = String(count));
  }

  function addCart(id, qty) {
    const q = Math.max(1, Number(qty || 1));
    const cart = cartRead();
    const line = cart.find((x) => x.id === id);
    if (line) line.qty += q; else cart.push({ id, qty: q });
    cartWrite(cart);
  }

  function removeCart(id) {
    cartWrite(cartRead().filter((x) => x.id !== id));
  }

  function whatsappUrl(text) {
    return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  function withFallback(images) {
    const list = Array.isArray(images) ? images.filter(Boolean) : [];
    const first = list[0] || "";
    const next = list.slice(1).join("||");
    return { first, next };
  }

  function activateFallbackImages(scope) {
    scope.querySelectorAll("img[data-fallback]").forEach((img) => {
      if (img.dataset.bound === "1") return;
      img.dataset.bound = "1";
      img.addEventListener("error", () => {
        const queue = (img.dataset.fallback || "").split("||").filter(Boolean);
        if (!queue.length) return;
        const next = queue.shift();
        img.dataset.fallback = queue.join("||");
        img.src = next;
      });
    });
  }

  function singleMessage(product, qty, offer) {
    return [
      `Bonjour, je veux commander ce produit:`,
      `- Produit: ${product.name}`,
      offer ? `- Offre: ${offer}` : null,
      `- Quantite: ${qty}`,
      `- Prix affiche: ${product.priceText}`,
      `- Marche: ${product.market}`,
      `Merci de confirmer la disponibilite et la livraison.`
    ].filter(Boolean).join("\n");
  }

  function cartMessage() {
    const cart = cartRead();
    if (!cart.length) return "Bonjour, je souhaite commander mais mon panier est vide.";
    const lines = cart.map((line, i) => {
      const p = getProduct(line.id);
      if (!p) return null;
      return `${i + 1}. ${p.name} | Qt: ${line.qty} | Prix: ${p.priceText}`;
    }).filter(Boolean);

    return [
      "Bonjour, je souhaite commander les produits suivants:",
      ...lines,
      "Merci de confirmer disponibilite, total et livraison."
    ].join("\n");
  }

  function productCard(p) {
    const media = withFallback(p.images);
    const defaultOffer = Array.isArray(p.offers) && p.offers.length ? p.offers[0] : "";
    return `
      <article class="card">
        <a class="card-image" href="vente.html?id=${encodeURIComponent(p.id)}">
          <img src="${media.first}" data-fallback="${media.next}" alt="${p.name}" loading="lazy" />
        </a>
        <div class="card-body">
          <span class="tag">${p.category}</span>
          <h3 class="title"><a href="vente.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h3>
          <p class="price">${p.priceText}${p.oldPriceText ? `<span class="old-price">${p.oldPriceText}</span>` : ""}</p>
          <p class="meta">${p.rating}</p>
          <p class="meta">${p.stock}</p>
          <div class="buy-row">
            <button class="btn btn-primary" data-add="${p.id}">Ajouter panier</button>
            <a class="btn btn-whatsapp" href="${whatsappUrl(singleMessage(p, 1, defaultOffer))}" target="_blank" rel="noopener">Commander WhatsApp</a>
          </div>
        </div>
      </article>
    `;
  }

  function initHome() {
    const mount = document.querySelector("[data-home]");
    if (!mount) return;
    mount.innerHTML = products.map(productCard).join("");
    activateFallbackImages(mount);
  }

  function initCatalog() {
    const mount = document.querySelector("[data-catalog]");
    if (!mount) return;

    const search = document.querySelector("[data-search]");
    const market = document.querySelector("[data-market]");
    const category = document.querySelector("[data-category]");

    const categories = [...new Set(products.map((p) => p.category))];
    const markets = [...new Set(products.map((p) => p.market))];

    category.innerHTML = '<option value="">Toutes categories</option>' + categories.map((c) => `<option value="${c}">${c}</option>`).join("");
    market.innerHTML = '<option value="">Tous marches</option>' + markets.map((m) => `<option value="${m}">${m}</option>`).join("");

    function render() {
      const q = (search.value || "").toLowerCase().trim();
      const mk = market.value;
      const cat = category.value;
      const filtered = products.filter((p) => {
        const hay = `${p.name} ${p.brand} ${p.description}`.toLowerCase();
        return (!q || hay.includes(q)) && (!mk || p.market === mk) && (!cat || p.category === cat);
      });
      mount.innerHTML = filtered.length ? filtered.map(productCard).join("") : "<p>Aucun produit trouve.</p>";
      activateFallbackImages(mount);
    }

    [search, market, category].forEach((el) => el.addEventListener("input", render));
    render();
  }

  function initSalePage() {
    const mount = document.querySelector("[data-sale]");
    if (!mount) return;
    const id = new URLSearchParams(location.search).get("id");
    const p = getProduct(id);
    if (!p) {
      mount.innerHTML = '<p>Produit introuvable. <a href="catalogue.html">Retour catalogue</a></p>';
      return;
    }

    const media = withFallback(p.images);
    const offersHtml = Array.isArray(p.offers) && p.offers.length
      ? `
          <div class="buy-box">
            <label for="offer-select"><strong>Choisir l'offre</strong></label>
            <select id="offer-select" data-offer>
              ${p.offers.map((offer) => `<option value="${offer}">${offer}</option>`).join("")}
            </select>
          </div>
        `
      : "";
    const colorsHtml = Array.isArray(p.colors) && p.colors.length
      ? `<p class="meta"><strong>Couleurs:</strong> ${p.colors.join(", ")}</p>`
      : "";
    const boxContentHtml = Array.isArray(p.boxContent) && p.boxContent.length
      ? `<div><strong>Contenu de la boite</strong><ul class="list">${p.boxContent.map((x) => `<li>${x}</li>`).join("")}</ul></div>`
      : "";
    const usageHtml = Array.isArray(p.usage) && p.usage.length
      ? `<div><strong>Utilisation</strong><ul class="list">${p.usage.map((x) => `<li>${x}</li>`).join("")}</ul></div>`
      : "";
    const warningsHtml = Array.isArray(p.warnings) && p.warnings.length
      ? `<div><strong>Contre-indications</strong><ul class="list">${p.warnings.map((x) => `<li>${x}</li>`).join("")}</ul></div>`
      : "";
    
    // Slogan
    const sloganHtml = p.slogan
      ? `<p class="slogan"><em>"${p.slogan}"</em></p>`
      : "";
    
    // Compatibilité
    const compatibilityHtml = p.compatibility
      ? `
        <div class="compatibility-section">
          <h3>Compatibilité</h3>
          ${p.compatibility.compatible ? `<div><strong>✅ Compatible avec:</strong><ul class="list">${p.compatibility.compatible.map((x) => `<li>${x}</li>`).join("")}</ul></div>` : ""}
          ${p.compatibility.notCompatible ? `<div><strong>❌ Non compatible:</strong><ul class="list">${p.compatibility.notCompatible.map((x) => `<li>${x}</li>`).join("")}</ul></div>` : ""}
        </div>
        `
      : "";
    
    // Installation
    const installationHtml = Array.isArray(p.installation) && p.installation.length
      ? `<div><strong>Installation</strong><ul class="list">${p.installation.map((x) => `<li>${x}</li>`).join("")}</ul></div>`
      : "";
    
    mount.innerHTML = `
      <section class="product-layout">
        <div>
          <img class="main-image" data-main src="${media.first}" data-fallback="${media.next}" alt="${p.name}" />
          <div class="thumbs">
            ${p.images.map((src, i) => `<button class="thumb ${i === 0 ? "active" : ""}" data-thumb="${src}"><img src="${src}" alt="${p.name} ${i + 1}" loading="lazy" /></button>`).join("")}
          </div>
        </div>
        <div>
          <span class="tag">${p.category}</span>
          <h1>${p.name}</h1>
          ${sloganHtml}
          <p class="meta">Marque: ${p.brand} | Marche: ${p.market}</p>
          ${p.site ? `<p class="meta"><strong>Site:</strong> ${p.site}</p>` : ""}
          <p class="price">${p.priceText}${p.oldPriceText ? `<span class="old-price">${p.oldPriceText}</span>` : ""}</p>
          <p class="meta">${p.promo}</p>
          <p class="meta">${p.rating}</p>
          ${colorsHtml}
          <p>${p.description}</p>
          <ul class="list">${p.details.map((d) => `<li>${d}</li>`).join("")}</ul>
          ${compatibilityHtml}
          ${installationHtml}
          ${offersHtml}
          ${boxContentHtml}
          ${usageHtml}
          ${warningsHtml}
          <p class="meta"><strong>Stock:</strong> ${p.stock}</p>
          <p class="meta"><strong>Garantie:</strong> ${p.guarantee}</p>
          <p class="meta"><strong>Livraison:</strong> ${p.delivery}</p>
          <div class="buy-box">
            <div class="buy-row">
              <input type="number" min="1" value="1" data-qty />
              <button class="btn btn-primary" data-add="${p.id}">Ajouter au panier</button>
            </div>
            <a class="btn btn-whatsapp" data-wa-single href="#" target="_blank" rel="noopener">Commander ce produit sur WhatsApp</a>
          </div>
        </div>
      </section>
    `;

    mount.querySelectorAll("[data-thumb]").forEach((btn) => {
      btn.addEventListener("click", () => {
        mount.querySelectorAll("[data-thumb]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        mount.querySelector("[data-main]").src = btn.getAttribute("data-thumb");
      });
    });

    const qtyInput = mount.querySelector("[data-qty]");
    const offerInput = mount.querySelector("[data-offer]");
    const wa = mount.querySelector("[data-wa-single]");
    function refreshSingleWa() {
      const selectedOffer = offerInput ? offerInput.value : (Array.isArray(p.offers) && p.offers.length ? p.offers[0] : "");
      wa.href = whatsappUrl(singleMessage(p, Math.max(1, Number(qtyInput.value || 1)), selectedOffer));
    }
    qtyInput.addEventListener("input", refreshSingleWa);
    if (offerInput) offerInput.addEventListener("change", refreshSingleWa);
    refreshSingleWa();
    activateFallbackImages(mount);
  }

  function initCart() {
    const mount = document.querySelector("[data-cart]");
    if (!mount) return;

    function render() {
      const cart = cartRead();
      if (!cart.length) {
        mount.innerHTML = '<p>Ton panier est vide. <a href="catalogue.html">Voir le catalogue</a></p>';
        return;
      }

      const lines = cart.map((line) => {
        const p = getProduct(line.id);
        if (!p) return "";
        return `
          <div class="cart-item">
            <img src="${withFallback(p.images).first}" data-fallback="${withFallback(p.images).next}" alt="${p.name}" />
            <div>
              <h3 class="title">${p.name}</h3>
              <p class="meta">${p.priceText}</p>
            </div>
            <input type="number" min="1" value="${line.qty}" data-qty-line="${p.id}" />
            <button class="btn btn-primary" data-remove="${p.id}">Retirer</button>
          </div>
        `;
      }).join("");

      mount.innerHTML = `
        ${lines}
        <div class="summary">
          <p>Commande rapide via WhatsApp avec message automatique.</p>
          <a class="btn btn-whatsapp" href="${whatsappUrl(cartMessage())}" target="_blank" rel="noopener">Commander tout le panier sur WhatsApp</a>
        </div>
      `;

      mount.querySelectorAll("[data-qty-line]").forEach((input) => {
        input.addEventListener("change", () => {
          const id = input.getAttribute("data-qty-line");
          const qty = Math.max(1, Number(input.value || 1));
          const next = cartRead().map((x) => x.id === id ? { ...x, qty } : x);
          cartWrite(next);
          render();
        });
      });

      mount.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          removeCart(btn.getAttribute("data-remove"));
          render();
        });
      });
      activateFallbackImages(mount);
    }

    render();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.getAttribute("data-add");
    const qty = btn.closest("section, article, div")?.querySelector("[data-qty]")?.value || 1;
    addCart(id, qty);
  });

  document.addEventListener("DOMContentLoaded", () => {
    updateCount();
    initHome();
    initCatalog();
    initSalePage();
    initCart();

    document.querySelectorAll("[data-wa-store]").forEach((a) => {
      a.href = whatsappUrl("Bonjour Ricky_shop, je souhaite des informations sur vos produits.");
    });
  });
})();
