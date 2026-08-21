// Trompack — product catalog, quote-cart logic, and WhatsApp handoff.

const WHATSAPP_NUMBER = "5541995850229"; // +55 41 9 9585.0229
const CART_KEY = "trompack_cart_v1";

const PRODUCTS = [
  { id: "copo-100", category: "descartavel", categoryLabel: "Copo Descartável", name: "Copo de Papel Descartável", size: "100ml", h: 62, dTop: 63, dBottom: 45 },
  { id: "copo-160", category: "descartavel", categoryLabel: "Copo Descartável", name: "Copo de Papel Descartável", size: "160ml", h: 74, dTop: 69, dBottom: 48 },
  { id: "copo-180", category: "descartavel", categoryLabel: "Copo Descartável", name: "Copo de Papel Descartável", size: "180ml", h: 81, dTop: 71, dBottom: 48 },
  { id: "copo-280", category: "descartavel", categoryLabel: "Copo Descartável", name: "Copo de Papel Descartável", size: "280ml", h: 91, dTop: 80, dBottom: 56 },
  { id: "copo-330", category: "descartavel", categoryLabel: "Copo Descartável", name: "Copo de Papel Descartável", size: "330ml", h: 103, dTop: 81, dBottom: 56 },

  { id: "copo-pers-100", category: "personalizado", categoryLabel: "Copo Personalizado", name: "Copo de Papel Personalizado", size: "100ml", h: 62, dTop: 63, dBottom: 45, branded: true },
  { id: "copo-pers-160", category: "personalizado", categoryLabel: "Copo Personalizado", name: "Copo de Papel Personalizado", size: "160ml", h: 74, dTop: 69, dBottom: 48, branded: true },
  { id: "copo-pers-180", category: "personalizado", categoryLabel: "Copo Personalizado", name: "Copo de Papel Personalizado", size: "180ml", h: 81, dTop: 71, dBottom: 48, branded: true },
  { id: "copo-pers-280", category: "personalizado", categoryLabel: "Copo Personalizado", name: "Copo de Papel Personalizado", size: "280ml", h: 91, dTop: 80, dBottom: 56, branded: true },
  { id: "copo-pers-330", category: "personalizado", categoryLabel: "Copo Personalizado", name: "Copo de Papel Personalizado", size: "330ml", h: 103, dTop: 81, dBottom: 56, branded: true },

  { id: "tampa-bico-100", category: "tampa", categoryLabel: "Tampa com Bico", name: "Tampa com Bico", size: "100ml", lid: "bico" },
  { id: "tampa-bico-160", category: "tampa", categoryLabel: "Tampa com Bico", name: "Tampa com Bico", size: "160ml", lid: "bico" },
  { id: "tampa-bico-180", category: "tampa", categoryLabel: "Tampa com Bico", name: "Tampa com Bico", size: "180ml", lid: "bico" },
  { id: "tampa-bico-280", category: "tampa", categoryLabel: "Tampa com Bico", name: "Tampa com Bico", size: "280ml", lid: "bico" },
  { id: "tampa-pet-280", category: "tampa", categoryLabel: "Tampa PET", name: "Tampa PET", size: "280ml", lid: "pet" },
  { id: "tampa-pet-330", category: "tampa", categoryLabel: "Tampa PET", name: "Tampa PET", size: "330ml", lid: "pet" },
];

const CATEGORY_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "descartavel", label: "Copos Descartáveis" },
  { key: "personalizado", label: "Copos Personalizados" },
  { key: "tampa", label: "Tampas" },
];

// ---------- Product lines ----------
// The catalogue is four product lines; sizes are chosen inside each line's own
// page, so the products page stays a showcase rather than a wall of steppers.

const PRODUCT_LINES = [
  {
    key: "descartavel",
    name: "Copo de Papel Descartável",
    tagline: "O branco clássico",
    blurb: "Fibras 100% renováveis com certificação FSC. Cinco tamanhos para café, água e bebidas geladas.",
    page: "produto-descartavel.html",
    photoKey: "descartavel",
  },
  {
    key: "personalizado",
    name: "Copo de Papel Personalizado",
    tagline: "Sua marca impressa",
    blurb: "O mesmo copo sustentável, com a sua logo em até 4 cores. Arte inclusa e prova aprovada antes de produzir.",
    page: "produto-personalizado.html",
    photoKey: "personalizado",
    badge: "Premium",
  },
  {
    key: "bico",
    name: "Tampa com Bico",
    tagline: "Para bebidas quentes",
    blurb: "Encaixe firme e bico de abertura para consumo em movimento, sem respingos.",
    page: "produto-tampa-bico.html",
    photoKey: "bico",
  },
  {
    key: "pet",
    name: "Tampa PET",
    tagline: "Para bebidas geladas",
    blurb: "Tampa transparente que valoriza a bebida à vista, ideal para sucos, chás e drinques.",
    page: "produto-tampa-pet.html",
    photoKey: "pet",
  },
];

