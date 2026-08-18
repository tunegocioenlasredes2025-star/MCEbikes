/* =====================================================================
   MC EBIKES — generador estático
   node build.mjs
   ===================================================================== */
import { writeFileSync } from "node:fs";

const SITE = "https://mcebikes.com.ar";
/* TODO: reemplazar por el WhatsApp real de MC Ebikes */
const WA = "5491112345678";
const WA_TXT = (m) => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const MAIL = "hola@mcebikes.com.ar";
const DIR = "Castelar, Buenos Aires";
const HORARIO = "Lun a Vie 10 a 19 h · Sáb 10 a 14 h";
const money = (n) => "$" + n.toLocaleString("es-AR");
const V = Date.now().toString(36); // cache busting de assets

/* ---------- Iconos ---------- */
const I = {
  bolt: `<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>`,
  bat: `<rect x="2" y="7" width="17" height="10" rx="1"/><path d="M22 10v4M6 10v4M10 10v4"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  speed: `<circle cx="12" cy="12" r="9"/><path d="m8 14 4-5 4 5"/>`,
  bike: `<circle cx="6" cy="17" r="4"/><circle cx="18" cy="17" r="4"/><path d="M6 17 10 8h6l2 9M9 8h6"/>`,
  shield: `<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="m9 12 2 2 4-4"/>`,
  wrench: `<path d="M20 5a5 5 0 0 1-6.5 6.4L6 19l-2-2 7.6-7.5A5 5 0 0 1 18 3z"/>`,
  card: `<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M7 15h4"/>`,
  pin: `<path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
  weight: `<path d="M5 8h14l2 12H3z"/><circle cx="12" cy="5" r="2"/>`,
  check: `<path d="M20 6 9 17l-5-5"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  arrow: `<path d="M5 12h14M13 6l6 6-6 6"/>`,
  mail: `<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>`,
  phone: `<path d="M22 17v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`,
  city: `<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/>`,
  box: `<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12v9M4 7.5l8 4.5 8-4.5"/>`,
};
const ico = (p, w = 1.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const waIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.98-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>`;

/* ---------- Logo ----------
   Emblema aprobado por el cliente (ago-2026): ruta abierta con el ciclista.
   PENDIENTE: reemplazar por el archivo definitivo que pasa el cliente.
   El SVG hereda currentColor, asi que toma el color del contexto. */
const EMBLEMA = `<path d="M120.5 115.6 L122 115.3 L123.4 114.9 L124.9 114.5 L126.3 114 L127.8 113.6 L129.5 113.9 L131.4 114.5 L133.3 115.1 L135.3 115.7 L137.2 116.3 L139.2 116.8 L141.3 117.3 L143.3 117.8 L145.4 118.2 L147.5 118.6 L149.7 119 L149.7 119 L148.5 120.9 L147.3 122.7 L146.1 124.5 L144.9 126.4 L143.7 128.2 L142.4 130 L141.1 131.7 L139.8 133.5 L138.5 135.3 L137.2 137 L135.7 138.3 L133.9 138.9 L132.2 139.4 L130.4 139.9 L128.7 140.4 L127 140.8 Z" fill="currentColor"/><path d="M234.8 44.3 L232.1 45.8 L229.5 47.4 L226.8 49 L224.4 51 L222.4 53.6 L220.4 56.2 L218.4 58.8 L216.4 61.5 L214.5 64.2 L212.6 66.9 L210.7 69.7 L208.9 72.5 L207.1 75.3 L205.4 78.2 L203.7 81.1 L202 84 L202 84 L205.1 82.6 L208.1 81.4 L211.2 80.1 L214.2 79 L217.2 77.9 L220.2 76.9 L223.2 75.9 L226.2 75.1 L229.2 74.2 L232.1 73.5 L235 72.8 L237.9 72.2 L240.5 71.1 L242.8 69.7 L245.1 68.3 L247.4 67 Z" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="26" stroke-linecap="butt" stroke-linejoin="round"><path d="M132.3 125.8C83.6 141.4 42 127.5 42 84C42 20 132 20 202 84C272 148 362 148 362 84C362 29 295.4 21.3 232.3 60.9"/></g><g transform="translate(68,75.75) scale(0.5)"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="62" r="16" stroke-width="7"/><circle cx="98" cy="62" r="16" stroke-width="7"/><g stroke-width="7"><path d="M22 62 L38 34 L84 30"/><path d="M38 34 L58 62 L22 62"/><path d="M84 30 L98 62"/><path d="M76 24 H92"/><path d="M32 28 H46"/></g><g stroke-width="10"><path d="M44 28 L64 16"/><path d="M64 16 L84 28"/><path d="M44 28 L56 44 L58 60"/></g></g><circle cx="70" cy="7" r="9" fill="currentColor"/></g>`;
const LOGO = (h = 26) => `<svg height="${h}" viewBox="12 12 378 144" fill="none" aria-hidden="true">${EMBLEMA}</svg>`;

/* Tagline oficial (anexo del Manual de Marca v1.0) */
const TAGLINE = "Tu mundo se mueve con vos";

/* =====================================================================
   PRODUCTOS — datos reales de las fichas del proveedor
   PRECIOS PROVISORIOS: confirmar con el cliente antes de publicar
   ===================================================================== */
const P = [
  {
    slug: "v20-pro", name: "SW V20 Pro", ord: 1,
    cat: "urbana destacada",
    tagline: "La urbana que hace todo",
    lead: "El equilibrio justo entre potencia, autonomía y precio. Es la que más vendemos y la que recomendamos si es tu primera e-bike.",
    price: 1890000, old: null, badge: "Más vendida",
    motor: "1000W", bat: "48V / 15,6Ah", aut: "50 a 65 km", vel: "32 km/h",
    autNum: 65, carga: "150 kg", recarga: "4 a 6 horas", peso: "40 kg aprox.",
    img: "v20-negra", gal: ["v20-negra", "v20-azul", "v20-rosa", "v20-perfil"],
    uso: "Ciudad, trayectos de hasta 25 km por día",
    destacado: true,
    extras: ["Panel digital a color", "Arranque por NFC", "Alarma integrada", "Frenos a disco adelante y atrás", "Llantas fat Kenda 20\"", "Amortiguación delantera"],
  },
  {
    slug: "v29-pro", name: "SW V29 Pro", ord: 2,
    cat: "larga-distancia destacada",
    tagline: "Doble batería, el doble de recorrido",
    lead: "Dos baterías intercambiables para los que hacen muchos kilómetros por día. Si trabajás arriba de la bici, es esta.",
    price: 2340000, old: null, badge: "Doble batería",
    motor: "1000W", bat: "48V / 15,6Ah ×2", aut: "hasta 110 km", vel: "32 km/h",
    autNum: 110, carga: "150 kg", recarga: "4 a 6 horas", peso: "45 kg aprox.",
    img: "v29-negra", gal: ["v29-negra", "v29-lateral", "v29-detalle", "v20-perfil"],
    uso: "Delivery, trabajo y distancias largas",
    destacado: true,
    extras: ["Dos baterías intercambiables", "Panel digital", "Arranque por NFC", "Portaequipaje reforzado", "Frenos a disco", "Amortiguación delantera"],
  },
  {
    slug: "v40", name: "SW V40", ord: 3,
    cat: "urbana",
    tagline: "Más batería, más aguante",
    lead: "Batería de mayor capacidad y equipamiento completo de luces. Ideal si hacés recorridos medios y querés no pensar en la carga.",
    price: 2150000, old: null, badge: null,
    motor: "1000W", bat: "48V / 18,2Ah", aut: "hasta 75 km", vel: "32 km/h",
    autNum: 75, carga: "150 kg", recarga: "5 a 6 horas", peso: "47,7 kg",
    img: "v40-negra", gal: ["v40-negra", "v40-camo", "v8-negra", "v8-frente"],
    uso: "Uso mixto ciudad y ruta corta",
    destacado: false,
    extras: ["Batería de 18,2Ah", "Señalización LED completa", "Panel digital", "Arranque por NFC", "Frenos a disco", "Llantas fat Kenda"],
  },
  {
    slug: "s20-pro", name: "SW S20 Pro", ord: 4,
    cat: "potencia",
    tagline: "1800W: la más potente",
    lead: "El tope de gama en potencia. Para quien busca la mayor respuesta en aceleración y subidas exigentes.",
    price: 2590000, old: null, badge: "Más potente",
    motor: "1800W", bat: "48V / 16,2Ah", aut: "hasta 75 km", vel: "32 km/h",
    autNum: 75, carga: "138 kg", recarga: "5 a 6 horas", peso: "45 kg aprox.",
    img: "s20-blanca", gal: ["s20-blanca", "v8-bordo", "v20-lateral", "v8-negra"],
    uso: "Máxima potencia, subidas y carga",
    destacado: true,
    extras: ["Motor de 1800W", "Panel digital", "Arranque por NFC", "Frenos a disco", "Suspensión reforzada", "Llantas fat Kenda"],
  },
];
const byslug = (s) => P.find((x) => x.slug === s);

/* ---------- HEAD ---------- */
function head({ title, desc, slug, ld = "", preload = "" }) {
  const url = slug === "index" ? `${SITE}/` : `${SITE}/${slug}.html`;
  return `<!DOCTYPE html>
<html lang="es-AR" data-wa="${WA}">
<head>
<script>document.documentElement.className+=' js'</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#14161A">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MC Ebikes">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="es_AR">
<meta property="og:image" content="${SITE}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/icon-180.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" href="assets/fonts/Archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/Inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/BigShoulders-var.woff2" as="font" type="font/woff2" crossorigin>${preload}
<link rel="stylesheet" href="assets/css/fonts.css?v=${V}">
<link rel="stylesheet" href="assets/css/styles.css?v=${V}">
${ld ? `<script type="application/ld+json">\n${ld}\n</script>` : ""}
</head>`;
}

/* ---------- HEADER ---------- */
function header(active) {
  const on = (k) => (active === k ? ' class="on"' : "");
  const links = [["index", "Inicio", "index.html"], ["productos", "Modelos", "productos.html"],
  ["servicio", "Service", "servicio.html"], ["nosotros", "Nosotros", "nosotros.html"],
  ["faq", "Preguntas", "faq.html"], ["contacto", "Contacto", "contacto.html"]];
  return `<body>
<header class="hdr">
  <div class="hdr__in">
    <a href="index.html" class="brand" aria-label="MC Ebikes — Inicio">
      ${LOGO(30)}
      <span class="tx"><b>MC E-BIKES</b></span>
    </a>
    <nav class="nav" aria-label="Principal">
      ${links.map(([k, t, h]) => `<a href="${h}"${on(k)}>${t}</a>`).join("\n      ")}
    </nav>
    <div class="hdr__act">
      <a class="btn btn--p btn--sm" href="test-ride.html">Reservar test ride</a>
      <button class="burger" aria-label="Abrir menú" aria-expanded="false"><i></i><i></i><i></i></button>
    </div>
  </div>
</header>

<div class="mnav">
  ${links.map(([, t, h]) => `<a href="${h}">${t}</a>`).join("\n  ")}
  <div class="acts">
    <a class="btn btn--p btn--block" href="test-ride.html">Reservar test ride</a>
    <a class="btn btn--wa btn--block" href="${WA_TXT("Hola MC Ebikes, quiero hacer una consulta.")}" target="_blank" rel="noopener">${waIcon} WhatsApp</a>
  </div>
  <div class="info">
    ${DIR}<br>${HORARIO}<br>
    <a href="mailto:${MAIL}">${MAIL}</a>
  </div>
</div>
<main>`;
}

/* ---------- FOOTER ---------- */
function footer() {
  return `</main>
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__t">
      <div class="ftr__b">
        <a href="index.html" class="brand" style="color:var(--tiza)">${LOGO(28)}<span class="tx"><b>MC</b><span>EBIKES</span></span></a>
        <p>Movilidad eléctrica urbana en zona oeste. Fat e-bikes de 1000W para moverte sin patente, sin nafta y sin trámites.</p>
        <div class="soc">
          <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg></a>
          <a href="${WA_TXT("Hola MC Ebikes")}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon}</a>
        </div>
      </div>
      <div>
        <h4>Modelos</h4>
        <ul>${P.map((p) => `<li><a href="${p.slug}.html">${p.name}</a></li>`).join("")}
        <li><a href="productos.html">Ver todos</a></li></ul>
      </div>
      <div>
        <h4>Info</h4>
        <ul>
          <li><a href="test-ride.html">Test ride</a></li>
          <li><a href="servicio.html">Service y garantía</a></li>
          <li><a href="nosotros.html">Nosotros</a></li>
          <li><a href="faq.html">Preguntas frecuentes</a></li>
          <li><a href="contacto.html">Contacto</a></li>
        </ul>
      </div>
      <div>
        <h4>Dónde estamos</h4>
        <ul class="ftr__c">
          <li>${ico(I.pin)} ${DIR}</li>
          <li>${ico(I.clock)} ${HORARIO}</li>
          <li>${ico(I.mail)} <a href="mailto:${MAIL}">${MAIL}</a></li>
        </ul>
      </div>
    </div>
    <div class="ftr__bot">
      <span>© <span data-year>2026</span> MC EBIKES</span>
      <span>Precios y disponibilidad sujetos a cambio sin previo aviso.</span>
    </div>
  </div>
</footer>
<a class="fab" href="${WA_TXT("Hola MC Ebikes, quiero hacer una consulta.")}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon}</a>
<script src="assets/js/app.js?v=${V}" defer></script>
</body>
</html>`;
}

const page = ({ slug, title, desc, active, ld, preload, main }) =>
  head({ title, desc, slug, ld, preload }) + header(active) + main + footer();

/* ---------- Bloques ---------- */
const pcard = (p) => `
<article class="pc rv" data-cat="${p.cat}" data-price="${p.price}" data-aut="${p.autNum}" data-ord="${p.ord}">
  <a href="${p.slug}.html" class="pc__im">
    ${p.badge ? `<span class="tag tag--a">${p.badge}</span>` : ""}
    <img src="assets/img/${p.img}-sm.webp" alt="${p.name}" loading="lazy" width="640" height="480">
  </a>
  <div class="pc__b">
    <span class="pc__cat">FAT E-BIKE</span>
    <h3><a href="${p.slug}.html">${p.name}</a></h3>
    <div class="pc__sp">
      <div>POTENCIA<b>${p.motor}</b></div>
      <div>AUTONOMÍA<b>${p.autNum} km</b></div>
      <div>VEL. MÁX<b>32 km/h</b></div>
    </div>
    <div class="pc__pr">
      <div class="price">${money(p.price)}</div>
      <div class="cuotas">12 cuotas sin interés de ${money(Math.round(p.price / 12))}</div>
      <div class="stock"><i></i>Disponible para probar</div>
      <div class="pc__act">
        <a class="btn btn--p" href="${p.slug}.html">Ver ficha</a>
        <a class="btn btn--g" href="test-ride.html?m=${p.slug}">Probarla</a>
      </div>
    </div>
  </div>
</article>`;

const ctaBlock = (t = "¿Lo mejor? Probala antes de comprarla.", s = "Vení al local, manejala y decidí con la bici abajo tuyo. Sin compromiso.") => `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="cta rv">
      <div>
        <h2 class="h2">${t}</h2>
        <p>${s}</p>
      </div>
      <div class="acts">
        <a class="btn btn--l btn--lg" href="test-ride.html">Reservar test ride</a>
        <a class="btn btn--lg" style="border:1.5px solid rgba(20,20,20,.3);color:#141414" href="${WA_TXT("Hola MC Ebikes, quiero hacer una consulta.")}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
      </div>
    </div>
  </div>
</section>`;

const faqItem = (q, a) => `
  <div class="faq__i">
    <button class="faq__q" aria-expanded="false"><span>${q}</span><span class="pm">${ico(I.plus, 2)}</span></button>
    <div class="faq__a"><p>${a}</p></div>
  </div>`;

const FAQS = [
  ["¿Necesito registro, patente o seguro?", "No. Al no superar los 32 km/h y tener pedales asistidos, legalmente es una bicicleta eléctrica: no requiere licencia, patentamiento ni seguro obligatorio. Sí recomendamos casco y circular por la derecha."],
  ["¿Cuánto dura la batería?", "Una carga rinde entre 50 y 110 km según el modelo, tu peso, el viento y si usás más o menos el acelerador. La batería de litio soporta entre 800 y 1000 ciclos de carga completos, o sea unos 3 a 5 años de uso diario antes de perder capacidad."],
  ["¿Cuánto sale cargarla?", "Muy poco: una carga completa consume alrededor de 0,8 kWh, unos $180 según la tarifa actual. Hacer 60 km te cuesta menos que un viaje en colectivo."],
  ["¿Qué garantía tienen?", "12 meses de garantía en cuadro y motor, y 6 meses en batería, igual que el estándar del mercado. Lo importante: el service lo hacemos nosotros acá en Castelar, no tenés que mandarla a otra provincia."],
  ["¿Se puede usar bajo la lluvia?", "Sí, tienen protección contra salpicaduras y podés andar con lluvia normal. Lo que no hay que hacer es sumergirla, lavarla con hidrolavadora ni dejarla a la intemperie todo el tiempo."],
  ["¿Consigo repuestos?", "Sí. Trabajamos con stock de los repuestos de mayor rotación (cámaras, cubiertas, pastillas, luces, cargadores) y pedimos el resto a nuestro proveedor. Es una de las razones por las que conviene comprarla acá y no por internet."],
  ["¿Puedo pagar en cuotas?", "Sí, hasta 12 cuotas sin interés con tarjeta de crédito. También aceptamos transferencia y efectivo, que tienen descuento."],
  ["¿Hacen envíos?", "Sí, entregamos sin cargo en zona oeste y coordinamos envío al resto del país. De todos modos, si podés acercarte a probarla, siempre es mejor: vas a comprar con mucha más seguridad."],
];

/* =====================================================================
   HOME
   ===================================================================== */
const destacados = P.filter((p) => p.destacado);
const homeLD = JSON.stringify({
  "@context": "https://schema.org", "@type": "Store", name: "MC Ebikes",
  description: "Fat e-bikes de 1000W en zona oeste del Gran Buenos Aires. Test ride, service propio y garantía.",
  url: SITE + "/", telephone: "+" + WA, email: MAIL, priceRange: "$$",
  address: { "@type": "PostalAddress", addressLocality: "Castelar", addressRegion: "Buenos Aires", addressCountry: "AR" },
  areaServed: "Zona Oeste del Gran Buenos Aires",
}, null, 1);

const home = `
<section class="hero">
  <div class="hero__bg"><img src="assets/img/v40-camo.webp" alt="Fat e-bike MC Ebikes" fetchpriority="high" width="1200" height="700"></div>
  <div class="wrap">
    <span class="kick">Para el campo argentino</span>
    <h1 class="h1" style="margin-top:16px">TU TERRITORIO.<br>TU MOTOR.<br><em>TU MOMENTO.</em></h1>
    <p class="hero__sub">Fat e-bikes de 1000W con hasta 110 km de autonomía. El primer vehículo propio, con potencia real desde el primer día.</p>
    <div class="hero__cta">
      <a class="btn btn--p btn--lg" href="test-ride.html">Reservar test ride ${ico(I.arrow, 2.2)}</a>
      <a class="btn btn--g btn--lg" href="productos.html">Ver modelos</a>
    </div>
    <div class="hero__specs">
      <div><b>1000W</b><span>Potencia</span></div>
      <div><b>110 km</b><span>Autonomía máx.</span></div>
      <div><b>32 km/h</b><span>Velocidad</span></div>
      <div><b>12</b><span>Cuotas sin interés</span></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kick">Un vehículo de verdad</span>
      <h2 class="h2">Potencia de moto,<br>tranquilidad de e-bike</h2>
      <p>Cargás en un enchufe común de la casa o el galpón y hacés hasta 110 km de campo, camino de tierra y pueblo. La potencia de una moto, con la velocidad limitada que le da tranquilidad a la familia.</p>
    </div>
    <div class="feat">
      <article class="rv"><div class="ic">${ico(I.bolt)}</div><h3>1000W de potencia</h3><p>Arranca en subida, en tierra floja y con carga. Motor con torque real para el terreno del campo, no un asistente tímido.</p></article>
      <article class="rv d1"><div class="ic">${ico(I.bat)}</div><h3>Hasta 110 km</h3><p>Batería de litio extraíble: la cargás en un enchufe común de la casa o el galpón, por menos de $200.</p></article>
      <article class="rv d2"><div class="ic">${ico(I.shield)}</div><h3>Lista desde el primer día</h3><p>La retirás y salís andando por el campo, la chacra o el predio. Velocidad limitada, con control real desde los padres.</p></article>
      <article class="rv d3"><div class="ic">${ico(I.wrench)}</div><h3>Service propio</h3><p>Si algo falla, lo resolvemos nosotros: taller propio, repuestos en stock y una cara visible del otro lado.</p></article>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kick">Modelos</span>
      <h2 class="h2">Elegí la tuya</h2>
      <p>Todas comparten motor de 1000W o más, frenos a disco y llantas fat. Cambian la autonomía, la potencia y el equipamiento.</p>
    </div>
    <div class="grid-p">
      ${destacados.map(pcard).join("\n")}
    </div>
    <div style="margin-top:26px" class="rv"><a class="btn btn--g" href="productos.html">Ver los ${P.length} modelos ${ico(I.arrow, 2.2)}</a></div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="band rv">
      <img src="assets/img/v20-lateral.webp" alt="" loading="lazy">
      <div>
        <span class="kick">Test ride sin cargo</span>
        <h2 class="h2" style="margin-top:14px">Nadie compra<br>lo que no <em>probó</em></h2>
        <p>Es una compra grande. Por eso podés venir, subirte y manejarla por la cuadra antes de decidir nada. Sin compromiso y sin que te vendan humo.</p>
        <a class="btn btn--p btn--lg" href="test-ride.html">Reservar mi test ride</a>
      </div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head sec-head--c rv">
      <span class="kick kick--plain">¿Cuál me conviene?</span>
      <h2 class="h2">Decinos cómo la vas a usar</h2>
      <p>En 5 segundos te decimos qué modelo tiene sentido para vos.</p>
    </div>
    <div class="quiz rv">
      <button data-rec="SW V20 Pro" data-why="Para trayectos urbanos de hasta 25 km diarios es la más equilibrada: 1000W, 65 km de autonomía y el mejor precio de la línea." data-url="v20-pro.html">
        ${ico(I.city)}<b>Ciudad</b><span>Voy al trabajo, hago mandados, trayectos cortos</span>
      </button>
      <button data-rec="SW V29 Pro" data-why="Doble batería intercambiable y hasta 110 km. Si estás todo el día arriba de la bici, es la única que no te deja a pie." data-url="v29-pro.html">
        ${ico(I.box)}<b>Trabajo</b><span>Delivery, reparto, muchas horas por día</span>
      </button>
      <button data-rec="SW V40" data-why="Batería de 18,2Ah y señalización LED completa. Buen punto medio para recorridos largos sin llegar al tope de gama." data-url="v40.html">
        ${ico(I.bike)}<b>Paseo largo</b><span>Salidas de fin de semana, recorridos de 40 km o más</span>
      </button>
      <button data-rec="SW S20 Pro" data-why="1800W: es la que más empuja. Si tenés subidas exigentes o querés la respuesta más fuerte en el acelerador, es esta." data-url="s20-pro.html">
        ${ico(I.bolt)}<b>Potencia</b><span>Quiero la más fuerte, subidas y carga</span>
      </button>
    </div>
    <div class="quiz-res"></div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="split">
      <div class="rv">
        <span class="kick">Cuentas claras</span>
        <h2 class="h2" style="margin:14px 0 14px">¿Cuánto te ahorrás<br>por mes?</h2>
        <p style="margin-bottom:20px">Poné cuántos kilómetros hacés por día y con qué te movés hoy. La cuenta incluye lo que gastás en luz para cargarla.</p>
        <div class="calc" id="calc">
          <div class="calc__in">
            <div class="field">
              <label for="km">Kilómetros por día</label>
              <input type="number" id="km" value="14" min="0" max="200" inputmode="numeric">
            </div>
            <div class="field">
              <label for="medio">Hoy te movés en</label>
              <select id="medio" class="sel">
                <option value="auto">Auto</option>
                <option value="colectivo" selected>Colectivo / SUBE</option>
                <option value="moto">Moto</option>
              </select>
            </div>
          </div>
          <div class="calc__out">
            <div><b id="o-ahorro">$0</b><span>Ahorro por mes</span></div>
            <div><b id="o-cargas">0</b><span>Cargas por mes</span></div>
            <div><b id="o-anual">$0</b><span>Ahorro por año</span></div>
          </div>
        </div>
        <p style="font-size:13px;margin-top:12px;color:var(--cemento-2)">Estimación sobre 22 días hábiles. Valores de referencia, pueden variar.</p>
      </div>
      <div class="split__m rv d1"><img src="assets/img/v29-lateral.webp" alt="MC Ebikes en la calle" loading="lazy" width="1200" height="800"></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv"><span class="kick">Preguntas frecuentes</span><h2 class="h2">Lo que todos preguntan</h2></div>
    <div class="faq rv">
      ${FAQS.slice(0, 4).map(([q, a]) => faqItem(q, a)).join("")}
    </div>
    <div style="margin-top:24px" class="rv"><a class="btn btn--g" href="faq.html">Ver todas las preguntas</a></div>
  </div>
</section>
${ctaBlock()}`;

writeFileSync(new URL("./index.html", import.meta.url), page({
  slug: "index", active: "index",
  title: "MC Ebikes | Fat E-Bikes 1000W para el Campo Argentino",
  desc: "Fat e-bikes de 1000W con hasta 110 km de autonomía. Tu primer vehículo propio, sin patente ni límite de edad. Test ride sin cargo y envío a todo el país.",
  ld: homeLD,
  preload: `\n<link rel="preload" as="image" href="assets/img/v40-camo.webp" fetchpriority="high">`,
  main: home,
}));
console.log("✓ index.html");

/* =====================================================================
   CATÁLOGO
   ===================================================================== */
const catalogo = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="index.html">Inicio</a> / <span aria-current="page">Modelos</span></nav>
    <span class="kick">${P.length} modelos disponibles</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,68px);margin-top:14px">Elegí tu <em>territorio</em></h1>
    <p>Todas fat, todas con frenos a disco y arranque por NFC. Elegí por autonomía, potencia o precio.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="filters">
      <span class="filters__lbl">Filtrar</span>
      <button class="chip on" data-f="todos">Todos</button>
      <button class="chip" data-f="urbana">Ciudad</button>
      <button class="chip" data-f="larga-distancia">Larga distancia</button>
      <button class="chip" data-f="potencia">Máxima potencia</button>
      <div class="filters__r">
        <span class="count" data-count>${P.length} modelos</span>
        <select class="sel" data-sort aria-label="Ordenar">
          <option value="rec">Recomendados</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
          <option value="autonomia">Mayor autonomía</option>
        </select>
      </div>
    </div>
    <div class="grid-p">
      ${P.map(pcard).join("\n")}
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv"><span class="kick">Comparador</span><h2 class="h2">Todas, lado a lado</h2></div>
    <div class="cmp rv">
      <table>
        <thead><tr><th>Modelo</th>${P.map((p) => `<th>${p.name}</th>`).join("")}</tr></thead>
        <tbody>
          <tr><td>Motor</td>${P.map((p) => `<td class="${p.motor === "1800W" ? "hl" : ""}">${p.motor}</td>`).join("")}</tr>
          <tr><td>Batería</td>${P.map((p) => `<td>${p.bat}</td>`).join("")}</tr>
          <tr><td>Autonomía</td>${P.map((p) => `<td class="${p.autNum === 110 ? "hl" : ""}">${p.aut}</td>`).join("")}</tr>
          <tr><td>Velocidad máx.</td>${P.map((p) => `<td>${p.vel}</td>`).join("")}</tr>
          <tr><td>Carga máx.</td>${P.map((p) => `<td>${p.carga}</td>`).join("")}</tr>
          <tr><td>Recarga</td>${P.map((p) => `<td>${p.recarga}</td>`).join("")}</tr>
          <tr><td>Ideal para</td>${P.map((p) => `<td style="font-family:var(--t);font-weight:400;font-size:14px;color:var(--cemento)">${p.uso}</td>`).join("")}</tr>
          <tr><td>Precio</td>${P.map((p) => `<td class="hl">${money(p.price)}</td>`).join("")}</tr>
          <tr><td></td>${P.map((p) => `<td><a class="btn btn--p btn--sm" href="${p.slug}.html">Ver</a></td>`).join("")}</tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
${ctaBlock()}`;

writeFileSync(new URL("./productos.html", import.meta.url), page({
  slug: "productos", active: "productos",
  title: "Modelos de Fat E-Bikes | MC Ebikes Castelar",
  desc: "Comparar todos los modelos de bicicletas eléctricas fat de MC Ebikes: motor, autonomía, velocidad y precio. Test ride sin cargo en Castelar.",
  main: catalogo,
}));
console.log("✓ productos.html");

/* =====================================================================
   FICHAS DE PRODUCTO
   ===================================================================== */
for (const p of P) {
  const ld = JSON.stringify({
    "@context": "https://schema.org", "@type": "Product", name: p.name,
    description: p.lead, image: `${SITE}/assets/img/${p.img}.webp`,
    brand: { "@type": "Brand", name: "MC Ebikes" }, category: "Bicicleta eléctrica",
    offers: { "@type": "Offer", priceCurrency: "ARS", price: p.price, availability: "https://schema.org/InStock", url: `${SITE}/${p.slug}.html` },
  }, null, 1);

  const otros = P.filter((x) => x.slug !== p.slug).slice(0, 3);
  const main = `
<section class="sec" style="padding-top:calc(var(--nav-h) + 32px)">
  <div class="wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="index.html">Inicio</a> / <a href="productos.html">Modelos</a> / <span aria-current="page">${p.name}</span></nav>
    <div class="pd">
      <div>
        <div class="gal__main"><img src="assets/img/${p.gal[0]}.webp" alt="${p.name}" fetchpriority="high" width="1200" height="900"></div>
        <div class="gal__thumbs">
          ${p.gal.map((g, i) => `<button class="${i === 0 ? "on" : ""}" data-full="assets/img/${g}.webp" aria-label="Ver imagen ${i + 1}"><img src="assets/img/${g}-sm.webp" alt="${p.name} vista ${i + 1}" loading="lazy" width="200" height="200"></button>`).join("\n          ")}
        </div>
      </div>

      <div>
        <span class="pd__cat">Fat e-bike · ${p.tagline}</span>
        <h1>${p.name}</h1>
        <p class="pd__lead">${p.lead}</p>

        <div class="keyspecs">
          <div>${ico(I.bolt)}<b>${p.motor}</b><span>Motor</span></div>
          <div>${ico(I.bat)}<b>${p.autNum} km</b><span>Autonomía</span></div>
          <div>${ico(I.speed)}<b>32 km/h</b><span>Velocidad</span></div>
          <div>${ico(I.weight)}<b>${p.carga}</b><span>Carga máx.</span></div>
        </div>

        <div class="pd__price">
          <div class="price">${money(p.price)}</div>
          <div class="cuotas">12 cuotas sin interés de ${money(Math.round(p.price / 12))}</div>
          <div class="note">Transferencia o efectivo: consultanos el descuento</div>
          <div class="stock" style="margin-top:10px"><i></i>Disponible para probar en el local</div>
        </div>

        <div class="pd__acts">
          <a class="btn btn--p btn--lg btn--block" href="test-ride.html?m=${p.slug}">Reservar test ride sin cargo</a>
          <div class="row">
            <a class="btn btn--wa" href="${WA_TXT(`Hola MC Ebikes, quiero consultar por la ${p.name}.`)}" target="_blank" rel="noopener">${waIcon} Consultar</a>
            <a class="btn btn--g" href="#specs">Ficha técnica</a>
          </div>
        </div>

        <div class="trust">
          <div>${ico(I.shield)}<span><b>Garantía</b><span>12 meses cuadro y motor · 6 batería</span></span></div>
          <div>${ico(I.wrench)}<span><b>Service propio</b><span>Lo resolvemos acá, en Castelar</span></span></div>
          <div>${ico(I.card)}<span><b>12 cuotas</b><span>Sin interés con tarjeta</span></span></div>
          <div>${ico(I.pin)}<span><b>Entrega</b><span>Sin cargo en zona oeste</span></span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec" id="specs" style="padding-top:0">
  <div class="wrap">
    <div class="split">
      <div class="rv">
        <span class="kick">Ficha técnica</span>
        <h2 class="h2" style="margin:14px 0 20px">Todo lo que trae</h2>
        <table class="spec-table">
          <tr><td>Potencia del motor</td><td>${p.motor}</td></tr>
          <tr><td>Batería</td><td>${p.bat} · litio</td></tr>
          <tr><td>Autonomía</td><td>${p.aut}</td></tr>
          <tr><td>Velocidad máxima</td><td>${p.vel}</td></tr>
          <tr><td>Capacidad de carga</td><td>${p.carga}</td></tr>
          <tr><td>Tiempo de recarga</td><td>${p.recarga}</td></tr>
          <tr><td>Peso aproximado</td><td>${p.peso}</td></tr>
          <tr><td>Frenos</td><td>Disco delantero y trasero</td></tr>
          <tr><td>Llantas</td><td>Fat 20" Kenda</td></tr>
          <tr><td>Arranque</td><td>NFC</td></tr>
        </table>
      </div>
      <div class="rv d1">
        <span class="kick">Equipamiento</span>
        <h2 class="h2" style="margin:14px 0 20px">Viene con todo</h2>
        <ul class="ticks">
          ${p.extras.map((e) => `<li>${ico(I.check, 2)}<span>${e}</span></li>`).join("\n          ")}
        </ul>
        <div class="band" style="min-height:200px;margin-top:24px">
          <img src="assets/img/${p.gal[1]}.webp" alt="" loading="lazy">
          <div>
            <h3 class="h3">Ideal para</h3>
            <p style="margin:10px 0 0">${p.uso}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv"><span class="kick">Otros modelos</span><h2 class="h2">Comparalo con</h2></div>
    <div class="grid-p">${otros.map(pcard).join("\n")}</div>
  </div>
</section>
${ctaBlock(`¿Te quedaste con la ${p.name}?`, "Vení a probarla antes de decidir. El test ride no tiene cargo ni compromiso.")}`;

  writeFileSync(new URL(`./${p.slug}.html`, import.meta.url), page({
    slug: p.slug, active: "productos",
    title: `${p.name} — Fat E-Bike ${p.motor} | MC Ebikes`,
    desc: `${p.name}: motor ${p.motor}, batería ${p.bat}, ${p.aut} de autonomía y 12 cuotas sin interés. Test ride sin cargo en Castelar.`,
    ld,
    preload: `\n<link rel="preload" as="image" href="assets/img/${p.gal[0]}.webp" fetchpriority="high">`,
    main,
  }));
  console.log("✓ " + p.slug + ".html");
}

/* =====================================================================
   TEST RIDE
   ===================================================================== */
const testride = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="index.html">Inicio</a> / <span aria-current="page">Test ride</span></nav>
    <span class="kick">Sin cargo · Sin compromiso</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Probala <em>antes</em><br>de comprarla</h1>
    <p>Coordinás día y horario, venís al local y la manejás vos. Recién ahí decidís.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="split" style="align-items:start">
      <div class="rv">
        <form class="form" id="f-test" novalidate>
          <h2 class="h3" style="margin-bottom:6px">Reservá tu test ride</h2>
          <p style="font-size:14px;margin-bottom:20px">Completás, y se abre WhatsApp con el mensaje listo para enviar.</p>
          <div class="form__g">
            <div class="field full"><label for="t-n">Tu nombre *</label><input id="t-n" name="nombre" required placeholder="Nombre y apellido"></div>
            <div class="field full"><label for="t-m">¿Cuál querés probar? *</label>
              <select id="t-m" name="modelo" class="sel" required>
                ${P.map((x) => `<option value="${x.name}">${x.name}</option>`).join("\n                ")}
                <option value="No sé, quiero asesoramiento">No sé, quiero que me asesoren</option>
              </select>
            </div>
            <div class="field"><label for="t-d">Día que te queda cómodo</label><input id="t-d" name="dia" placeholder="Ej: sábado a la mañana"></div>
            <div class="field"><label for="t-t">Teléfono</label><input id="t-t" name="telefono" type="tel" placeholder="Tu número"></div>
            <div class="field full"><label for="t-c">Algo que quieras aclarar</label><textarea id="t-c" name="mensaje" placeholder="Contanos cómo la vas a usar y te asesoramos mejor"></textarea></div>
          </div>
          <button class="btn btn--p btn--lg btn--block" style="margin-top:18px" type="submit">${waIcon} Reservar por WhatsApp</button>
          <div class="ok">Listo, abrimos WhatsApp con tu reserva. Si no se abrió, escribinos directo.</div>
        </form>
      </div>
      <div class="rv d1">
        <span class="kick">Cómo funciona</span>
        <h2 class="h2" style="margin:14px 0 22px">Simple y sin vueltas</h2>
        <div class="feat" style="grid-template-columns:1fr">
          <article><div class="ic">${ico(I.user)}</div><h3>1 · Reservás</h3><p>Nos decís qué modelo te interesa y cuándo podés venir. Te confirmamos por WhatsApp.</p></article>
          <article><div class="ic">${ico(I.bike)}</div><h3>2 · La manejás</h3><p>Te la damos con casco y la probás por la zona. Sin apuro y sin nadie encima tuyo vendiéndote.</p></article>
          <article><div class="ic">${ico(I.check)}</div><h3>3 · Decidís</h3><p>Si te gustó, te la llevás ese mismo día. Si no, no pasa nada: para eso está la prueba.</p></article>
        </div>
        <div class="info-cards" style="margin-top:20px">
          <div class="info-c"><span class="ic">${ico(I.pin)}</span><span><span class="k">Dónde</span><span class="v sm">${DIR}</span></span></div>
          <div class="info-c"><span class="ic">${ico(I.clock)}</span><span><span class="k">Cuándo</span><span class="v sm">${HORARIO}</span></span></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
writeFileSync(new URL("./test-ride.html", import.meta.url), page({
  slug: "test-ride", active: "",
  title: "Reservá tu Test Ride sin cargo | MC Ebikes Castelar",
  desc: "Probá la bici eléctrica antes de comprarla. Reservá día y horario para tu test ride sin cargo ni compromiso en Castelar, zona oeste.",
  main: testride,
}));
console.log("✓ test-ride.html");

/* =====================================================================
   SERVICIO / POSTVENTA
   ===================================================================== */
const servicio = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="index.html">Inicio</a> / <span aria-current="page">Service</span></nav>
    <span class="kick">Postventa</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Te respondemos<br><em>después</em> de venderte</h1>
    <p>La diferencia entre comprar acá y comprar por internet no se nota el día que la comprás. Se nota el día que algo falla.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="feat">
      <article class="rv"><div class="ic">${ico(I.shield)}</div><h3>Garantía real</h3><p>12 meses en cuadro y motor, 6 meses en batería. Con factura y sin letra chica.</p></article>
      <article class="rv d1"><div class="ic">${ico(I.wrench)}</div><h3>Taller propio</h3><p>El service lo hacemos nosotros en Castelar. No la mandás a otra provincia ni esperás semanas.</p></article>
      <article class="rv d2"><div class="ic">${ico(I.box)}</div><h3>Repuestos</h3><p>Stock de lo que más se usa: cubiertas, cámaras, pastillas, luces y cargadores.</p></article>
      <article class="rv d3"><div class="ic">${ico(I.user)}</div><h3>Cara visible</h3><p>Sabés quién te vendió y dónde encontrarlo. No es un vendedor anónimo de internet.</p></article>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="split">
      <div class="rv">
        <span class="kick">Mantenimiento</span>
        <h2 class="h2" style="margin:14px 0 18px">Cuidados básicos</h2>
        <p style="margin-bottom:18px">Una e-bike bien cuidada dura años. No hace falta mucho:</p>
        <ul class="ticks">
          <li>${ico(I.check, 2)}<span><strong>Cargala antes de que llegue a cero.</strong> La batería de litio sufre más si la vaciás del todo seguido.</span></li>
          <li>${ico(I.check, 2)}<span><strong>Si no la vas a usar por semanas,</strong> dejala cargada a la mitad y en un lugar seco.</span></li>
          <li>${ico(I.check, 2)}<span><strong>Revisá la presión de las cubiertas</strong> cada 15 días: es lo que más afecta la autonomía.</span></li>
          <li>${ico(I.check, 2)}<span><strong>Limpiala con trapo húmedo,</strong> nunca con hidrolavadora ni manguera a presión.</span></li>
          <li>${ico(I.check, 2)}<span><strong>Traela al primer service</strong> a los 300 km: ajustamos frenos, radios y transmisión sin cargo.</span></li>
        </ul>
      </div>
      <div class="split__m rv d1"><img src="assets/img/v29-detalle.webp" alt="Detalle de la e-bike" loading="lazy" width="1200" height="800"></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv"><span class="kick">Dudas de postventa</span><h2 class="h2">Preguntas sobre service</h2></div>
    <div class="faq rv">
      ${[FAQS[3], FAQS[5], FAQS[4], FAQS[1]].map(([q, a]) => faqItem(q, a)).join("")}
    </div>
  </div>
</section>
${ctaBlock("¿Necesitás service o un repuesto?", "Escribinos y te decimos si lo tenemos en stock y cuánto tarda.")}`;
writeFileSync(new URL("./servicio.html", import.meta.url), page({
  slug: "servicio", active: "servicio",
  title: "Service, Garantía y Repuestos | MC Ebikes Castelar",
  desc: "Taller propio en Castelar: garantía de 12 meses, service de bicicletas eléctricas, repuestos en stock y soporte real después de la compra.",
  main: servicio,
}));
console.log("✓ servicio.html");

/* =====================================================================
   NOSOTROS
   ===================================================================== */
const nosotros = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="index.html">Inicio</a> / <span aria-current="page">Nosotros</span></nav>
    <span class="kick">Quiénes somos</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Movilidad eléctrica<br>con <em>cara visible</em></h1>
    <p>Somos un local de zona oeste dedicado a la movilidad eléctrica urbana. Elegimos pocos modelos, los probamos y los bancamos.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="split">
      <div class="rv prose">
        <h2 class="h2">Por qué existimos</h2>
        <p>Hoy casi todas las bicis eléctricas se venden por internet: elegís una foto, pagás más de un millón y medio de pesos y esperás que llegue bien. No la probaste, no sabés si te queda cómoda, y si falla la batería no sabés a quién reclamarle.</p>
        <p>MC Ebikes nace de ahí. <strong>Queríamos un lugar donde la puedas probar, donde te expliquen de verdad cuál te conviene y donde sepas quién te va a atender si algo pasa.</strong></p>
        <h3>Cómo elegimos lo que vendemos</h3>
        <p>No traemos catálogos infinitos. Trabajamos pocos modelos, todos fat, todos con motor de 1000W o más, frenos a disco y batería de litio con arranque NFC. Los tenemos en el local, los usamos y sabemos cómo se comportan en las calles del oeste.</p>
      </div>
      <div class="split__m rv d1"><img src="assets/img/v8-negra.webp" alt="Local MC Ebikes" loading="lazy" width="1200" height="800"></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv"><span class="kick">En qué creemos</span><h2 class="h2">Nuestra forma de trabajar</h2></div>
    <div class="feat">
      <article class="rv"><div class="ic">${ico(I.bike)}</div><h3>Probar antes</h3><p>Nadie debería gastar esta plata sin subirse primero. El test ride es gratis y sin compromiso, siempre.</p></article>
      <article class="rv d1"><div class="ic">${ico(I.check)}</div><h3>Datos reales</h3><p>Te decimos la autonomía real con tu peso y tus subidas, no el número de laboratorio del fabricante.</p></article>
      <article class="rv d2"><div class="ic">${ico(I.wrench)}</div><h3>Bancar lo vendido</h3><p>Vendemos lo que podemos reparar. Si no tenemos cómo darte service, no lo traemos.</p></article>
      <article class="rv d3"><div class="ic">${ico(I.user)}</div><h3>Sin verso</h3><p>Si una e-bike no te sirve para lo que necesitás, te lo decimos. Preferimos no vender antes que vender mal.</p></article>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="band rv">
      <img src="assets/img/v40-camo.webp" alt="" loading="lazy">
      <div>
        <span class="kick">Zona oeste</span>
        <h2 class="h2" style="margin-top:14px">Estamos en <em>Castelar</em></h2>
        <p>Atendemos Castelar, Morón, Ituzaingó, Haedo, Ramos Mejía y alrededores. Entrega sin cargo en la zona.</p>
        <a class="btn btn--p btn--lg" href="contacto.html">Cómo llegar</a>
      </div>
    </div>
  </div>
</section>
${ctaBlock()}`;
writeFileSync(new URL("./nosotros.html", import.meta.url), page({
  slug: "nosotros", active: "nosotros",
  title: "Nosotros | MC Ebikes, movilidad eléctrica en zona oeste",
  desc: "Somos un local de Castelar especializado en fat e-bikes. Pocos modelos elegidos, test ride sin cargo, service propio y asesoramiento honesto.",
  main: nosotros,
}));
console.log("✓ nosotros.html");

/* =====================================================================
   FAQ
   ===================================================================== */
const faqLD = JSON.stringify({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
const faqPage = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="index.html">Inicio</a> / <span aria-current="page">Preguntas</span></nav>
    <span class="kick">Preguntas frecuentes</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Todo lo que<br>querés <em>saber</em></h1>
    <p>Las dudas reales que nos llegan todos los días. Si te queda alguna, escribinos.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="faq rv">${FAQS.map(([q, a]) => faqItem(q, a)).join("")}</div>
  </div>
</section>
${ctaBlock("¿Te quedó una duda?", "Escribinos por WhatsApp y te respondemos en el día.")}`;
writeFileSync(new URL("./faq.html", import.meta.url), page({
  slug: "faq", active: "faq", ld: faqLD,
  title: "Preguntas Frecuentes sobre Bicicletas Eléctricas | MC Ebikes",
  desc: "¿Necesito patente? ¿Cuánto dura la batería? ¿Qué garantía tiene? Respuestas claras sobre bicicletas eléctricas fat en Argentina.",
  main: faqPage,
}));
console.log("✓ faq.html");

/* =====================================================================
   CONTACTO
   ===================================================================== */
const contacto = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="index.html">Inicio</a> / <span aria-current="page">Contacto</span></nav>
    <span class="kick">Hablemos</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Estamos <em>acá</em></h1>
    <p>Escribinos, llamanos o vení al local. Lo que te quede más cómodo.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="split" style="align-items:start">
      <div class="rv">
        <span class="kick">Datos</span>
        <h2 class="h2" style="margin:14px 0 22px">Cómo encontrarnos</h2>
        <div class="info-cards">
          <a class="info-c" href="${WA_TXT("Hola MC Ebikes, quiero hacer una consulta.")}" target="_blank" rel="noopener">
            <span class="ic">${waIcon}</span><span><span class="k">WhatsApp — lo más rápido</span><span class="v">Escribinos ahora</span></span></a>
          <a class="info-c" href="mailto:${MAIL}"><span class="ic">${ico(I.mail)}</span><span><span class="k">Email</span><span class="v sm">${MAIL}</span></span></a>
          <div class="info-c"><span class="ic">${ico(I.pin)}</span><span><span class="k">Local</span><span class="v sm">${DIR}</span></span></div>
          <div class="info-c"><span class="ic">${ico(I.clock)}</span><span><span class="k">Horarios</span><span class="v sm">${HORARIO}</span></span></div>
        </div>
        <div style="margin-top:22px;border-radius:var(--r-lg);overflow:hidden;border:1px solid var(--linea)">
          <iframe title="Ubicación de MC Ebikes" src="https://www.google.com/maps?q=Castelar,+Buenos+Aires&output=embed" width="100%" height="300" style="border:0;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      <div class="rv d1">
        <form class="form" id="f-contacto" novalidate>
          <h2 class="h3" style="margin-bottom:6px">Mandanos tu consulta</h2>
          <p style="font-size:14px;margin-bottom:20px">Al enviar se abre WhatsApp con tu mensaje listo.</p>
          <div class="form__g">
            <div class="field full"><label for="c-n">Nombre *</label><input id="c-n" name="nombre" required placeholder="Tu nombre"></div>
            <div class="field"><label for="c-e">Email</label><input id="c-e" name="email" type="email" placeholder="tu@email.com"></div>
            <div class="field"><label for="c-t">Teléfono</label><input id="c-t" name="telefono" type="tel" placeholder="Tu número"></div>
            <div class="field full"><label for="c-m">Consulta *</label><textarea id="c-m" name="mensaje" required placeholder="¿En qué te podemos ayudar?"></textarea></div>
          </div>
          <button class="btn btn--p btn--lg btn--block" style="margin-top:18px" type="submit">${waIcon} Enviar consulta</button>
          <div class="ok">Listo, abrimos WhatsApp con tu mensaje.</div>
        </form>
      </div>
    </div>
  </div>
</section>`;
writeFileSync(new URL("./contacto.html", import.meta.url), page({
  slug: "contacto", active: "contacto",
  title: "Contacto | MC Ebikes Castelar, Zona Oeste",
  desc: `Contactá a MC Ebikes en Castelar. WhatsApp, email y local. ${HORARIO}. Atendemos Morón, Ituzaingó, Haedo y alrededores.`,
  main: contacto,
}));
console.log("✓ contacto.html");

/* ---------- 404 ---------- */
writeFileSync(new URL("./404.html", import.meta.url), page({
  slug: "404", active: "",
  title: "Página no encontrada | MC Ebikes",
  desc: "La página que buscás no existe.",
  main: `<section class="sec" style="padding-top:calc(var(--nav-h) + 80px);min-height:70vh;display:flex;align-items:center">
  <div class="wrap center">
    <span class="kick kick--plain" style="justify-content:center">Error 404</span>
    <h1 class="h1" style="margin:16px 0">Esta página<br><em style="font-style:normal;color:var(--ambar)">se fue andando</em></h1>
    <p style="margin-inline:auto;max-width:44ch">No encontramos lo que buscabas. Volvé al inicio o mirá los modelos.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:26px">
      <a class="btn btn--p btn--lg" href="index.html">Ir al inicio</a>
      <a class="btn btn--g btn--lg" href="productos.html">Ver modelos</a>
    </div>
  </div>
</section>`,
}));
console.log("✓ 404.html");

/* ---------- Manifest, sitemap, robots ---------- */
writeFileSync(new URL("./site.webmanifest", import.meta.url), JSON.stringify({
  name: "MC Ebikes", short_name: "MC Ebikes",
  description: "Fat e-bikes de 1000W en zona oeste.",
  start_url: "/", display: "standalone", background_color: "#14161A", theme_color: "#14161A",
  icons: [{ src: "assets/img/icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "assets/img/icon-512.png", sizes: "512x512", type: "image/png" }],
}, null, 2));

const urls = [["", "1.0"], ["productos.html", "0.9"], ["test-ride.html", "0.9"], ["servicio.html", "0.8"],
["nosotros.html", "0.7"], ["faq.html", "0.7"], ["contacto.html", "0.8"], ...P.map((p) => [`${p.slug}.html`, "0.9"])];
const today = new Date().toISOString().slice(0, 10);
writeFileSync(new URL("./sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([u, p]) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join("\n") +
  `\n</urlset>`);
writeFileSync(new URL("./robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("✓ sitemap.xml + robots.txt + manifest");
console.log("\nBuild completo — " + (7 + P.length) + " páginas");