function lineProducts(key) {
  if (key === "bico" || key === "pet") return PRODUCTS.filter((p) => p.lid === key);
  return PRODUCTS.filter((p) => p.category === key);
}

// ---------- Technical data (Catálogo de Produtos 2026) ----------

const CUP_SPECS = [
  { size: "100ml", altura: "62 mm", dSup: "63 mm", dInf: "45 mm", peso: "3 g",  gsm: "234 g/m²", caixa: "380 × 320 × 420 mm" },
  { size: "160ml", altura: "74 mm", dSup: "69 mm", dInf: "48 mm", peso: "4 g",  gsm: "234 g/m²", caixa: "425 × 355 × 380 mm" },
  { size: "180ml", altura: "81 mm", dSup: "71 mm", dInf: "48 mm", peso: "4 g",  gsm: "234 g/m²", caixa: "431 × 349 × 377 mm" },
  { size: "280ml", altura: "91 mm", dSup: "80 mm", dInf: "56 mm", peso: "7 g",  gsm: "289 g/m²", caixa: "475 × 400 × 490 mm" },
  { size: "330ml", altura: "103 mm", dSup: "81 mm", dInf: "56 mm", peso: "8 g", gsm: "289 g/m²", caixa: "490 × 415 × 480 mm" },
];

// Attributes shared by the whole cup range, per the catalogue.
const CUP_ATTRIBUTES = [
  ["Material", "Papel cartão com revestimento interno em polietileno (PE)"],
  ["Temperatura", "Suporta até 90 °C — bebidas quentes e frias"],
  ["Impressão", "Offset, com tintas atóxicas à base de água"],
  ["Certificação", "FSC — manejo florestal responsável"],
  ["Sustentabilidade", "Atóxico, biodegradável e reciclável"],
  ["Embalagem padrão", "Caixas de 1.500 unidades (30 pacotes × 50)"],
  ["Armazenamento", "Local seco e ventilado, longe de fontes de calor"],
  ["Validade", "Produto não perecível"],
];

const LID_ATTRIBUTES = {
  bico: [
    ["Material", "Polipropileno (PP)"],
    ["Compatibilidade", "Copos de 100, 160, 180 e 280ml"],
    ["Aplicação", "Bebidas quentes"],
    ["Encaixe", "Travamento por pressão, seguro para transporte"],
    ["Bico", "Abertura para consumo sem remover a tampa"],
  ],
  pet: [
    ["Material", "PET reciclável"],
    ["Compatibilidade", "Copos de 280 e 330ml"],
    ["Aplicação", "Bebidas geladas"],
    ["Acabamento", "Transparente cristal, mantém a bebida à vista"],
    ["Encaixe", "Travamento por pressão"],
  ],
};

// Sizes available per line, used to filter the dimension table.
function lineSpecRows(key) {
  const sizes = lineProducts(key).map((p) => p.size);
  return CUP_SPECS.filter((r) => sizes.includes(r.size));
}

// ---------- Product photography ----------

const PRODUCT_PHOTOS = {
  descartavel: { src: "img/produtos/copo-branco.webp", alt: "Copo de papel descartável branco Trompack" },
  personalizado: { src: "img/produtos/copo-personalizado.webp", alt: "Copo de papel personalizado com a marca impressa" },
  bico: { src: "img/produtos/tampa-bico.webp", alt: "Tampa preta com bico para copo de papel" },
  pet: { src: "img/produtos/tampa-pet.webp", alt: "Tampa PET transparente para copo de papel" },
};

// onDark swaps in the cut-out variant, whose studio-white backdrop has been
// keyed away so the product floats on a dark card instead of sitting in a
// white box.
function productPhoto(p, onDark) {
  const photo = PRODUCT_PHOTOS[p.lid || p.category];
  if (!photo) return "";
  const src = onDark ? photo.src.replace(/\.webp$/, "-alpha.webp") : photo.src;
  return `<img src="${src}" alt="${photo.alt}" width="600" height="600" loading="lazy" decoding="async">`;
}

// eager: for above-the-fold use (a product page hero), where lazy loading would
// delay the largest element on screen.
function linePhoto(line, onDark, eager) {
  const photo = PRODUCT_PHOTOS[line.photoKey];
  if (!photo) return "";
  const src = onDark ? photo.src.replace(/\.webp$/, "-alpha.webp") : photo.src;
  const load = eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  return `<img src="${src}" alt="${photo.alt}" width="600" height="600" ${load} decoding="async">`;
}

// kept for backwards compatibility with existing call sites
function productSVG(p) {
  return productPhoto(p);
}

// ---------- Shared renderers ----------

const PLUS_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const CHECK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>';

// Wires the +/- steppers and the add-to-quote buttons inside a container.
function wireQuantityControls(scope) {
  scope.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = scope.querySelector(`[data-qty="${btn.dataset.id}"]`);
      let val = parseInt(input.value, 10) || 0;
      val = btn.dataset.action === "inc" ? val + 1 : Math.max(0, val - 1);
      input.value = val;
    });
  });

  scope.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.add;
      const input = scope.querySelector(`[data-qty="${id}"]`);
      const qty = parseInt(input.value, 10) || 0;
      if (qty <= 0) return;
      setQty(id, qty);
      btn.classList.add("added");
      btn.innerHTML = CHECK_ICON;
      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = PLUS_ICON;
      }, 1300);
    });
  });
}

// The size picker used on every product page: one card per available size.
function renderSizeGrid(gridEl, products) {
  const cart = getCart();
  gridEl.innerHTML = products
    .map((p) => {
      const qty = cart[p.id] || 0;
      return `
        <div class="size-card">
          <b>${p.size}</b>
          <span class="size-card-meta">${p.h ? `Altura ${p.h}mm` : "Encaixe universal"}</span>
          <div class="qty-row">
            <div class="qty-control">
              <button type="button" data-action="dec" data-id="${p.id}">–</button>
              <input type="number" min="0" value="${qty}" data-qty="${p.id}" />
              <button type="button" data-action="inc" data-id="${p.id}">+</button>
            </div>
            <button type="button" class="add-btn" data-add="${p.id}" aria-label="Adicionar ${p.size} ao orçamento">${PLUS_ICON}</button>
          </div>
        </div>`;
    })
    .join("");
  wireQuantityControls(gridEl);
}

// Dimension table for a cup line (lids have no per-size dimensions published).
function renderSpecTable(el, lineKey) {
  const rows = lineSpecRows(lineKey);
  if (!rows.length) return;
  el.innerHTML = `
    <div class="spec-table-wrap">
      <table class="spec-table">
        <thead>
          <tr><th>Capacidade</th><th>Altura</th><th>Ø superior</th><th>Ø inferior</th><th>Peso un.</th><th>Gramatura</th></tr>
        </thead>
        <tbody>
          ${rows.map((r) => `<tr>
            <td><b>${r.size}</b></td><td>${r.altura}</td><td>${r.dSup}</td>
            <td>${r.dInf}</td><td>${r.peso}</td><td>${r.gsm}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

// Attribute list shared by a line (material, certification, packing…).
function renderAttributes(el, lineKey) {
  const rows = lineKey === "bico" || lineKey === "pet"
    ? LID_ATTRIBUTES[lineKey]
    : CUP_ATTRIBUTES;
  el.innerHTML = rows
    .map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`)
    .join("");
}

// The products landing page: one showcase card per product line.
function renderLineGrid(gridEl, onDark) {
  gridEl.innerHTML = PRODUCT_LINES.map(
    (line) => `
      <a class="line-card" href="${line.page}">
        ${line.badge ? `<span class="line-badge">${line.badge}</span>` : ""}
        <div class="line-visual">${linePhoto(line, onDark)}</div>
        <span class="line-tagline">${line.tagline}</span>
        <h3>${line.name}</h3>
        <p>${line.blurb}</p>
        <span class="line-cta">Escolher tamanhos
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a>`
  ).join("");
}

// ---------- Cart storage ----------

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
}

function setQty(id, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  saveCart(cart);
  return cart;
}

function addToCart(id, qty) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  return cart;
}

function cartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, n) => sum + n, 0);
}

function cartItems() {
  const cart = getCart();
  return Object.keys(cart)
    .map((id) => ({ product: PRODUCTS.find((p) => p.id === id), qty: cart[id] }))
    .filter((item) => item.product);
}

function updateCartBadges() {
  const count = cartCount();
  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.classList.toggle("show", count > 0);
  });
}

// ---------- WhatsApp handoff ----------

function buildWhatsAppMessage(lead) {
  const items = cartItems();
  const lines = [];
  lines.push("Olá! Gostaria de um orçamento na Trompack.");
  lines.push("");
  if (items.length) {
    lines.push("*Itens:*");
    items.forEach(({ product, qty }) => {
      lines.push(`• ${qty}x ${product.name} — ${product.size}`);
    });
    lines.push("");
  }
  if (lead) {
    if (lead.name) lines.push(`*Nome:* ${lead.name}`);
    if (lead.company) lines.push(`*Empresa:* ${lead.company}`);
    if (lead.email) lines.push(`*E-mail:* ${lead.email}`);
    if (lead.phone) lines.push(`*Telefone:* ${lead.phone}`);
    if (lead.message) {
      lines.push("");
      lines.push(lead.message);
    }
  }
  return lines.join("\n");
}

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openWhatsAppWithCart(lead) {
  window.open(whatsappLink(buildWhatsAppMessage(lead)), "_blank");
}

document.addEventListener("DOMContentLoaded", updateCartBadges);

// ---------- Sales content (all of it traceable to the 2026 catalogue) ----------

// Which size for which job. The catalogue lists the applications; the pairing
// below is the size range that matches each one.
const USE_CASES = [
  { title: "Cafezinho / espresso", size: "100ml", note: "O clássico do balcão e do escritório. Cabe na bandeja e não esfria antes do último gole." },
  { title: "Café com leite", size: "160 – 180ml", note: "A dose padrão de cafeteria, com espaço para leite vaporizado sem transbordar." },
  { title: "Água e consultórios", size: "100 – 180ml", note: "Consultórios, clínicas e eventos: descarte limpo, sem lavar louça." },
  { title: "Cappuccino / chocolate", size: "280ml", note: "Volume para bebidas cremosas, com gramatura reforçada de 289 g/m²." },
  { title: "Sucos e geladas", size: "330ml", note: "Para bebidas frias, sucos e chás. Combina com a tampa PET transparente." },
  { title: "Delivery e viagem", size: "com tampa", note: "Tampa com bico travando por pressão: segue no carro sem respingar." },
];

// Objection handling, answered only with what the catalogue actually states.
const FAQ = [
  {
    q: "Qual é o pedido mínimo?",
    a: "A embalagem padrão é a caixa de 1.500 unidades, dividida em 30 pacotes de 50 copos — o formato que mantém o produto protegido e fácil de repor no balcão. Para volumes diferentes, fale com um consultor e montamos a condição.",
  },
  {
    q: "O copo aguenta bebida quente?",
    a: "Sim. A linha suporta até 90 °C, com revestimento interno em polietileno (PE) que impede vazamento e resiste à umidade. Serve tanto para quente quanto para gelado.",
  },
  {
    q: "Dá para imprimir a minha marca?",
    a: "Sim, com impressão offset em tintas atóxicas à base de água. Nossa equipe adapta a sua arte ao molde do copo e envia a prova para aprovação antes de rodar a produção.",
  },
  {
    q: "É realmente sustentável ou é discurso?",
    a: "O papel tem certificação FSC, que rastreia a fibra até florestas de manejo responsável. O material é atóxico, biodegradável e reciclável conforme as condições de coleta da sua região — e se decompõe em meses, não em séculos.",
  },
  {
    q: "Quanto tempo o produto dura no estoque?",
    a: "É um produto não perecível. A recomendação é armazenar em local seco e ventilado, longe de fontes de calor — assim a caixa pode ficar guardada até a hora de usar.",
  },
  {
    q: "As tampas encaixam em qualquer tamanho?",
    a: "A tampa com bico atende os copos de 100, 160, 180 e 280ml; a tampa PET atende 280 e 330ml. O diâmetro de encaixe é padronizado dentro de cada linha, o que simplifica o seu estoque.",
  },
  {
    q: "Como fecho o pedido?",
    a: "Monte o orçamento aqui no site escolhendo tamanhos e quantidades, e envie pelo WhatsApp com um clique. Você recebe a proposta pelo mesmo canal, sem formulário longo nem cadastro.",
  },
];

// Short facts for the running ticker.
const TICKER_FACTS = [
  "Certificação FSC — fibra de manejo responsável",
  "Suporta até 90 °C",
  "Caixa de 1.500 unidades (30 × 50)",
  "Atóxico, biodegradável e reciclável",
  "5 capacidades: 100 a 330ml",
  "Impressão offset com tintas à base de água",
  "Revestimento interno em PE — não vaza",
  "Orçamento fechado pelo WhatsApp",
];

function renderUseCases(el) {
  el.innerHTML = USE_CASES.map((u) => `
    <div class="use-card">
      <b>${u.title}</b>
      <span>${u.note}</span>
      <span class="use-size">${u.size}</span>
    </div>`).join("");
}

function renderFaq(el) {
  el.innerHTML = FAQ.map((f) => `
    <details>
      <summary>${f.q}</summary>
      <p>${f.a}</p>
    </details>`).join("");
}

function renderTicker(el) {
  // duplicated so the marquee can loop seamlessly at -50%
  const once = TICKER_FACTS.map((f) => `<span>${f}</span>`).join("");
  el.innerHTML = once + once;
}
