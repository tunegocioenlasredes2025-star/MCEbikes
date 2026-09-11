/* =====================================================================
   MC EBIKES — generador estático
   node build.mjs
   ===================================================================== */
import { writeFileSync } from "node:fs";

/* Direccion oficial del sitio. Hoy es la de Vercel, que es donde vive de
   verdad: si el sitio declara un dominio que todavia no existe, Google lee
   una contradiccion y no consolida las paginas. Cuando el dominio propio
   este activo se cambia esta linea y se rehace el build; canonical, Open
   Graph, sitemap y robots se actualizan solos. */
const SITE = "https://mc-ebikes.vercel.app";
/* TODO: reemplazar por el WhatsApp real de MC Ebikes */
const WA = "5491112345678";
const WA_TXT = (m) => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const MAIL = "hola@mcebikes.com.ar";
/* Medida de analitica. Vacio = no se carga ningun script de terceros ni se
   deja ninguna cookie. Al pegar aca el ID de Google Analytics (G-XXXXXXX) o
   el de Tag Manager (GTM-XXXXXX) se activa en las catorce paginas y los
   eventos que ya estan instrumentados en app.js empiezan a reportar. */
const GA4 = "";
const GTM = "";
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
   Lockup horizontal del logo OFICIAL (Opcion 4, elegida por el cliente el
   18-ago-2026): la ruta abierta con el ciclista + M(rayo)C E-BIKES.
   Va en contornos, asi que no depende de tener la tipografia instalada.
   La ruta hereda currentColor; el rayo queda siempre en ambar. */
/* Logo oficial del cliente, tal cual el archivo (LOGO MC EBIKES 3.png).
   Esta en gris carbon #2B3035, que solo se lee sobre fondo claro: por eso
   la barra superior va en Blanco Hueso y no en Negro Carbon. */
/* Van los dos archivos en el DOM y decide el CSS cual se ve: sobre la foto
   del hero la barra es transparente y entra el trazado en blanco (el mismo
   que aprobo el cliente en la propuesta elegida); apenas se scrollea vuelve
   la barra clara con el logo en su color original. */
const LOGO = (h = 48) => `<img class="lg-color" src="assets/img/logo-horizontal.webp?v=${V}" alt="MC E-Bikes" height="${h}" width="${Math.round(h * 3)}" style="height:${h}px;width:auto"><img class="lg-blanco" src="assets/img/MC-E-Bikes-horizontal-blanco.svg?v=${V}" alt="" aria-hidden="true" height="${h}" width="${Math.round(h * 3)}" style="height:${h}px;width:auto">`;

/* Tagline oficial (anexo del Manual de Marca v1.0) */
const TAGLINE = "Tu mundo se mueve con vos";

/* =====================================================================
   PRODUCTOS — datos reales de las fichas del proveedor
   PRECIOS PROVISORIOS: confirmar con el cliente antes de publicar
   ===================================================================== */
const P = [
  {
    slug: "v20-pro",
    tituloSeo: "Fat e-bike para recorridos cortos",
    etiqueta: "Fat e-bike · Recorridos cotidianos",
    subtitulo: "Para ir, volver y seguir con tu día",
    aeo: "Es un modelo para evaluar cuando la persona necesita hacer recorridos cotidianos y relativamente cortos entre casa, pueblo, casco u otros puntos cercanos. La elección final depende de distancia, terreno, carga, autonomía disponible y condiciones de uso.",
    paraQuien: "Tiene sentido compararla si el recorrido habitual es corto, si existe un lugar seguro para guardarla y cargarla, y si la carga, la posición y el tamaño resultan adecuados para quien la va a usar.",
    faqs: [["¿La SW V20 Pro sirve para ir y volver del pueblo?", "Es el primer modelo a evaluar para recorridos cortos entre casa y pueblo. La distancia debe calcularse de ida y vuelta, dejando margen para terreno, viento, carga y cambios de recorrido."], ["¿Cuántos kilómetros hace?", "Publicamos una autonomía de 50 a 65 km según la tabla del modelo. El resultado real depende de las condiciones de uso: en tierra, con peso o en pendiente rinde menos."], ["¿Qué carga soporta?", "La carga máxima publicada es de 150 kg. Ese valor incluye a quien la maneja más lo que lleve encima."], ["¿Puedo probarla?", "Sí, con test ride sin cargo en Castelar, sujeto a disponibilidad. Si la va a usar un menor, la reserva y las reglas se coordinan con un adulto responsable."]], name: "SW V20 Pro", ord: 1,
    cat: "urbana destacada",
    tagline: "La más elegida",
    lead: "La SW V20 Pro es el primer modelo a evaluar cuando el recorrido principal conecta casa, pueblo, casco, escuela, club u otros puntos cercanos. Compará la distancia real, el terreno y la carga antes de decidir.",
    price: 1890000, old: null, badge: "Más elegida",
    motor: "1000W", bat: "48V / 15,6Ah", aut: "50 a 65 km", vel: "32 km/h",
    autNum: 65, carga: "150 kg", recarga: "4 a 6 horas", peso: "40 kg aprox.",
    img: "v20-negra", gal: ["v20-negra", "v20-azul", "v20-rosa", "v20-perfil"],
    uso: "Recorridos cortos, ir y venir del pueblo o del casco, hasta 25 km por día", rec: "Entre casa, pueblo y casco",
    datos: "1000W · hasta 65 km · 32 km/h",
    limites: "Revisá la distancia de ida y vuelta, la reserva que necesitás, el viento, las pendientes, el estado del camino, el peso, la carga, el lugar de guardado y el acceso a recarga. Para un adolescente, la compra y las condiciones de uso deben evaluarse con los adultos responsables.",
    destacado: true,
    extras: ["Panel digital a color", "Arranque por NFC", "Alarma integrada", "Frenos a disco adelante y atrás", "Llantas fat Kenda 20\"", "Amortiguación delantera"],
  },
  {
    slug: "v29-pro",
    tituloSeo: "Fat e-bike de doble batería",
    etiqueta: "Fat e-bike · Doble batería, doble territorio",
    subtitulo: "Cuando un solo tanque se te queda corto",
    aeo: "Es un modelo para evaluar cuando se necesitan jornadas largas o recorridos extensos de campo y la doble batería puede aportar más margen entre cargas. La autonomía real depende del peso, el terreno, el viento, la asistencia, el acelerador, la carga y el estado de las baterías.",
    paraQuien: "Tiene sentido compararla si el recorrido es largo, si se necesita planificar una jornada con más margen y si la familia puede guardar, cargar y mantener correctamente las baterías.",
    faqs: [["¿Cuánto rinde de verdad la doble batería?", "La autonomía publicada es de hasta 110 km sumando las dos baterías, medida en condiciones favorables. En tierra, con peso o con viento en contra rinde menos: por eso conviene calcular el recorrido con margen."], ["¿Se pueden cargar las dos juntas?", "Consultanos antes de comprar: el tiempo total de recarga y el procedimiento dependen del cargador que viene con la unidad."], ["¿Qué pasa si una batería pierde autonomía?", "Escribinos y lo diagnosticamos en el taller. El reemplazo y lo que cubre la garantía dependen del documento vigente, que te mostramos antes de la compra."], ["¿Es muy pesada?", "El peso aproximado publicado es de 45 kg. Es la más pesada de la línea junto con la V40, así que conviene probarla y ver dónde la vas a guardar."]], name: "SW V29 Pro", ord: 2,
    cat: "larga-distancia destacada",
    tagline: "Doble batería, doble territorio",
    lead: "Con doble batería y hasta 110 km de autonomía publicada, la SW V29 Pro está pensada para evaluar cuando el recorrido de campo es largo y la posibilidad de volver a cargar durante el día es limitada. El resultado depende de las condiciones reales.",
    price: 2340000, old: null, badge: "Doble batería",
    motor: "1000W", bat: "48V / 15,6Ah ×2", aut: "hasta 110 km", vel: "32 km/h",
    autNum: 110, carga: "150 kg", recarga: "4 a 6 horas", peso: "45 kg aprox.",
    img: "v29-negra", gal: ["v29-negra", "v29-lateral", "v29-detalle"],
    uso: "Recorrer el campo de punta a punta, todo el día", rec: "Campo y pueblo durante el día",
    datos: "1000W · hasta 110 km · doble batería",
    limites: "La doble batería puede aumentar el peso, el precio y la complejidad de la decisión. Consultá cómo se cargan, cómo se guardan, qué ocurre si una batería pierde autonomía, qué cubre la garantía y cómo se consigue un reemplazo. Son unos 45 kg: si la vas a levantar o guardar en un lugar chico, vení a verla antes.",
    destacado: true,
    extras: ["Dos baterías intercambiables", "Panel digital", "Arranque por NFC", "Portaequipaje reforzado", "Frenos a disco", "Amortiguación delantera"],
  },
  {
    slug: "v40",
    tituloSeo: "Fat e-bike para campo y pueblo",
    etiqueta: "Fat e-bike · Uso mixto",
    subtitulo: "Un recorrido que combina pueblo y campo",
    aeo: "Es un modelo para evaluar cuando el uso combina pueblo y campo. La elección final depende de kilómetros diarios, terreno, viento, carga, recarga, guardado y service.",
    paraQuien: "Tiene sentido compararla si la persona necesita una bicicleta para un uso mixto y quiere equilibrar autonomía, batería, precio y recorrido.",
    faqs: [["¿Sirve igual en asfalto y en tierra?", "Está pensada para eso. La batería de 18,2Ah y la señalización LED completa la hacen cómoda en los dos, pero en tierra o barro la autonomía baja respecto de la cifra publicada."], ["¿Cuántos kilómetros hace?", "La autonomía publicada es de hasta 75 km en condiciones favorables. En uso mixto real conviene calcular con margen."], ["¿Es muy pesada para el uso diario?", "Son 47,7 kg declarados, la más pesada de la línea. Para andar no se siente, pero sí importa dónde la guardás y si tenés que levantarla."], ["¿Puedo probarla antes de decidir?", "Sí, con test ride sin cargo en Castelar. Es el modelo que más conviene probar, justamente porque es el del medio."]], name: "SW V40", ord: 3,
    cat: "urbana",
    tagline: "Uso mixto",
    lead: "La SW V40 es el modelo para evaluar cuando el día mezcla caminos del pueblo, calles, recorridos rurales y trayectos de distancia intermedia. Compará el recorrido real y consultá si el modelo tiene el margen que necesitás.",
    price: 2150000, old: null, badge: null,
    motor: "1000W", bat: "48V / 18,2Ah", aut: "hasta 75 km", vel: "32 km/h",
    autNum: 75, carga: "150 kg", recarga: "5 a 6 horas", peso: "47,7 kg",
    img: "v40-negra", gal: ["v40-negra", "v40-camo", "v8-negra", "v8-frente"],
    uso: "Uso mixto entre el pueblo y el campo", rec: "Uso mixto",
    datos: "1000W · hasta 75 km · 32 km/h",
    limites: "Es la más pesada de las cuatro: 47,7 kg declarados. Está pensada para rendir parejo en los dos terrenos, así que no es ni la de más autonomía ni la de más potencia. Si tu uso se inclina claramente para un lado, hay un modelo mejor.",
    destacado: false,
    extras: ["Batería de 18,2Ah", "Señalización LED completa", "Panel digital", "Arranque por NFC", "Frenos a disco", "Llantas fat Kenda"],
  },
  {
    slug: "s20-pro",
    tituloSeo: "Fat e-bike para pendientes y carga",
    etiqueta: "Fat e-bike · Pendientes y carga",
    subtitulo: "Potencia para evaluar pendientes y carga",
    aeo: "Es un modelo para evaluar cuando la prioridad es la potencia y el recorrido incluye pendientes o carga. Hay que respetar la carga máxima, las condiciones del terreno, la autonomía disponible y las recomendaciones técnicas.",
    paraQuien: "Tiene sentido compararla si hay pendientes, carga o una necesidad específica de potencia. No debe elegirse solamente porque tiene más watts: hay que comprobar si la carga, la autonomía, el tamaño y el uso son adecuados.",
    faqs: [["¿Por qué la potencia dice «a confirmar»?", "Porque la ficha que nos pasó el proveedor y la que publica el importador no coinciden. Hasta que llegue la documentación del fabricante preferimos no darte una cifra que después cambie. Consultanos y te pasamos lo que esté verificado."], ["¿Cuánto peso aguanta?", "La carga máxima publicada es de 138 kg, menor que los 150 kg de los otros tres modelos. Si el peso total es tu prioridad, conviene revisarlo con nosotros antes."], ["¿Sirve para subidas fuertes?", "Está pensada para eso, pero la pendiente que puede con carga depende del peso total y del estado del camino. Lo mejor es probarla en condiciones parecidas a las tuyas."], ["¿Conviene esperar a que se confirme la ficha?", "Depende de tu apuro. Podés probarla igual y decidir después: el test ride es sin cargo y no te compromete a nada."]], name: "SW S20 Pro", ord: 4,
    cat: "potencia",
    tagline: "Pendientes y carga",
    lead: "La SW S20 Pro es el modelo para considerar cuando la prioridad es la potencia y el recorrido incluye pendientes o carga. Antes de elegir, revisá su límite de carga, autonomía, terreno y condiciones de uso. La potencia exacta de esta unidad la estamos confirmando con el fabricante.",
    price: 2590000, old: null, badge: null,
    /* Ficha en revision: el dato del proveedor no coincide con el que
       comunica el importador. Hasta que llegue la documentacion, la
       potencia no se publica como cifra firme. */
    revision: "Estamos confirmando la ficha técnica de este modelo con el fabricante. Consultanos antes de decidir y te pasamos los datos verificados.",
    motor: "A confirmar", bat: "48V / 16,2Ah", aut: "hasta 75 km", vel: "32 km/h",
    autNum: 75, carga: "138 kg", recarga: "5 a 6 horas", peso: "45 kg aprox.",
    img: "s20-blanca", gal: ["s20-blanca", "v8-bordo", "v20-lateral", "v8-negra"],
    uso: "Subidas exigentes y carga", rec: "Pendientes y carga",
    datos: "Potencia a confirmar · hasta 75 km · 32 km/h",
    limites: "La ficha pública informa una carga máxima de 138 kg, menor que la de los otros tres modelos del catálogo. Revisá el peso total, la carga, el tipo de camino, la autonomía necesaria y el lugar de guardado. Y tené en cuenta que la ficha técnica está en confirmación con el fabricante: consultanos antes de decidir. Para menores, las reglas de uso deben definirse con los adultos responsables.",
    destacado: true,
    extras: ["Panel digital", "Arranque por NFC", "Frenos a disco", "Suspensión reforzada", "Llantas fat Kenda"],
  },
];
const byslug = (s) => P.find((x) => x.slug === s);

/* ---------- HEAD ---------- */
function head({ title, desc, slug, ld = "", preload = "" }) {
  const url = slug === "index" ? `${SITE}/` : `${SITE}/${slug}`;
  return `<!DOCTYPE html>
<html lang="es-AR" data-wa="${WA}" data-mail="${MAIL}">
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
<link rel="stylesheet" href="assets/css/styles.css?v=${V}">${GA4 ? `
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA4}')</script>` : ""}${GTM ? `
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${GTM}')</script>` : ""}
${ld ? `<script type="application/ld+json">\n${ld}\n</script>` : ""}
</head>`;
}

/* ---------- HEADER ---------- */
function header(active, modelo) {
  const on = (k) => (active === k ? ' class="on"' : "");
  const links = [["index", "Inicio", "/"], ["productos", "Modelos", "/productos"],
  ["servicio", "Service", "/servicio"], ["nosotros", "Nosotros", "/nosotros"],
  ["faq", "Preguntas", "/faq"], ["guias", "Guías", "/guias"],
  ["contacto", "Contacto", "/contacto"]];
  return `<body data-pagina="${active || "otra"}"${modelo ? ` data-modelo="${modelo}"` : ""}>
<header class="hdr">
  <div class="hdr__in">
    <a href="/" class="brand" aria-label="MC Ebikes — Inicio">
      ${LOGO(48)}
    </a>
    <nav class="nav" aria-label="Principal">
      ${links.map(([k, t, h]) => `<a href="${h}"${on(k)}>${t}</a>`).join("\n      ")}
    </nav>
    <div class="hdr__act">
      <a class="btn btn--p btn--sm" href="/test-ride">Reservar test ride</a>
      <button class="burger" aria-label="Abrir menú" aria-expanded="false"><i></i><i></i><i></i></button>
    </div>
  </div>
</header>

<div class="mnav">
  ${links.map(([, t, h]) => `<a href="${h}">${t}</a>`).join("\n  ")}
  <div class="acts">
    <a class="btn btn--p btn--block" href="/test-ride">Reservar test ride</a>
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
        <a href="/" class="brand" style="color:var(--tiza)">${LOGO(54)}</a>
        <p>Independencia real para la nueva generación del campo argentino. Fat e-bikes de 1000W para que actives tu movilidad, con potencia real y autonomía real.</p>
        <div class="soc">
          <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg></a>
          <a href="${WA_TXT("Hola MC Ebikes")}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon}</a>
        </div>
      </div>
      <div>
        <h4>Modelos</h4>
        <ul>${P.map((p) => `<li><a href="/${p.slug}">${p.name}</a></li>`).join("")}
        <li><a href="/productos">Ver todos</a></li></ul>
      </div>
      <div>
        <h4>Info</h4>
        <ul>
          <li><a href="/test-ride">Test ride</a></li>
          <li><a href="/servicio">Service y garantía</a></li>
          <li><a href="/nosotros">Nosotros</a></li>
          <li><a href="/faq">Preguntas frecuentes</a></li>
          <li><a href="/guias">Guías y respuestas</a></li>
          <li><a href="/contacto">Contacto</a></li>
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
      <nav class="ftr__legal" aria-label="Políticas">
        <a href="/privacidad">Privacidad</a>
        <a href="/terminos">Términos</a>
        <a href="/envios">Envíos y devoluciones</a>
      </nav>
      <span>Precios y disponibilidad sujetos a cambio sin previo aviso.</span>
    </div>
  </div>
</footer>
<a class="fab" href="${WA_TXT("Hola MC Ebikes, quiero hacer una consulta.")}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon}</a>
<div class="prog" aria-hidden="true"></div>
<script type="application/json" id="modelos">${JSON.stringify(P.map((p) => ({
  slug: p.slug, name: p.name, aut: p.autNum, rec: p.rec, motor: p.motor,
  revision: !!p.revision,
})))}</script>
<script src="assets/js/app.js?v=${V}" defer></script>
</body>
</html>`;
}

const page = ({ slug, title, desc, active, ld, preload, main, modelo }) =>
  head({ title, desc, slug, ld, preload }) + header(active, modelo) + main + footer();

/* ---------- Bloques ---------- */
const pcard = (p) => `
<article class="pc rv" data-cat="${p.cat}" data-price="${p.price}" data-aut="${p.autNum}" data-ord="${p.ord}">
  <a href="/${p.slug}" class="pc__im">
    ${p.badge ? `<span class="tag tag--a">${p.badge}</span>` : ""}
    <img src="assets/img/${p.img}-sm.webp" alt="${p.name}" loading="lazy" width="640" height="480">
  </a>
  <div class="pc__b">
    <span class="pc__cat">FAT E-BIKE</span>
    <h3><a href="/${p.slug}">${p.name}</a></h3>
    <div class="pc__sp">
      <div>POTENCIA<b>${p.motor}</b></div>
      <div>AUTONOMÍA<b>${p.autNum} km</b></div>
      <div>VEL. MÁX<b>32 km/h</b></div>
    </div>
    <div class="pc__pr">
      ${p.revision ? `<div class="revision revision--sm">Ficha técnica en confirmación</div>` : ""}
      <div class="price">${money(p.price)}</div>
      <div class="cuotas">12 cuotas sin interés de ${money(Math.round(p.price / 12))}</div>
      <div class="stock"><i></i>Disponible para probar</div>
      <div class="pc__act">
        <a class="btn btn--p" href="/${p.slug}">Ver ficha</a>
        <a class="btn btn--g" href="/test-ride?m=${p.slug}">Probarla</a>
      </div>
    </div>
  </div>
</article>`;

const ctaBlock = (t = "Vení, probala y decidí con información", s = "Te esperamos en Castelar para que la manejes vos mismo y hagas todas las preguntas antes de resolver nada.") => `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="cta rv">
      <div>
        <h2 class="h2">${t}</h2>
        <p>${s}</p>
      </div>
      <div class="acts">
        <a class="btn btn--l btn--lg" href="/test-ride">Reservar test ride</a>
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
  ["¿Qué necesito para manejarla?", "Depende de cómo se clasifique la unidad y de dónde circules. Las bicicletas con pedaleo asistido tienen un tratamiento distinto al de otros vehículos eléctricos, y cada provincia y municipio puede sumar sus propias reglas. Antes de entregarte la tuya te decimos en qué categoría entra el modelo que elegiste y qué te pide tu jurisdicción, con la documentación del fabricante a la vista. Lo que sí recomendamos siempre: casco, luces y circular por la derecha."],
  ["¿Cuánto dura la batería?", "Una carga te rinde entre 50 y 110 km según el modelo, tu peso, el viento y cuánto uses el acelerador. La batería de litio soporta entre 800 y 1000 ciclos de carga completos: entre 3 y 5 años de uso diario con toda su capacidad."],
  ["¿Cuánto sale cargarla?", "Muy poco: una carga completa consume alrededor de 0,8 kWh, unos $180 según la tarifa actual. Recorrer 60 km te sale menos que un viaje corto en remis."],
  ["¿Qué garantía tiene?", "12 meses de garantía en cuadro y motor, y 6 meses en batería, el estándar del mercado. Con factura y sin letra chica: el service lo hacemos nosotros, acá en Castelar."],
  ["¿Se puede usar bajo la lluvia?", "Sí: tiene protección contra salpicaduras y podés andar con lluvia normal. Para que te dure más, evitá sumergirla, lavarla con hidrolavadora o dejarla a la intemperie todo el tiempo."],
  ["¿Consigo repuestos?", "Sí. Tenemos stock de los repuestos de mayor rotación (cámaras, cubiertas, pastillas, luces, cargadores) y pedimos el resto a nuestro proveedor. Es una de las razones para comprarla acá y no por internet."],
  ["¿Cuánto tiempo tarda en cargarse la batería?", "Entre 4 y 6 horas para una carga completa, según el modelo. Podés revisar el detalle exacto de tu modelo en el comparador."],
  ["¿Puedo pagarla en cuotas?", "Sí, hasta 12 cuotas sin interés con tarjeta de crédito. También podés pagar por transferencia o efectivo, con descuento."],
  ["¿Hacen envíos?", "Sí: entregamos sin cargo en zona oeste y coordinamos envío a todo el país, incluido el interior productivo. De todas formas, si podés acercarte a probarla, siempre es mejor: vas a comprar con mucha más seguridad."],
];

/* Las preguntas que se ven en la home. Viven aca y no adentro del
   template para que el bloque visible y el FAQPage salgan del mismo
   array: si alguien edita una respuesta, el dato estructurado la sigue. */
const FAQ_HOME = [
    ["¿Qué modelo conviene para ir y volver del pueblo?", "La SW V20 Pro es el primer modelo a evaluar para recorridos cortos y cotidianos. La elección final depende de la distancia, el terreno, el peso, la carga y la autonomía que se necesite."],
    ["¿Qué modelo tiene más autonomía publicada?", "La SW V29 Pro aparece con hasta 110 km y doble batería. El resultado real depende de las condiciones de uso; no debe interpretarse como una distancia garantizada para todos los recorridos."],
    ["¿Puedo probarla antes de comprar?", "Sí. Ofrecemos test ride sin cargo en Castelar, sujeto a disponibilidad. Si quien va a manejar es menor de edad, la prueba se coordina con la madre, el padre o quien sea responsable."],
    ["¿Dónde se hace el service?", "El service lo hacemos nosotros, en Castelar, con taller propio y stock de los repuestos de mayor rotación. Escribinos y te decimos el proceso y los plazos para tu caso."],
];

/* Idem, las tres propias de la pagina de service. Las otras cuatro que
   muestra esa pagina salen de FAQS. */
const FAQ_SERVICE = [
    ["¿Qué repuestos se consiguen?", "Tenemos stock de los de mayor rotación: cubiertas, cámaras, pastillas, luces y cargadores. Lo que no está lo pedimos al proveedor. Antes de darte una fecha te confirmamos el stock real de la pieza que necesitás."],
    ["¿Se puede usar bajo la lluvia?", "Tiene protección contra salpicaduras y podés andar con lluvia normal. Lo que hay que evitar es sumergirla, lavarla con hidrolavadora o dejarla permanentemente a la intemperie."],
    ["¿Qué hago si necesito un diagnóstico?", "Escribinos con el modelo, la localidad, el problema, cuándo empezó y si la bicicleta tuvo golpes, agua, cambios de batería o modificaciones. Con eso ya te podemos orientar antes de que la traigas."],
];

/* Un FAQPage a partir de cualquiera de esas listas. */
const faqLDde = (pares) => ({
  "@type": "FAQPage",
  mainEntity: pares.map(([q, a]) => ({
    "@type": "Question", name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

/* =====================================================================
   HOME
   ===================================================================== */
/* =====================================================================
   DATOS ESTRUCTURADOS — segun el paquete SEO/GEO/AEO de Mariana.
   Se generan desde las constantes de arriba en vez de pegar literales,
   para que no queden placeholders "COMPLETAR" publicados y para que
   cambien solos cuando lleguen el WhatsApp y la direccion reales.
   ===================================================================== */
const negocioLD = {
  "@type": "SportingGoodsStore", "@id": SITE + "/#negocio", name: "MC Ebikes",
  alternateName: "MC Ebikes Castelar",
  description: "Fat e-bikes de 1000W con hasta 110 km de autonomía. Venta, test ride sin cargo, garantía real y service con taller propio en Castelar, Buenos Aires.",
  url: SITE + "/", image: SITE + "/assets/img/og.jpg",
  telephone: "+" + WA, email: MAIL, priceRange: "$$",
  address: { "@type": "PostalAddress", addressLocality: "Castelar", addressRegion: "Buenos Aires", addressCountry: "AR" },
  geo: { "@type": "GeoCoordinates", latitude: -34.6547, longitude: -58.6469 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "10:00", closes: "14:00" },
  ],
  areaServed: [...["Castelar", "Morón", "Ituzaingó", "Haedo", "Ramos Mejía"].map((c) => ({ "@type": "City", name: c })),
    { "@type": "Country", name: "Argentina" }],
};

/* Breadcrumbs de las paginas internas */
const crumbLD = (name, slug) => JSON.stringify({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name, item: `${SITE}/${slug}` },
  ],
});

/* Un Product por modelo, con la ficha tecnica y la oferta */
const productoLD = (p) => ({
  "@type": "Product", "@id": `${SITE}/${p.slug}#producto`,
  name: `MC Ebikes ${p.name}`, brand: { "@type": "Brand", name: "MC Ebikes" },
  description: p.revision
    ? `${p.tagline}. Fat e-bike con autonomía de ${p.aut} y velocidad máxima de ${p.vel}. Ficha de potencia en confirmación con el fabricante.`
    : `${p.tagline}. Fat e-bike de ${p.motor} con autonomía de ${p.aut} y velocidad máxima de ${p.vel}.`,
  image: `${SITE}/assets/img/${p.img}.webp`,
  sku: "MC-" + p.slug.toUpperCase().replace(/-/g, ""),
  additionalProperty: [
    /* Una propiedad sin dato confirmado no se declara: el marcado tiene que
       describir lo que la pagina puede sostener. */
    ...(p.revision ? [] : [{ "@type": "PropertyValue", name: "Potencia del motor", value: p.motor }]),
    { "@type": "PropertyValue", name: "Batería", value: p.bat },
    { "@type": "PropertyValue", name: "Autonomía", value: p.aut },
    { "@type": "PropertyValue", name: "Velocidad máxima", value: p.vel },
    { "@type": "PropertyValue", name: "Carga máxima soportada", value: p.carga },
    { "@type": "PropertyValue", name: "Tiempo de recarga", value: p.recarga },
  ],
  offers: {
    "@type": "Offer", url: `${SITE}/${p.slug}`, priceCurrency: "ARS",
    price: String(p.price), availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": SITE + "/#negocio" },
  },
});

const destacados = P.filter((p) => p.destacado);
const homeLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [negocioLD, { "@type": "WebSite", name: "MC Ebikes", url: SITE + "/", inLanguage: "es-AR" },
    faqLDde(FAQ_HOME)],
}, null, 1);

/* Ficha de modelo fotografica. El dato comercial va encima de la foto, que es
   lo que el visitante necesita para decidir. */
const mtile = (p) => `
    <a class="m rv" href="/${p.slug}">
      <img src="assets/img/${p.img}-sm.webp" alt="MC Ebikes ${p.name}" loading="lazy" width="640" height="480">
      ${p.badge ? `<span class="tag tag--a">${p.badge}</span>` : ""}
      <span class="flecha">${ico(I.arrow, 2.2)}</span>
      <div class="t">
        <span class="uso">${p.rec}</span>
        <h3>${p.name}</h3>
        <div class="sp">${p.datos}</div>
        <div class="pr">${money(p.price)}</div>
        <div class="cuo">12 cuotas sin interés de ${money(Math.round(p.price / 12))}</div>
        <div class="stock"><i></i>Disponible para probar</div>
      </div>
    </a>`;

/* Capitulo numerado: la lectura de la home avanza como un reportaje. */
const cap = (n) => `<i>${n} / 08</i>&nbsp;&nbsp;·&nbsp;&nbsp;`;

const home = `
<section class="hero">
  <div class="hero__bg"><img src="assets/escenas/llegada.webp"
    srcset="assets/escenas/llegada-sm.webp 900w, assets/escenas/llegada-md.webp 1200w, assets/escenas/llegada.webp 1448w" sizes="100vw"
    alt="Familia probando una fat e-bike MC Ebikes en un camino entre el campo y el pueblo" fetchpriority="high" width="1448" height="1086"></div>
  <span class="vert">Tu mundo se mueve con vos</span>
  <div class="wrap">
    <span class="kick">Para el campo argentino</span>
    <h1 class="h1" style="margin-top:16px">Tu mundo se mueve con vos</h1>
    <p class="hero__sub"><b>Fat e-bikes para ir, volver y seguir recorriendo.</b><br>
    Tu casa, el pueblo, la escuela, el club, la chacra o el casco. MC Ebikes te acompaña con
    potencia, autonomía y respaldo local para que elijas con tu familia la bicicleta que
    realmente tiene sentido para tu territorio.</p>
    <div class="hero__cta">
      <a class="btn btn--p btn--lg" href="/productos">Comparar modelos ${ico(I.arrow, 2.2)}</a>
      <a class="btn btn--g btn--lg" href="/test-ride">Reservar test ride en Castelar</a>
    </div>
  </div>
  <span class="bajar"><i></i>Seguí bajando</span>
</section>

<div class="tira" aria-hidden="true"><div>${Array.from({ length: 8 }, () => `<span>${TAGLINE}</span><span>·</span>`).join("")}</div></div>

<section class="franja"><div class="wrap">
  <div><b data-num>1000W</b><span>De potencia, según modelo</span></div>
  <div><b data-num>110 km</b><span>Hasta, de autonomía publicada</span></div>
  <div><b data-num>32 km/h</b><span>De velocidad máxima publicada</span></div>
  <div><b data-num>12</b><span>Cuotas sin interés</span></div>
</div></section>

<section class="sec cap">
  <div class="wrap">
    <div class="rv">
      <span class="kick">${cap("01")}Para las familias</span>
      <h2 class="h2">Una decisión importante se prueba, no se adivina</h2>
      <p>La bicicleta la puede usar tu hijo o hija, pero la decisión se toma en familia. Antes de
      comprar, revisen juntos la distancia habitual, el tipo de camino, el peso que debe soportar,
      dónde se va a cargar, cómo se va a guardar y quién se va a ocupar del mantenimiento.</p>
      <p>Vení a probarla, compará los modelos y consultá todo lo que necesites antes de decidir.</p>
      <a class="btn btn--g" href="/test-ride">Ver cómo funciona el test ride ${ico(I.arrow, 2.2)}</a>
    </div>
    <figure class="marco rv">
      <img src="assets/escenas/eligiendo.webp" alt="Un padre y su hijo de pie junto a dos fat e-bikes frente a una casa de campo al atardecer" loading="lazy" width="1200" height="900">
      <figcaption>La decisión se toma entre los dos</figcaption>
    </figure>
  </div>
</section>

<section class="sec" style="padding-top:0;padding-bottom:clamp(18px,2.4vw,30px)">
  <div class="wrap">
    <span class="kick rv" style="display:inline-flex;margin-bottom:clamp(22px,3vw,34px)">${cap("02")}Por qué una MC</span>
    <div class="razones">
      <article class="rv"><i>01</i><h3>Potencia para el territorio real</h3><p>La potencia no se elige solamente por el número. También importa el terreno, la pendiente, el viento, la carga, el tamaño de quien la usa y la distancia diaria. Te ayudamos a comparar el modelo con el recorrido real.</p></article>
      <article class="rv d1"><i>02</i><h3>Autonomía para organizar el día</h3><p>La autonomía cambia según el modelo, el peso, el terreno, el viento, la presión de las cubiertas, la temperatura, la asistencia, el acelerador y la carga. Por eso no te mostramos solamente un número: te ayudamos a entender qué margen necesitás.</p></article>
      <article class="rv d2"><i>03</i><h3>Prueba para decidir en familia</h3><p>El adolescente puede probar cómo se siente la bicicleta. Los padres pueden preguntar por autonomía, carga, guardado, mantenimiento, garantía, service y condiciones de uso. La compra se decide con toda la información.</p></article>
      <article class="rv d3"><i>04</i><h3>Service con alguien visible</h3><p>Si la bicicleta necesita un ajuste, un repuesto o un diagnóstico, tenés un lugar donde consultar. El service lo hacemos nosotros, en Castelar, y sabés a quién recurrir.</p></article>
    </div>
  </div>
</section>

<section class="sec sec--claro">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kick">${cap("03")}Selección por recorrido</span>
      <h2 class="h2">¿Cómo se va a mover tu familia?</h2>
      <p>Elegí el recorrido principal y después compará el modelo recomendado con sus límites y condiciones.</p>
    </div>
    <div class="quiz rv">
      <button data-rec="SW V20 Pro" data-why="Para recorridos cotidianos y distancias cortas, la V20 Pro es el primer modelo a evaluar: 1000W y de 50 a 65 km de autonomía publicada. La elección final depende de la distancia, el terreno, el peso y la carga que necesites." data-url="/v20-pro">
        ${ico(I.city)}<b>Entre casa, pueblo y casco</b><span>Para recorridos cotidianos y distancias cortas</span>
      </button>
      <button data-rec="SW V29 Pro" data-why="Para quienes necesitan más autonomía por salida, la V29 Pro suma doble batería y hasta 110 km publicados. El resultado real depende de las condiciones de uso: no es una distancia garantizada para todos los recorridos." data-url="/v29-pro">
        ${ico(I.box)}<b>Campo y pueblo durante el día</b><span>Para quienes necesitan más autonomía por salida</span>
      </button>
      <button data-rec="SW V40" data-why="Para combinar caminos del pueblo y recorridos rurales, la V40 tiene batería de 18,2Ah y señalización LED completa. En tierra, barro o arena la autonomía real baja: conviene probarla en tu terreno antes de decidir." data-url="/v40">
        ${ico(I.bike)}<b>Uso mixto</b><span>Para combinar caminos del pueblo y recorridos rurales</span>
      </button>
      <button data-rec="SW S20 Pro" data-why="Para priorizar potencia dentro de los límites aprobados. La ficha técnica de este modelo está en confirmación con el fabricante y la carga máxima publicada es menor que la de los otros tres, así que conviene consultarnos y probarla antes de decidir." data-url="/s20-pro">
        ${ico(I.bolt)}<b>Pendientes y carga</b><span>Para priorizar potencia dentro de los límites aprobados</span>
      </button>
      <button data-rec="Te ayudamos a comparar" data-why="No hace falta que sepas el modelo. Te hacemos preguntas sobre cuántos kilómetros hacés, por qué camino, cuánto peso llevás y dónde la vas a cargar, y comparamos con vos cuál tiene sentido y cuál no. Lo mejor es venir a Castelar y probarla." data-url="/test-ride">
        ${ico(I.user)}<b>No sé cuál elegir</b><span>Te hacemos preguntas y te ayudamos a comparar</span>
      </button>
    </div>
    <div class="quiz-res"></div>
  </div>
</section>

<section class="sec mods">
  <div class="wrap">
    <span class="kick rv">${cap("04")}Los cuatro modelos</span>
    <h2 class="h2 rv">Cuatro modelos.<br>Un modelo para cada recorrido.</h2>
    <p class="rv" style="margin-top:16px;max-width:62ch">Misma base robusta en toda la línea: cubiertas fat, frenos a disco y arranque por NFC. Elegí según el recorrido que hacés, no según el número más alto.</p>
    <div class="g">
${P.map(mtile).join("\n")}
    </div>
    <div style="margin-top:26px" class="rv"><a class="btn btn--g" href="/productos">Comparar los ${P.length} modelos ${ico(I.arrow, 2.2)}</a></div>
  </div>
</section>

<section class="sec sec--rural terr">
  <div class="wrap">
    <div>
      <span class="kick rv">${cap("05")}Territorio</span>
      <h2 class="h2">El campo<br>no es un paisaje.<br>Es tu recorrido.</h2>
      <p>De la casa al galpón, del galpón al pueblo y del pueblo a casa. Tantas veces por día como haga falta. Por eso no vendemos la más potente: vendemos la que llega y vuelve.</p>
      <div class="mini rv">
        <img src="assets/escenas/cubierta.webp" alt="Detalle de la cubierta fat con polvo del camino" loading="lazy" width="900" height="675">
        <img src="assets/escenas/portaequipaje.webp" alt="Portaequipaje trasero con un bolso de lona atado" loading="lazy" width="900" height="675">
      </div>
    </div>
    <figure class="marco rv">
      <img src="assets/escenas/galpon-tarde.webp" alt="Fat e-bike MC apoyada contra un galpón al atardecer, con la campera y el mate al lado" loading="lazy" width="1200" height="900">
      <figcaption>Donde termina el día</figcaption>
    </figure>
  </div>
</section>

<section class="sec sec--rural" style="padding-top:0">
  <div class="wrap">
    <div class="split">
      <div class="rv">
        <span class="kick">${cap("06")}Ahorro y calculadora</span>
        <h2 class="h2" style="margin:14px 0 14px">Calculá tu recorrido</h2>
        <p style="margin-bottom:20px">Poné cuántos kilómetros necesitás recorrer por día y te mostramos una estimación para conversar. El resultado depende del precio de la energía, el vehículo de comparación, los días de uso, el mantenimiento y las condiciones reales.</p>
        <div class="calc" id="calc">
          <div class="calc__in">
            <div class="field">
              <label for="km">Kilómetros aproximados por día</label>
              <input type="number" id="km" value="14" min="0" max="200" inputmode="numeric">
            </div>
            <div class="field">
              <label for="terreno">Por dónde andás la mayor parte</label>
              <select id="terreno">
                <option value="1">Asfalto y calle de pueblo</option>
                <option value="0.85" selected>Tierra y ripio</option>
                <option value="0.72">Barro, arena o pasto</option>
                <option value="0.75">Con pendientes seguido</option>
              </select>
            </div>
            <div class="field">
              <label for="carga">Cuánto peso llevás encima</label>
              <select id="carga">
                <option value="1" selected>Solo yo</option>
                <option value="0.92">Con mochila o herramienta</option>
                <option value="0.8">Con carga pesada</option>
              </select>
            </div>
          </div>
          <div class="calc__rec" id="calc-rec"></div>
          <div class="calc__out">
            <div><b id="o-ahorro">$0</b><span>Estimación por mes</span></div>
            <div><b id="o-cargas">0</b><span>Cargas por mes</span></div>
            <div><b id="o-anual">$0</b><span>Estimación por año</span></div>
          </div>
        </div>
        <p style="font-size:13px;margin-top:12px;color:rgba(245,243,239,.62)"><b>Esta calculadora es orientativa.</b> No representa una promesa de ahorro, ganancia ni recuperación de la inversión. La autonomía que ves es una estimación sobre la cifra publicada por el proveedor, ajustada por terreno y carga, con un margen del 30 % para que no vuelvas justo. El ahorro compara 22 días hábiles contra el costo de combustible de un vehículo de referencia, a valores de septiembre de 2026.</p>
      </div>
      <figure class="marco rv d1">
        <img src="assets/escenas/freno.webp" alt="Detalle del freno a disco delantero, con polvo del camino" loading="lazy" width="900" height="675">
        <figcaption>Lo que se revisa antes de salir</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="sec cap cap--inv">
  <div class="wrap">
    <div class="rv">
      <span class="kick">${cap("07")}Test ride</span>
      <h2 class="h2">Sentí la diferencia antes de decidir</h2>
      <p>Vení a Castelar, subite y manejá el modelo que estás mirando. Si la va a usar un adolescente, vengan juntos: quien la usa puede conocerla y los padres pueden hacer preguntas sobre recorrido, batería, mantenimiento, garantía y service.</p>
      <a class="btn btn--p btn--lg" href="/test-ride">Reservar test ride en familia ${ico(I.arrow, 2.2)}</a>
    </div>
    <figure class="marco rv">
      <img src="assets/escenas/calle-pueblo.webp" alt="Adolescente con casco andando una fat e-bike por una calle arbolada de pueblo" loading="lazy" width="1200" height="900">
      <figcaption>Entre casa y pueblo, todos los días</figcaption>
    </figure>
  </div>
</section>

<section class="sec sec--claro" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kick">${cap("08")}Preguntas rápidas</span>
      <h2 class="h2">Lo que se pregunta<br>antes de decidir</h2>
    </div>
    <div class="faq rv">
      ${FAQ_HOME.map(([q, a]) => faqItem(q, a)).join("")}
    </div>
    <div style="margin-top:24px" class="rv"><a class="btn btn--g" href="/faq">Ver todas las preguntas frecuentes</a></div>
  </div>
</section>

<section class="fin">
  <div class="wrap">
    <span class="kick rv">Castelar, Buenos Aires · Envíos a todo el país</span>
    <h2 class="h2 rv">Elegí con información.<br>Movete con respaldo.</h2>
    <p class="rv" style="margin:18px auto 0;max-width:56ch">Tu mundo se mueve con vos cuando la bicicleta acompaña el recorrido real. Compará modelos, consultá todo y probala antes de decidir.</p>
    <div class="acts rv">
      <a class="btn btn--p btn--lg" href="/productos">Comparar modelos ${ico(I.arrow, 2.2)}</a>
      <a class="btn btn--g btn--lg" href="${WA_TXT("Hola MC Ebikes, quiero hacer una consulta.")}" target="_blank" rel="noopener">Hablar con MC Ebikes</a>
    </div>
  </div>
</section>`;

writeFileSync(new URL("./index.html", import.meta.url), page({
  slug: "index", active: "index",
  title: "MC Ebikes | Fat e-bikes para familias del campo argentino",
  desc: "Fat e-bikes para moverse entre el campo y el pueblo. Compará modelos, consultá autonomía y service, y probalos sin cargo en Castelar.",
  ld: homeLD,
  /* El preload declara el mismo srcset que el <img>: sin imagesrcset el
     navegador se baja tambien la version de 1600 px en un telefono. */
  preload: `\n<link rel="preload" as="image" href="assets/escenas/llegada.webp" imagesrcset="assets/escenas/llegada-sm.webp 900w, assets/escenas/llegada-md.webp 1200w, assets/escenas/llegada.webp 1448w" imagesizes="100vw" fetchpriority="high">`,
  main: home,
}));
console.log("✓ index.html");

/* =====================================================================
   CATÁLOGO
   ===================================================================== */
const catalogo = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a> / <span aria-current="page">Modelos</span></nav>
    <span class="kick">${P.length} modelos disponibles</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,68px);margin-top:14px">Elegí tu <em>territorio</em></h1>
    <p>Cuatro fat e-bikes para distintos recorridos del campo, el pueblo y la vida cotidiana.
    Compará potencia, autonomía, carga, tiempo de recarga y precio. Si no sabés cuál tiene más
    sentido, contanos cómo se va a usar y te ayudamos a elegir.</p>
    <p class="aviso-familias"><b>Importante para familias:</b> el modelo correcto no es
    necesariamente el más potente ni el que anuncia más kilómetros. Depende de la distancia
    diaria, el terreno, la carga, el lugar donde se va a guardar, la posibilidad de recargar y
    la disponibilidad de service.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="filters">
      <span class="filters__lbl">Filtrar</span>
      <button class="chip on" data-f="todos">Todos los modelos</button>
      <button class="chip" data-f="urbana">Pueblo y recorridos cortos</button>
      <button class="chip" data-f="larga-distancia">Campo y largas jornadas</button>
      <button class="chip" data-f="potencia">Pendientes y carga</button>
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

    <div class="orienta rv">
      <div>
        <h2 class="h3">¿No sabés cuál elegir?</h2>
        <p>Decinos quién la va a usar, cuántos kilómetros recorre por día, qué caminos hace y si
        necesita llevar carga. Te orientamos y, si estás cerca, podés probarla en Castelar.</p>
      </div>
      <a class="btn btn--p" href="${WA_TXT("Hola MC Ebikes, quiero contarles cómo la voy a usar para que me orienten.")}" target="_blank" rel="noopener">Contarnos cómo la vas a usar</a>
    </div>
  </div>
</section>

<section class="sec sec--claro" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv"><span class="kick">Comparación rápida</span>
      <h2 class="h2">Todas, lado a lado</h2>
      <p>Los valores son los que publica el proveedor. La autonomía se mide en condiciones
      favorables y baja con el terreno, el peso y la pendiente.</p></div>
    <div class="cmp rv">
      <table>
        <thead><tr><th>Modelo</th>${P.map((p) => `<th>${p.name}</th>`).join("")}</tr></thead>
        <tbody>
          <tr><td>Motor publicado</td>${P.map((p) => `<td>${p.motor}</td>`).join("")}</tr>
          <tr><td>Batería publicada</td>${P.map((p) => `<td>${p.bat}</td>`).join("")}</tr>
          <tr><td>Autonomía publicada</td>${P.map((p) => `<td class="${p.autNum === 110 ? "hl" : ""}">${p.aut}</td>`).join("")}</tr>
          <tr><td>Velocidad máxima publicada</td>${P.map((p) => `<td>${p.vel}</td>`).join("")}</tr>
          <tr><td>Carga máxima publicada</td>${P.map((p) => `<td>${p.carga}</td>`).join("")}</tr>
          <tr><td>Recarga publicada</td>${P.map((p) => `<td>${p.recarga}</td>`).join("")}</tr>
          <tr><td>Uso orientativo</td>${P.map((p) => `<td style="font-family:var(--t);font-weight:400;font-size:14px;color:var(--cemento)">${p.uso}</td>`).join("")}</tr>
          <tr><td>Precio</td>${P.map((p) => `<td class="hl">${money(p.price)}</td>`).join("")}</tr>
          <tr><td></td>${P.map((p) => `<td><a class="btn btn--p btn--sm" href="/${p.slug}">Ver</a></td>`).join("")}</tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="fin">
  <div class="wrap">
    <span class="kick rv">Antes de decidir</span>
    <h2 class="h2 rv">No elijas solo<br>por el número más alto</h2>
    <p class="rv" style="margin:18px auto 0;max-width:60ch">La distancia diaria, el terreno, la
    carga, la recarga, el guardado y el service importan tanto como la potencia o la autonomía.
    Compará con tu familia y probá el modelo que estés considerando.</p>
    <div class="acts rv">
      <a class="btn btn--p btn--lg" href="/guias-como-elegir">Comparar los modelos en detalle ${ico(I.arrow, 2.2)}</a>
      <a class="btn btn--g btn--lg" href="/test-ride">Reservar test ride en familia</a>
    </div>
  </div>
</section>`;

const catalogoLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    JSON.parse(crumbLD("Modelos", "productos")),
    { "@type": "ItemList", itemListElement: P.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": `${SITE}/${p.slug}#producto` } })) },
    ...P.map(productoLD),
  ],
}, null, 1);

writeFileSync(new URL("./productos.html", import.meta.url), page({
  slug: "productos", active: "productos", ld: catalogoLD,
  title: "Modelos de fat e-bikes 1000W en Argentina | MC Ebikes",
  desc: "Compará cuatro fat e-bikes para campo y pueblo por autonomía, potencia, carga, tiempo de recarga, precio y uso recomendado.",
  main: catalogo,
}));
console.log("✓ productos.html");

/* =====================================================================
   FICHAS DE PRODUCTO
   ===================================================================== */
for (const p of P) {
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [JSON.parse(crumbLD(p.name, p.slug)), productoLD(p), faqLDde(p.faqs)],
  }, null, 1);

  const otros = P.filter((x) => x.slug !== p.slug).slice(0, 3);
  const main = `
<section class="sec" style="padding-top:calc(var(--nav-h) + 32px)">
  <div class="wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a> / <a href="/productos">Modelos</a> / <span aria-current="page">${p.name}</span></nav>
    <div class="pd">
      <div>
        <div class="gal__main"><img src="assets/img/${p.gal[0]}.webp" alt="${p.name}" fetchpriority="high" width="1200" height="900"></div>
        <div class="gal__thumbs">
          ${p.gal.map((g, i) => `<button class="${i === 0 ? "on" : ""}" data-full="assets/img/${g}.webp" aria-label="Ver imagen ${i + 1}"><img src="assets/img/${g}-sm.webp" alt="${p.name} vista ${i + 1}" loading="lazy" width="200" height="200"></button>`).join("\n          ")}
        </div>
      </div>

      <div>
        <span class="pd__cat">${p.etiqueta}</span>
        <h1>${p.name}</h1>
        <p class="pd__sub">${p.subtitulo}</p>
        <p class="pd__lead">${p.lead}</p>
${p.revision ? `
        <p class="revision">${ico(I.shield)}<span>${p.revision}</span></p>` : ""}

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

        <p class="politicas">
          Antes de decidir:
          <a href="/servicio">garantía y service</a> ·
          <a href="/envios">envíos y devoluciones</a> ·
          <a href="/guias-como-elegir">cómo elegir según tu recorrido</a>
        </p>

        <div class="pd__acts">
          <a class="btn btn--p btn--lg btn--block" href="/test-ride?m=${p.slug}">Reservar test ride sin cargo</a>
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
        <p class="cond">
          ${ico(I.shield)}
          <span><b>Cómo leer la autonomía.</b> Los ${p.aut} los publica el proveedor y se miden
          en condiciones favorables: asfalto parejo, sin viento, con una persona de peso promedio
          y sin carga extra. En tierra, con peso o en pendiente rinde menos.
          <a href="/guias-como-elegir#terreno">Acá explicamos cuánto menos y por qué</a>, y en
          el <a href="/#calc">recomendador</a> podés hacer la cuenta con tu recorrido.</span>
        </p>
      </div>
      <div class="rv d1">
        <span class="kick">Para quién es</span>
        <h2 class="h2" style="margin:14px 0 16px">¿Para quién es la ${p.name}?</h2>
        <p style="margin-bottom:14px">${p.aeo}</p>
        <p style="margin-bottom:28px">${p.paraQuien}</p>

        <span class="kick">Qué considerar</span>
        <h2 class="h2" style="margin:14px 0 16px">Qué mirar antes de elegirla</h2>
        <p style="margin-bottom:14px">${p.limites}</p>
        <p style="margin-bottom:28px"><a class="btn btn--g btn--sm" href="/productos">Comparar contra los otros ${P.length - 1} modelos</a></p>

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

<section class="sec sec--claro" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv"><span class="kick">Preguntas sobre la ${p.name}</span>
      <h2 class="h2">Lo que se pregunta<br>de este modelo</h2></div>
    <div class="faq rv">${p.faqs.map(([q, a]) => faqItem(q, a)).join("")}</div>
    <div style="margin-top:24px" class="rv">
      <a class="btn btn--g" href="/faq">Ver todas las preguntas frecuentes</a>
      <a class="btn btn--g" href="/guias-como-elegir">Leer cómo elegir una e-bike para el campo</a>
    </div>
  </div>
</section>
${ctaBlock(`¿Te quedaste con la ${p.name}?`, "Vení a Castelar, subite y manejala vos mismo antes de resolver nada. Sin costo y sin compromiso.")}`;

  writeFileSync(new URL(`./${p.slug}.html`, import.meta.url), page({
    slug: p.slug, active: "productos", modelo: p.name,
    title: `${p.name} | ${p.tituloSeo} | MC Ebikes`,
    desc: p.revision
      ? `${p.name}: batería ${p.bat}, ${p.aut} de autonomía y 12 cuotas sin interés. Test ride sin cargo en Castelar.`
      : `${p.name}: motor ${p.motor}, batería ${p.bat}, ${p.aut} de autonomía y 12 cuotas sin interés. Test ride sin cargo en Castelar.`,
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
    <nav class="crumbs"><a href="/">Inicio</a> / <span aria-current="page">Test ride</span></nav>
    <span class="kick">Sin cargo · Sin compromiso</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Subite <em>antes</em><br>de decidir</h1>
    <p>Es una decisión importante para toda la familia. Por eso te invitamos a venir a Castelar, subirte a la MC que más te interesa y manejarla vos mismo antes de resolver nada. Sin costo y sin ningún compromiso. Y si vivís lejos, coordinamos una demo cuando estemos en tu zona o te acompañamos con envío a todo el país.</p>
  </div>
</section>

<section class="sec sec--rural">
  <div class="wrap">
    <div class="split" style="align-items:start">
      <div class="rv">
        <form class="form" id="f-test" novalidate>
          <h2 class="h3" style="margin-bottom:6px">Reservá mi test ride</h2>
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
          </div>

          <fieldset class="form__set">
            <legend>Tu recorrido</legend>
            <p class="form__ayuda">Con esto llegás y ya sabemos qué mostrarte. Si no estás
            seguro de alguna, dejala como está y lo vemos juntos.</p>
            <div class="form__g">
              <div class="field"><label for="t-km">Kilómetros por día, ida y vuelta</label>
                <input id="t-km" name="km" type="number" min="0" max="300" inputmode="numeric" placeholder="Ej: 24"></div>
              <div class="field"><label for="t-loc">Localidad</label>
                <input id="t-loc" name="localidad" placeholder="Para saber si te queda cerca"></div>
              <div class="field"><label for="t-ter">Por dónde andás</label>
                <select id="t-ter" name="terreno" class="sel">
                  <option value="">Elegí una</option>
                  <option>Asfalto y calle de pueblo</option>
                  <option>Tierra y ripio</option>
                  <option>Barro, arena o pasto</option>
                  <option>Con pendientes seguido</option>
                </select></div>
              <div class="field"><label for="t-car">Peso que llevás</label>
                <select id="t-car" name="carga" class="sel">
                  <option value="">Elegí una</option>
                  <option>Solo yo</option>
                  <option>Con mochila o herramienta</option>
                  <option>Con carga pesada</option>
                </select></div>
              <div class="field full"><label for="t-g">Dónde la vas a cargar y guardar</label>
                <select id="t-g" name="guardado" class="sel">
                  <option value="">Elegí una</option>
                  <option>Tengo enchufe donde la guardo</option>
                  <option>Saco la batería y la cargo adentro</option>
                  <option>Todavía no sé, quiero que me orienten</option>
                </select></div>
            </div>
          </fieldset>

          <fieldset class="form__set">
            <legend>Quién va a manejar</legend>
            <p class="form__ayuda">Si el que va a manejar es menor de edad, la prueba la
            coordinamos con la madre, el padre o quien sea responsable. No hace falta que
            venga toda la familia, pero sí que estén al tanto.</p>
            <div class="form__g">
              <div class="field full"><label for="t-q">¿Quién la va a manejar? *</label>
                <select id="t-q" name="conductor" class="sel" required>
                  <option value="">Elegí una</option>
                  <option>La manejo yo, soy mayor de edad</option>
                  <option>La va a manejar un menor y soy el adulto responsable</option>
                  <option>La voy a manejar yo y soy menor de edad</option>
                </select></div>
              <div class="field full" id="t-adulto-wrap" hidden>
                <label for="t-adulto">Nombre del adulto responsable</label>
                <input id="t-adulto" name="adulto" placeholder="Quién nos va a acompañar o autorizar">
              </div>
            </div>
          </fieldset>

          <div class="form__g">
            <div class="field full"><label for="t-c">Algo que quieras aclarar</label><textarea id="t-c" name="mensaje" placeholder="Lo que quieras sumar"></textarea></div>
          </div>
          <button class="btn btn--p btn--lg btn--block" style="margin-top:18px" type="submit">${waIcon} Reservar por WhatsApp</button>
          <div class="ok">Listo, abrimos WhatsApp con tu reserva. Si no se abrió, escribinos directo.</div>
        </form>
      </div>
      <div class="rv d1">
        <span class="kick">Cómo funciona</span>
        <h2 class="h2" style="margin:14px 0 22px">Así de simple</h2>
        <div class="feat" style="grid-template-columns:1fr">
          <article><div class="ic">${ico(I.user)}</div><h3>1 · Elegís el modelo</h3><p>Nos decís qué MC querés probar y por qué la estás mirando.</p></article>
          <article><div class="ic">${ico(I.bike)}</div><h3>2 · Reservás día y horario</h3><p>Coordinamos por WhatsApp el día y la hora que te queden más cómodos.</p></article>
          <article><div class="ic">${ico(I.check)}</div><h3>3 · Venís, te subís y la manejás</h3><p>Te la damos con casco y la probás sin apuro. Recién ahí decidís, con la MC abajo tuyo y con calma.</p></article>
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
  slug: "test-ride", active: "", ld: crumbLD("Test ride", "test-ride"),
  title: "Test ride de fat e-bikes en Castelar | MC Ebikes",
  desc: "Probá tu fat e-bike antes de decidir. Test ride sin cargo y sin compromiso en nuestro local de Castelar. Reservá tu turno en minutos.",
  main: testride,
}));
console.log("✓ test-ride.html");

/* =====================================================================
   SERVICIO / POSTVENTA
   ===================================================================== */
const servicio = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="/">Inicio</a> / <span aria-current="page">Service</span></nav>
    <span class="kick">Postventa</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Te respondemos<br><em>después</em> de venderte</h1>
    <p>La diferencia entre comprarnos a nosotros y comprar por internet no se nota el día que la comprás. Se nota el día que algo necesita ajuste, y ahí es donde estamos.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="feat">
      <article class="rv"><div class="ic">${ico(I.shield)}</div><h3>Garantía real, sin letra chica</h3><p>12 meses de garantía en cuadro y motor, 6 meses en batería. Con factura, siempre.</p></article>
      <article class="rv d1"><div class="ic">${ico(I.wrench)}</div><h3>Taller propio en Castelar</h3><p>El service lo hacemos nosotros. No la mandás a otra provincia ni esperás semanas por una pieza: tenemos el conocimiento técnico y el taller acá mismo.</p></article>
      <article class="rv d2"><div class="ic">${ico(I.box)}</div><h3>Repuestos a mano</h3><p>Tenemos stock de lo que más se usa: cubiertas, cámaras, pastillas, luces y cargadores. Lo que no tenemos, lo pedimos a nuestro proveedor.</p></article>
      <article class="rv d3"><div class="ic">${ico(I.user)}</div><h3>Sabés a quién le comprás</h3><p>Conocés quién te vendió tu MC y dónde encontrarlo. Nada de vendedor anónimo de internet ni de esperar una respuesta que no llega.</p></article>
    </div>
  </div>
</section>

<section class="sec sec--rural" style="padding-top:0">
  <div class="wrap">
    <div class="split">
      <div class="rv">
        <span class="kick">Mantenimiento</span>
        <h2 class="h2" style="margin:14px 0 18px">Una MC bien cuidada dura años</h2>
        <p style="margin-bottom:18px">No hace falta mucho para que tu MC te acompañe temporada tras temporada. Estos son los cuidados que marcan la diferencia:</p>
        <ul class="ticks">
          <li>${ico(I.check, 2)}<span><strong>Cargala antes de que llegue a cero:</strong> la batería de litio rinde más si evitás vaciarla del todo seguido.</span></li>
          <li>${ico(I.check, 2)}<span><strong>Si no la vas a usar por varias semanas,</strong> dejala cargada a la mitad y en un lugar seco.</span></li>
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

<section class="sec sec--claro" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head rv">
      <span class="kick">Mantenimiento básico</span>
      <h2 class="h2">Lo que podés hacer vos,<br>y cuándo traerla</h2>
      <p>Cuatro rutinas que alargan la vida de tu MC y evitan la mayoría de las visitas al taller.</p>
    </div>
    <div class="razones razones--claro">
      <article class="rv"><i>01</i><h3>Antes de usarla</h3><p>Revisá frenos, presión de cubiertas, fijaciones, luces, carga de batería y condiciones del camino. No la uses si hay una falla visible que pueda comprometer el control.</p></article>
      <article class="rv d1"><i>02</i><h3>Si no la vas a usar por varias semanas</h3><p>Dejá la batería aproximadamente a la mitad de carga y guardala en un lugar seco. No la dejes descargada del todo ni al sol.</p></article>
      <article class="rv d2"><i>03</i><h3>Limpieza</h3><p>Limpiala con un trapo húmedo. Evitá la hidrolavadora y la manguera a presión: tiene protección contra salpicaduras, que no es lo mismo que ser sumergible.</p></article>
      <article class="rv d3"><i>04</i><h3>Si baja la autonomía</h3><p>Revisá presión, viento, recorrido, peso, temperatura, asistencia, acelerador y carga. Si el cambio persiste, no desarmes la batería: escribinos con el modelo, la antigüedad y los síntomas.</p></article>
    </div>

    <div class="sec-head rv" style="margin-top:clamp(44px,6vw,72px)">
      <span class="kick">Preguntas de service</span>
      <h2 class="h2">Lo que nos preguntan<br>después de comprar</h2>
    </div>
    <div class="faq rv">
      ${FAQ_SERVICE.map(([q, a]) => faqItem(q, a)).join("")}
    </div>
    <div style="margin-top:24px" class="rv">
      <a class="btn btn--p" href="${WA_TXT("Hola MC Ebikes, quiero consultar por service y repuestos.")}" target="_blank" rel="noopener">Consultar por service y repuestos</a>
      <a class="btn btn--g" href="/productos">Volver a los modelos</a>
    </div>
  </div>
</section>
${ctaBlock("¿Necesitás service o un repuesto?", "Escribinos y te decimos si lo tenemos en stock y cuánto tarda.")}`;
writeFileSync(new URL("./servicio.html", import.meta.url), page({
  slug: "servicio", active: "servicio",
  ld: JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [JSON.parse(crumbLD("Service y garantía", "servicio")),
      faqLDde([FAQS[3], FAQS[5], FAQS[4], FAQS[1], ...FAQ_SERVICE])],
  }, null, 1),
  title: "Service, repuestos y garantía de e-bikes en Castelar | MC Ebikes",
  desc: "12 meses de garantía en cuadro y motor, 6 meses en batería. Taller propio en Castelar, repuestos en stock y service con cara visible.",
  main: servicio,
}));
console.log("✓ servicio.html");

/* =====================================================================
   NOSOTROS
   ===================================================================== */
const nosotros = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="/">Inicio</a> / <span aria-current="page">Nosotros</span></nav>
    <span class="kick">Quiénes somos</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Movilidad eléctrica<br>con <em>cara visible</em></h1>
    <p>Elegimos pocos modelos, los probamos y los bancamos. MC Ebikes nace para darle a cada chico y chica del campo argentino su primer vehículo propio: la autonomía de recorrer todo el terreno por sus propios medios, con la potencia necesaria para el ritmo diario.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="split">
      <div class="rv prose">
        <h2 class="h2">Por qué existimos</h2>
        <p>Hoy casi todas las e-bikes se venden por internet: elegís una foto, pagás una plata importante y esperás que llegue bien. No la probaste, no sabés si te queda cómoda, y si algo falla no sabés a quién reclamarle. Menos todavía si vivís lejos, en el campo, y esa distancia con el vendedor pesa el doble.</p>
        <p>MC Ebikes nace de ahí. <strong>Queríamos un lugar con cara visible: donde te expliquen de verdad cuál MC te conviene, donde sepas quién te va a atender si algo pasa, y donde tu MC llegue con la misma seriedad que un vehículo de trabajo, no como un juguete de catálogo.</strong></p>
        <h3>Cómo elegimos lo que vendemos</h3>
        <p>No traemos catálogos infinitos. Trabajamos pocos modelos, todos fat, todos con motor de 1000W o más, frenos a disco y batería de litio con arranque por NFC. Los tenemos en el local, los usamos y sabemos cómo se comportan en el terreno real.</p>
      </div>
      <div class="split__m rv d1"><img src="assets/img/v8-negra.webp" alt="Local MC Ebikes" loading="lazy" width="1200" height="800"></div>
    </div>
  </div>
</section>

<section class="sec sec--rural">
  <div class="wrap">
    <div class="sec-head rv"><span class="kick">Cómo trabajamos</span><h2 class="h2">En qué creemos</h2></div>
    <div class="feat">
      <article class="rv"><div class="ic">${ico(I.bike)}</div><h3>Probar antes</h3><p>Nadie debería gastar esta plata sin subirse primero. El test ride es gratis y sin compromiso, siempre.</p></article>
      <article class="rv d1"><div class="ic">${ico(I.check)}</div><h3>Datos reales</h3><p>Te decimos la autonomía real con tu peso y tu terreno, no el número de laboratorio del fabricante.</p></article>
      <article class="rv d2"><div class="ic">${ico(I.wrench)}</div><h3>Bancar lo vendido</h3><p>Vendemos lo que podemos reparar. Si no tenemos cómo darte service, no lo traemos.</p></article>
      <article class="rv d3"><div class="ic">${ico(I.user)}</div><h3>Sin verso</h3><p>Si una MC no te sirve para lo que necesitás, te lo decimos. Preferimos no vender antes que vender mal.</p></article>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="band rv">
      <img src="assets/img/v40-camo.webp" alt="" loading="lazy">
      <div>
        <span class="kick">Dónde estamos</span>
        <h2 class="h2" style="margin-top:14px">Estamos en <em>Castelar</em></h2>
        <p>Atendemos con local propio en Castelar, Morón, Ituzaingó, Haedo, Ramos Mejía y alrededores, con entrega sin cargo en la zona. Y coordinamos envío a todo el país para que tu MC llegue hasta el campo, con la misma garantía real y el mismo respaldo.</p>
        <a class="btn btn--p btn--lg" href="/contacto">Cómo llegar</a>
      </div>
    </div>
  </div>
</section>
${ctaBlock()}`;
writeFileSync(new URL("./nosotros.html", import.meta.url), page({
  slug: "nosotros", active: "nosotros", ld: crumbLD("Nosotros", "nosotros"),
  title: "Quiénes somos | MC Ebikes, movilidad eléctrica en Castelar",
  desc: "MC Ebikes nace para darle a cada chico y chica del campo argentino su primer vehículo propio. Local en Castelar, cara visible y envío a todo el país.",
  main: nosotros,
}));
console.log("✓ nosotros.html");

/* =====================================================================
   FAQ
   ===================================================================== */
const faqLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    JSON.parse(crumbLD("Preguntas frecuentes", "faq")),
    { "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ],
}, null, 1);
const faqPage = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="/">Inicio</a> / <span aria-current="page">Preguntas</span></nav>
    <span class="kick">Preguntas frecuentes</span>
    <h1 class="h1" style="font-size:clamp(38px,7vw,66px);margin-top:14px">Todo lo que<br>querés <em>saber</em></h1>
    <p>Las dudas reales que nos llegan todos los días. Si te queda alguna, escribinos.</p>
  </div>
</section>
<section class="sec sec--claro">
  <div class="wrap">
    <div class="faq rv">${FAQS.map(([q, a]) => faqItem(q, a)).join("")}</div>
  </div>
</section>
${ctaBlock("¿Te quedó una duda?", "Escribinos por WhatsApp y te respondemos en el día.")}`;
writeFileSync(new URL("./faq.html", import.meta.url), page({
  slug: "faq", active: "faq", ld: faqLD,
  title: "Preguntas frecuentes sobre fat e-bikes | MC Ebikes",
  desc: "Todo sobre patente, batería, garantía, envíos y cuotas de las fat e-bikes MC. Respuestas directas a las dudas más comunes antes de comprar.",
  main: faqPage,
}));
console.log("✓ faq.html");

/* =====================================================================
   CONTACTO
   ===================================================================== */
const contacto = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="/">Inicio</a> / <span aria-current="page">Contacto</span></nav>
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
  ld: JSON.stringify({ "@context": "https://schema.org", "@graph": [negocioLD, JSON.parse(crumbLD("Contacto", "contacto"))] }, null, 1),
  title: "Contacto | MC Ebikes Castelar, Buenos Aires",
  desc: "Escribinos por WhatsApp, mandanos un mail o vení al local en Castelar. Lunes a viernes de 10 a 19 h, sábados de 10 a 14 h.",
  main: contacto,
}));
console.log("✓ contacto.html");

/* =====================================================================
   PAGINAS DE POLITICAS
   Redactadas con lo que es verdad hoy y con lo que fija la Ley 24.240.
   Donde falta una condicion comercial que el cliente todavia no definio,
   se remite a consultarla en vez de inventar un plazo o un costo.
   ===================================================================== */
const legalPage = (kick, h1, cuerpo) => `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs"><a href="/">Inicio</a> / <span aria-current="page">${kick}</span></nav>
    <span class="kick">${kick}</span>
    <h1 class="h1" style="font-size:clamp(32px,5.2vw,52px);margin-top:14px">${h1}</h1>
  </div>
</section>
<section class="sec sec--claro">
  <div class="wrap">
    <div class="legal rv">${cuerpo}</div>
  </div>
</section>`;

const POLITICAS = [
  ["privacidad", "Privacidad", "Política de privacidad",
   "Qué datos recibimos cuando usás el sitio de MC Ebikes, para qué los usamos y cómo pedir que los borremos.", `
    <p class="lead">Esta página explica qué datos recibimos cuando usás el sitio de MC Ebikes, para qué los usamos y cómo pedir que los borremos. Está redactada siguiendo la Ley 25.326 de Protección de Datos Personales.</p>
    <h2>Qué datos recibimos</h2>
    <p>El sitio no tiene registro de usuarios ni carrito de compras. Los formularios de contacto y de test ride <strong>no envían la información a un servidor nuestro</strong>: arman un mensaje con lo que escribiste y abren WhatsApp para que vos decidas si lo mandás. Hasta que tocás enviar, esos datos no salen de tu teléfono o tu computadora.</p>
    <p>Cuando nos escribís, recibimos lo que hayas incluido en el mensaje: tu nombre, tu teléfono, el modelo que te interesa y cualquier dato que agregues. También quedan guardadas las conversaciones de WhatsApp y los correos que nos mandes.</p>
    <h2>Para qué los usamos</h2>
    <ul class="ticks">
      <li><span>Responder tu consulta y asesorarte sobre qué modelo te conviene.</span></li>
      <li><span>Coordinar un test ride, un service o una entrega.</span></li>
      <li><span>Cumplir con las obligaciones de facturación y garantía cuando hay una venta.</span></li>
    </ul>
    <p>No vendemos ni cedemos tus datos a terceros con fines publicitarios.</p>
    <h2>Cookies y medición</h2>
    <p>El sitio no usa cookies de publicidad ni de seguimiento entre sitios. Si más adelante incorporamos una herramienta de medición, vamos a actualizar esta página y a pedirte el consentimiento que corresponda antes de activarla.</p>
    <h2>Menores de edad</h2>
    <p>Si la persona que va a usar la bicicleta es menor de edad, pedimos que la consulta, la prueba y la compra las gestione una madre, un padre o un adulto responsable. No solicitamos datos de menores a través del sitio.</p>
    <h2>Tus derechos</h2>
    <p>Podés pedirnos en cualquier momento acceder a los datos que tengamos tuyos, corregirlos o eliminarlos, escribiéndonos a <a href="mailto:${MAIL}">${MAIL}</a>. La Agencia de Acceso a la Información Pública es el organismo de control de la Ley 25.326 y recibe las denuncias por incumplimiento.</p>
    <h2>Cambios en esta política</h2>
    <p>Si la modificamos, publicamos la versión nueva en esta misma página.</p>`],

  ["terminos", "Términos", "Términos y condiciones",
   "Las reglas de uso del sitio de MC Ebikes y las condiciones generales de precios, especificaciones y garantía.", `
    <p class="lead">Estas condiciones se aplican al uso del sitio de MC Ebikes y a las operaciones que se inicien a través de él. Al usar el sitio, las aceptás.</p>
    <h2>Qué es este sitio</h2>
    <p>Este sitio es informativo y de contacto. <strong>No es una tienda online:</strong> no se puede comprar ni pagar desde acá. Las consultas se continúan por WhatsApp, por correo o en el local de Castelar, y toda operación se cierra por esas vías con su documentación correspondiente.</p>
    <h2>Precios y disponibilidad</h2>
    <p>Los precios publicados son de referencia, están expresados en pesos argentinos e incluyen impuestos. Pueden cambiar sin aviso previo y no constituyen una oferta cerrada: el precio y la disponibilidad se confirman al momento de la consulta. Las cuotas dependen de la tarjeta y de las promociones vigentes de cada banco.</p>
    <h2>Especificaciones técnicas</h2>
    <p>Las especificaciones que publicamos provienen de la información del fabricante. Los valores de autonomía son estimaciones bajo condiciones favorables: el rendimiento real varía según el peso de la persona, la carga, el terreno, el viento, la presión de las cubiertas, la temperatura y cuánto uses el acelerador. Antes de comprar te recomendamos consultarnos por tu recorrido concreto y probar la bicicleta.</p>
    <h2>Uso del vehículo</h2>
    <p>La clasificación de cada modelo y las condiciones para circular dependen de sus características técnicas y de la normativa de cada jurisdicción, que puede fijar requisitos propios. Consultanos por el modelo que te interesa y verificá las reglas vigentes en tu municipio y tu provincia antes de circular por la vía pública. Recomendamos siempre el uso de casco.</p>
    <h2>Garantía</h2>
    <p>Las bicicletas cuentan con la garantía legal que establece la Ley 24.240 y con la garantía comercial detallada en el certificado que se entrega con la compra. Cubre defectos de fabricación. No cubre el desgaste natural, los daños por golpes, el uso indebido, las modificaciones ni la falta de mantenimiento.</p>
    <h2>Propiedad intelectual</h2>
    <p>Los textos, las imágenes, el logo y el diseño de este sitio pertenecen a MC Ebikes o a quienes nos autorizaron a usarlos. No pueden reproducirse sin permiso.</p>
    <h2>Contacto</h2>
    <p>Ante cualquier duda sobre estas condiciones, escribinos a <a href="mailto:${MAIL}">${MAIL}</a>.</p>`],

  ["envios", "Envíos y devoluciones", "Envíos, cambios y devoluciones",
   "Cómo entregamos tu MC, qué pasa si te arrepentís dentro de los 10 días y cómo procede la garantía.", `
    <p class="lead">Acá explicamos cómo llega tu MC y qué derechos tenés si querés devolverla o si aparece una falla.</p>
    <h2>Entregas</h2>
    <p>Entregamos en el local de Castelar, donde también podés retirarla y hacer la revisión inicial con nosotros. Coordinamos envíos a otras localidades: el costo y el plazo dependen del destino, así que te los confirmamos antes de cerrar la operación.</p>
    <p>Te recomendamos revisar la bicicleta al recibirla, delante de quien la entrega, y dejar asentado en el momento cualquier daño de transporte.</p>
    <h2>Derecho de arrepentimiento</h2>
    <p>Si la compra se hizo a distancia, es decir por WhatsApp, teléfono o correo y sin haber pasado por el local, la Ley 24.240 te da <strong>diez días corridos desde la entrega para arrepentirte</strong>, sin necesidad de explicar por qué. La bicicleta tiene que estar sin uso y en las mismas condiciones en que la recibiste, con su embalaje y sus accesorios. El costo de la devolución corre por nuestra cuenta.</p>
    <p>Para ejercerlo, escribinos a <a href="mailto:${MAIL}">${MAIL}</a> o por WhatsApp dentro de ese plazo.</p>
    <h2>Si aparece una falla</h2>
    <p>Si la bicicleta tiene un defecto cubierto por la garantía, la reparamos en nuestro taller de Castelar. Escribinos contándonos qué pasa, con fotos o un video si se puede, y coordinamos la revisión. Si la reparación no resuelve el problema, la Ley 24.240 te habilita a pedir el cambio del producto, la devolución del dinero o una quita proporcional del precio.</p>
    <h2>Cambios por otro modelo</h2>
    <p>Si después de la entrega te das cuenta de que otro modelo te sirve más, consultanos. Los cambios se evalúan caso por caso según el estado de la bicicleta y el tiempo transcurrido. Por eso insistimos tanto con el test ride: probarla antes es la mejor forma de no tener que cambiarla después.</p>
    <h2>Repuestos y service</h2>
    <p>Tenemos stock de los repuestos de mayor rotación y pedimos el resto a nuestro proveedor. Los plazos dependen de la pieza; te los confirmamos al momento de la consulta.</p>`],
];

for (const [slug, kick, h1, desc, cuerpo] of POLITICAS) {
  writeFileSync(new URL(`./${slug}.html`, import.meta.url), page({
    slug, active: "",
    title: `${h1} | MC Ebikes`,
    desc,
    ld: crumbLD(h1, slug),
    main: legalPage(kick, h1, cuerpo),
  }));
  console.log(`✓ ${slug}.html`);
}

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
      <a class="btn btn--p btn--lg" href="/">Ir al inicio</a>
      <a class="btn btn--g btn--lg" href="/productos">Ver modelos</a>
    </div>
  </div>
</section>`,
}));
console.log("✓ 404.html");


/* =====================================================================
   GUIAS Y RESPUESTAS — T-33, T-38, T-40, T-41
   El hub que pide la arquitectura: ordena las guias y dirige a producto,
   soporte y test ride. La plantilla admite titulo, meta, H1, introduccion,
   indice con anclajes, cuerpo, fuentes, fecha, revisor, enlaces y CTA.
   Regla de contenido: una guia explica como decidir. No inventa una cifra
   ni convierte un dato del proveedor en una promesa propia.
   ===================================================================== */
const REVISOR = "Equipo de MC Ebikes, Castelar";
const ACTUALIZADO = "2026-09-08";
const fecha_es = (iso) => {
  const M = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
    "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const [a, m, d] = iso.split("-");
  return `${+d} de ${M[+m - 1]} de ${a}`;
};

const GUIAS = [
  {
    slug: "guias-autonomia-real",
    fecha: "2026-09-08",
    kicker: "Autonomía real",
    h1: "Autonomía real de una bicicleta eléctrica: qué cambia los kilómetros",
    title: "Autonomía real de una bicicleta eléctrica: qué cambia los kilómetros | MC Ebikes",
    desc: "Entendé la autonomía de una e-bike: peso, terreno, viento, carga, asistencia, acelerador, batería y condiciones de prueba.",
    lead: "Una e-bike no recorre siempre la misma cantidad de kilómetros por carga. El resultado cambia según el modelo, el peso, el terreno, el viento, la presión de las cubiertas, la temperatura, el nivel de asistencia, el uso del acelerador, la carga y la edad de la batería.",
    ind: [
      ["anunciada", "Anunciada contra observada"],
      ["variables", "Qué cambia el resultado"],
      ["modelos", "Cómo leer los modelos de MC"],
      ["margen", "Cómo calcular tu margen"],
      ["preguntar", "Qué preguntar antes de comprar"],
      ["carga", "Cuánto cuesta cargarla"],
    ],
    cuerpo: `
<p>Antes de elegir conviene entender qué significa el rango anunciado y qué información
hay que pedir.</p>

<h2 id="anunciada">La diferencia entre autonomía anunciada y autonomía observada</h2>
<p>La autonomía anunciada es una referencia. La autonomía observada corresponde a una
prueba realizada bajo condiciones concretas. Para que el dato sea útil hay que registrar quién
manejó, cuánto pesaba, por qué terreno, con qué presión, temperatura, viento, asistencia y
carga.</p>

<h2 id="variables">Las variables que cambian el resultado</h2>
<table class="spec-table">
  <tr><td>Peso</td><td>Más esfuerzo del sistema y potencialmente mayor consumo</td></tr>
  <tr><td>Terreno</td><td>Pendientes, barro, arena y superficie irregular pueden aumentar el consumo</td></tr>
  <tr><td>Viento</td><td>El viento en contra puede exigir más asistencia</td></tr>
  <tr><td>Presión</td><td>Una presión incorrecta puede afectar el rodamiento</td></tr>
  <tr><td>Acelerador</td><td>Su uso puede modificar el consumo</td></tr>
  <tr><td>Temperatura</td><td>Puede cambiar el comportamiento de la batería</td></tr>
  <tr><td>Carga</td><td>Mochila, herramientas u otros objetos agregan peso</td></tr>
  <tr><td>Edad de la batería</td><td>La capacidad puede cambiar con el tiempo y el uso</td></tr>
</table>

<h2 id="modelos">Cómo leer los modelos de MC</h2>
<p>Estos son los valores de referencia que publica el proveedor:
${P.map((p) => `<b>${p.name}</b> ${p.aut}`).join(", ")}. Se publican junto con sus condiciones
de medición en cuanto las tengamos documentadas.</p>

<h2 id="margen">Cómo calcular el margen que necesitás</h2>
<ol class="pasos">
  <li>Medí la distancia total de ida y vuelta.</li>
  <li>Sumá desvíos y recorridos adicionales habituales.</li>
  <li>Considerá viento, pendientes, barro, arena y carga.</li>
  <li>Dejá una reserva: no planifiques usando el 100 % del rango publicado.</li>
  <li>Preguntá qué pasa si la autonomía baja y dónde se revisa la batería.</li>
</ol>
<p>En el <a href="/#calc">recomendador de la home</a> podés hacer esta cuenta con tu
recorrido, tu terreno y tu peso.</p>

<h2 id="preguntar">Qué preguntar antes de comprar</h2>
<ul class="ticks">
  <li>${ico(I.check)}<span>¿Cuál fue el peso utilizado en la prueba?</span></li>
  <li>${ico(I.check)}<span>¿Se usó acelerador, asistencia o ambos?</span></li>
  <li>${ico(I.check)}<span>¿El camino tenía pendientes, arena, barro o viento?</span></li>
  <li>${ico(I.check)}<span>¿Cuánta carga llevaba la bicicleta?</span></li>
  <li>${ico(I.check)}<span>¿Qué presión tenían las cubiertas?</span></li>
  <li>${ico(I.check)}<span>¿La batería era nueva?</span></li>
  <li>${ico(I.check)}<span>¿Cuánto tarda en recargar?</span></li>
  <li>${ico(I.check)}<span>¿Dónde se revisa o reemplaza la batería?</span></li>
</ul>

<h2 id="carga">Cuánto cuesta cargarla</h2>
<p>El costo depende del consumo, la capacidad de la batería, la tarifa eléctrica y la fecha. La
calculadora de la home muestra sus supuestos y aclara que es una estimación, no una promesa.</p>

<h2>La pregunta correcta</h2>
<p>No es solamente «¿cuántos kilómetros hace?». Es: <b>¿cuántos kilómetros necesito cubrir en
mi recorrido real y qué reserva quiero tener?</b></p>`,
    fuentes: [
      ["Fichas técnicas del proveedor", "Las cifras de autonomía que se citan son las que publica el proveedor de cada modelo, en sus condiciones de medición."],
      ["Pruebas propias", "Todavía no publicamos pruebas propias fechadas. Cuando las tengamos, van a figurar acá con peso, terreno, asistencia, temperatura, presión y carga."],
    ],
  },
  {
    slug: "guias-comparacion-modelos",
    fecha: "2026-09-08",
    kicker: "Comparación",
    h1: "SW V20 Pro vs V29 Pro vs V40 vs S20 Pro: cuál conviene",
    title: "SW V20 Pro vs V29 Pro vs V40 vs S20 Pro: cuál conviene | MC Ebikes",
    desc: "Compará las cuatro fat e-bikes de MC Ebikes por recorrido, potencia, batería, autonomía, carga, precio, recarga y límites.",
    lead: "Las cuatro MC comparten una base de fat e-bike, pero no están pensadas exactamente para el mismo recorrido. Compará autonomía, batería, carga, potencia, precio y uso recomendado antes de elegir.",
    ind: [
      ["rapida", "Recomendación rápida"],
      ["tabla", "Comparación de referencia"],
      ["cada", "Qué aporta cada modelo"],
      ["limites", "Los límites de cada una"],
    ],
    cuerpo: `
<h2 id="rapida">Recomendación rápida</h2>
<ul class="ticks">
${P.map((p) => `  <li>${ico(I.check)}<span><b>${p.name}:</b> ${p.rec.toLowerCase()}.</span></li>`).join("\n")}
</ul>

<h2 id="tabla">Comparación de referencia</h2>
<div class="cmp">
  <table>
    <thead><tr><th>Modelo</th>${P.map((p) => `<th>${p.name}</th>`).join("")}</tr></thead>
    <tbody>
      <tr><td>Motor publicado</td>${P.map((p) => `<td>${p.motor}</td>`).join("")}</tr>
      <tr><td>Batería publicada</td>${P.map((p) => `<td>${p.bat}</td>`).join("")}</tr>
      <tr><td>Autonomía publicada</td>${P.map((p) => `<td>${p.aut}</td>`).join("")}</tr>
      <tr><td>Carga máxima publicada</td>${P.map((p) => `<td>${p.carga}</td>`).join("")}</tr>
      <tr><td>Recarga publicada</td>${P.map((p) => `<td>${p.recarga}</td>`).join("")}</tr>
      <tr><td>Precio publicado</td>${P.map((p) => `<td class="hl">${money(p.price)}</td>`).join("")}</tr>
    </tbody>
  </table>
</div>
<p class="guia__meta">Los precios y la disponibilidad pueden cambiar. La autonomía es la
publicada por el proveedor y se mide en condiciones favorables.</p>

<h2 id="cada">Qué aporta cada modelo</h2>
${P.map((p) => `<h3>${p.name}</h3>\n<p>${p.paraQuien} <a href="/${p.slug}">Ver la ficha completa</a>.</p>`).join("\n")}

<h2 id="limites">Los límites de cada una</h2>
<p>Ningún modelo sirve para todo. Esto es lo que conviene mirar antes de decidirse por cada uno:</p>
${P.map((p) => `<h3>${p.name}</h3>\n<p>${p.limites}</p>`).join("\n")}`,
    fuentes: [
      ["Fichas técnicas del proveedor", "Los valores de la tabla son los publicados por el proveedor de cada modelo."],
      ["Comparación entre fichas", "Las observaciones sobre límites salen de comparar las fichas entre sí, no de una opinión: los pesos, las cargas máximas y las autonomías son las declaradas."],
    ],
  },
  {
    slug: "guias-cuidado-bateria",
    fecha: "2026-09-08",
    kicker: "Cuidado de la batería",
    h1: "Cómo cuidar la batería de una e-bike",
    title: "Cómo cuidar la batería de una e-bike: carga, guardado y vida útil | MC Ebikes",
    desc: "Aprendé a cuidar la batería de una bicicleta eléctrica: carga, guardado, limpieza, autonomía reducida y cuándo consultar al service.",
    lead: "La batería es una de las partes más importantes de una bicicleta eléctrica. Para cuidarla hay que prestar atención a la carga, el guardado, la humedad, la limpieza, la temperatura y los síntomas de autonomía reducida.",
    ind: [
      ["carga", "Carga"],
      ["guardado", "Guardado"],
      ["agua", "Agua y limpieza"],
      ["baja", "Cuando baja la autonomía"],
      ["nousar", "Cuándo no usarla"],
      ["checklist", "La lista de control"],
    ],
    cuerpo: `
<h2 id="carga">Carga</h2>
<p>Usá el cargador que vino con la bicicleta y seguí las indicaciones del fabricante. Evitá
improvisar conexiones o usar accesorios no aprobados. Si perdiste el cargador o necesitás uno
de repuesto, consultanos: no todos los cargadores del mismo voltaje son equivalentes.</p>

<h2 id="guardado">Guardado</h2>
<p>Si la bicicleta no se va a usar durante varias semanas, guardá la batería aproximadamente
a la mitad de carga, en un lugar seco y seguro. No la dejes descargada del todo durante meses
ni la guardes al sol o a la intemperie.</p>

<h2 id="agua">Agua y limpieza</h2>
<p>Tiene protección contra salpicaduras: podés andar con lluvia normal. Lo que hay que evitar
es sumergirla, usar hidrolavadora o manguera a presión, y dejarla permanentemente a la
intemperie. <b>No es lo mismo lluvia, salpicadura, lavado y sumersión.</b> Después de andar por
tierra o barro, limpiala con un trapo húmedo.</p>

<h2 id="baja">Cuando baja la autonomía</h2>
<p>Primero revisá lo que no es la batería: presión de cubiertas, recorrido, viento, temperatura,
carga que llevás y uso del acelerador. Casi siempre la explicación está ahí.</p>
<p>Si el cambio persiste, <b>no desarmes la batería</b>. Escribinos con el modelo, la antigüedad,
los síntomas y las condiciones de uso, y lo vemos en el taller.</p>

<h2 id="nousar">Cuándo no usarla</h2>
<p>No uses la bicicleta si hay fallas visibles en frenos, ruedas, batería, cableado, cargador o
estructura. Si la batería está caliente, hinchada, con olor o tuvo un golpe fuerte, no la cargues
ni la uses: consultanos antes de seguir.</p>

<h2 id="checklist">La lista de control</h2>
<p>Lo que conviene revisar cada tanto, sin herramientas y en dos minutos:</p>
<ul class="ticks">
  <li>${ico(I.check)}<span>Presión de las cubiertas</span></li>
  <li>${ico(I.check)}<span>Frenos</span></li>
  <li>${ico(I.check)}<span>Luces y fijaciones</span></li>
  <li>${ico(I.check)}<span>Cargador y batería, sin daños visibles</span></li>
  <li>${ico(I.check)}<span>Que quede guardada en lugar seco</span></li>
  <li>${ico(I.check)}<span>Que no se haya lavado con agua a presión</span></li>
  <li>${ico(I.check)}<span>El kilometraje, para saber cuándo toca el service</span></li>
</ul>`,
    fuentes: [
      ["Documentación del fabricante", "Las indicaciones de carga y guardado siguen lo que informa el fabricante de la batería. Si tenés el manual de tu unidad, ese manda."],
      ["Nuestro taller en Castelar", "Los síntomas y el orden en que conviene revisarlos salen de lo que vemos en el service."],
    ],
  },
  {
    slug: "guias-tierra-barro-arena",
    fecha: "2026-09-08",
    kicker: "Tierra, barro y arena",
    h1: "Fat bike eléctrica para tierra, barro y arena: qué mirar antes de comprar",
    title: "Fat bike eléctrica para tierra, barro y arena: qué mirar | MC Ebikes",
    desc: "Qué mirar en una fat bike eléctrica para caminos rurales: cubiertas, presión, frenos, batería, carga, limpieza y límites del terreno.",
    lead: "Las cubiertas fat pueden aportar estabilidad y superficie de contacto en determinados terrenos, pero no convierten a una bicicleta en adecuada para cualquier condición.",
    ind: [
      ["cubiertas", "Qué aportan las cubiertas fat"],
      ["tierra", "Tierra y caminos rurales"],
      ["barro", "Barro y arena"],
      ["frenos", "Frenos, carga y control"],
      ["limpieza", "Limpieza y guardado"],
      ["modelo", "Cómo elegir el modelo"],
    ],
    cuerpo: `
<p>Para elegir bien hay que mirar cubiertas, presión, frenos, potencia, batería, carga, limpieza
y límites de uso.</p>

<h2 id="cubiertas">Qué aportan las cubiertas fat</h2>
<p>Una cubierta ancha apoya más superficie contra el piso, y eso puede dar estabilidad donde
una cubierta fina se hunde o patina. La presión importa tanto como el ancho: demasiada presión
pierde agarre en tierra suelta, y demasiado poca aumenta el consumo y el riesgo de pinchadura
por pellizco. Consultanos la presión recomendada para tu modelo y tu peso.</p>

<h2 id="tierra">Tierra y caminos rurales</h2>
<p>La experiencia depende del estado del camino, la velocidad, la carga, el clima y la habilidad
de quien maneja. En caminos con pozos, piedras o barro, la prudencia y el control importan
tanto como el motor.</p>

<h2 id="barro">Barro y arena</h2>
<p>La arena profunda y el barro aumentan el esfuerzo y reducen la autonomía. No decimos que
un modelo esté recomendado para una condición específica sin haberlo probado nosotros en
esa condición. Si tu recorrido tiene arena o barro seguido, contanos y lo vemos con vos.</p>

<h2 id="frenos">Frenos, carga y control</h2>
<p>Revisá frenos, presión, fijaciones y carga antes de salir. No superes el límite de carga del
modelo. Si la va a usar un adolescente, las reglas de uso deben acordarse con los adultos
responsables.</p>

<h2 id="limpieza">Limpieza y guardado</h2>
<p>Después de circular por tierra o barro, limpiala con un trapo húmedo y evitá el agua a
presión. Guardala seca y protegida de la intemperie.
<a href="/guias-cuidado-bateria">Acá está el detalle del cuidado de la batería</a>.</p>

<h2 id="modelo">Cómo elegir el modelo</h2>
<ul class="ticks">
${P.map((p) => `  <li>${ico(I.check)}<span><b>${p.name}:</b> evaluar para ${p.rec.toLowerCase()}.</span></li>`).join("\n")}
</ul>`,
    fuentes: [
      ["Fichas técnicas del proveedor", "Las medidas de cubierta y los límites de carga son los declarados por el proveedor de cada modelo."],
      ["Pruebas de terreno", "Todavía no tenemos pruebas propias fechadas en barro y arena. Por eso esta guía explica qué mirar y no afirma que un modelo esté recomendado para esas condiciones."],
    ],
  },
  {
    slug: "guias-delivery-trabajo",
    fecha: "2026-09-08",
    kicker: "Delivery y trabajo",
    h1: "Bicicleta eléctrica para delivery y trabajo: autonomía, carga y service",
    title: "Bicicleta eléctrica para delivery y trabajo: autonomía, carga y service | MC Ebikes",
    desc: "Qué evaluar en una e-bike para delivery o trabajo: kilómetros, jornada, carga, recarga, autonomía, repuestos y service.",
    lead: "Cuando una e-bike se usa muchas horas por día, la decisión cambia. No alcanza con mirar precio y potencia: hay que calcular distancia, reserva de autonomía, carga, tiempos de recarga, mantenimiento, repuestos y tiempo fuera de servicio.",
    ind: [
      ["jornada", "Definí la jornada"],
      ["reserva", "Calculá la reserva"],
      ["carga", "Carga y portaequipaje"],
      ["service", "Service y repuestos"],
      ["costo", "Costo operativo"],
    ],
    cuerpo: `
<h2 id="jornada">Definí la jornada</h2>
<p>Registrá kilómetros diarios, cantidad de horas, pausas, pendientes, tipo de terreno y
posibilidad de recargar durante el día. La batería que necesitás depende del recorrido real y
de esas condiciones, no del número más alto del catálogo.</p>

<h2 id="reserva">Calculá la reserva</h2>
<p>No planifiques la jornada usando el 100 % de la autonomía anunciada. Dejá margen para
viento, carga, pendientes, temperatura y desvíos.
<a href="/guias-autonomia-real">Acá explicamos cuánto cambia cada variable</a>.</p>

<h2 id="carga">Carga y portaequipaje</h2>
<p>Cada modelo tiene un límite de carga declarado y ese límite incluye a quien maneja. El
portaequipaje sirve para lo que el fabricante documenta: no lo tomes como una promesa de
capacidad si no está por escrito. Consultanos antes de montar cajas o soportes.</p>

<h2 id="service">Service y repuestos</h2>
<p>Para trabajo, el tiempo fuera de servicio tiene un costo. Antes de elegir, consultá qué
repuestos se consiguen, cuánto demora el diagnóstico, qué incluye el primer service y cómo
funciona la garantía. <a href="/servicio">Acá está cómo trabajamos el service</a>.</p>

<h2 id="costo">Costo operativo</h2>
<p>Para que una cuenta de costo sirva tiene que documentar kilómetros, días de uso, tarifa
eléctrica, combustible de referencia, mantenimiento y precio de compra.
<b>No prometemos ingresos ni recuperación de la inversión:</b> te damos los supuestos y hacés
la cuenta con tus números.</p>
<p>Esta guía está dirigida a trabajadores y repartidores, y no reemplaza la conversación sobre
el uso cotidiano en el campo.</p>`,
    fuentes: [
      ["Fichas técnicas del proveedor", "Los límites de carga y las autonomías citadas son las declaradas por el proveedor."],
      ["Nuestra operación de service", "Los tiempos y el stock de repuestos dependen de la pieza y del momento: por eso esta guía dice qué preguntar en vez de prometer un plazo."],
    ],
  },
  {
    slug: "guias-como-elegir",
    fecha: "2026-09-07",
    kicker: "Cómo elegir",
    h1: "Cómo elegir tu e-bike según el recorrido que hacés",
    title: "Cómo elegir una e-bike para el campo según tu recorrido | MC Ebikes",
    desc: "El método para elegir modelo: medí el recorrido real, mirá el terreno, contá el peso y dejá margen. Con los cuatro modelos MC y qué recorrido cubre cada uno.",
    lead: "La pregunta no es cuántos watts tiene. Es cuánto recorrés, por dónde y con cuánto peso encima. Si respondés esas tres cosas, el modelo se elige casi solo.",
    ind: [
      ["medi", "Medí tu recorrido real"],
      ["terreno", "Mirá por dónde andás"],
      ["peso", "Contá el peso que llevás"],
      ["margen", "Dejá margen, no vayas justo"],
      ["cargar", "Dónde la vas a cargar y guardar"],
      ["modelos", "Qué recorrido cubre cada modelo"],
      ["probar", "Lo que no te podemos decir por internet"],
    ],
    cuerpo: `
<h2 id="medi">Medí tu recorrido real</h2>
<p>No el que te imaginás: el que hacés. Contá la ida y la vuelta, y multiplicá por
las veces que lo hacés en el día. De casa al pueblo y de vuelta son dos tramos.
Si al mediodía volvés a casa y después salís otra vez, son cuatro.</p>
<p>La mayoría se sorprende con el número. Un recorrido que parece corto, repetido
tres veces por día, se convierte en un uso que necesita otra batería.</p>

<h2 id="terreno">Mirá por dónde andás</h2>
<p>La autonomía que publica cualquier fabricante se mide en condiciones favorables:
asfalto parejo, sin viento, con una persona de peso promedio y sin carga. Eso casi
nunca es tu día.</p>
<p>La tierra suelta, el ripio, el pasto, la arena y el barro obligan al motor a
trabajar más para avanzar lo mismo. Lo mismo pasa con las pendientes, aunque las
bajes después: la subida ya te consumió. Como referencia de trabajo, sobre tierra
y ripio conviene calcular alrededor de un 15 % menos que la cifra publicada, y en
barro, arena o pasto alto la diferencia puede acercarse al 30 %.</p>
<p>Son estimaciones nuestras para ayudarte a decidir, no una medición certificada.
El número que vale para tu terreno lo vas a ver el día que la manejes vos.</p>

<h2 id="peso">Contá el peso que llevás</h2>
<p>El peso total es el tuyo más el de lo que cargás: mochila, herramienta, bolso,
compras, lo que sea. Cada kilo se paga en autonomía y en desgaste de frenos y
cubiertas. Si todos los días llevás peso, el cálculo tiene que hacerse con ese
peso, no con vos solo.</p>

<h2 id="margen">Dejá margen, no vayas justo</h2>
<p>Esta es la parte que más se saltea. Si tu recorrido es de 50 km y la e-bike
rinde 55 km en tus condiciones, no alcanza. Un día hay viento en contra, otro día
tenés que hacer una vuelta de más, y la batería envejece: a los dos o tres años
rinde menos que el primer día.</p>
<p>Nosotros trabajamos con un margen del 30 %. Si tu recorrido diario es de 50 km,
buscamos un modelo que rinda 65 km o más en tus condiciones reales. Por eso a veces
te vamos a recomendar un modelo más chico del que venías a buscar, y a veces uno
más grande.</p>
<p>Podés hacer esta cuenta vos mismo en el
<a href="/#calc">recomendador de la home</a>: cargás kilómetros, terreno
y peso, y te dice qué modelo te deja margen.</p>

<h2 id="cargar">Dónde la vas a cargar y guardar</h2>
<p>Es una pregunta práctica que decide más de lo que parece. La batería se carga en
un enchufe común, así que necesitás un lugar con corriente donde la e-bike pase la
noche, o poder sacar la batería y llevarla adentro.</p>
<p>Si el lugar donde la guardás está lejos del enchufe, una batería extraíble te
cambia el día. Y si el galpón es húmedo o queda a la intemperie, conviene guardar
la batería adentro aunque la e-bike duerma afuera.</p>

<h2 id="modelos">Qué recorrido cubre cada modelo</h2>
<p>Las cifras de abajo son las que publica el proveedor, en sus condiciones de
medición. Sirven para comparar los modelos entre sí; para saber qué te da a vos,
aplicá lo del terreno y el peso, o probala.</p>
${P.map((p) => `
<h3>${p.name} — ${p.rec}</h3>
<p>${p.lead} Autonomía publicada: ${p.aut}. Batería ${p.bat}.${p.revision ? " La ficha técnica de este modelo está en confirmación con el fabricante." : ""}
<a href="/${p.slug}">Ver la ficha completa de la ${p.name}</a>.</p>`).join("")}

<h2 id="probar">Lo que no te podemos decir por internet</h2>
<p>Cuánto te va a rendir a vos, en tu camino, con tu peso y tu forma de manejar.
Podemos estimarlo y lo estimamos, pero el número real sale de andar.</p>
<p>Por eso el test ride es sin cargo y sin compromiso: venís, la manejás, y te
llevás una idea propia en vez de la nuestra. Si vivís lejos, coordinamos una
demostración cuando estemos en tu zona.</p>
<p>Y una vez que la tengas, el que te la vendió es el que te la arregla:
<a href="/servicio">acá está cómo funciona el service y la garantía</a>.</p>`,
    fuentes: [
      ["Fichas técnicas del proveedor", "Las cifras de potencia, batería, autonomía y carga que se citan en esta guía salen de las fichas que nos entrega el proveedor de cada modelo."],
      ["Nuestra experiencia de entrega y service en Castelar", "Los rangos de ajuste por terreno y peso, y el margen del 30 %, son criterios de trabajo propios. No son una medición certificada."],
    ],
  },
];

const guiaPage = (g) => `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Ruta">
      <a href="/">Inicio</a> / <a href="/guias">Guías</a> /
      <span aria-current="page">${g.kicker}</span>
    </nav>
    <span class="kick">Guías y respuestas</span>
    <h1>${g.h1}</h1>
    <p>${g.lead}</p>
    <p class="guia__meta">Actualizada el ${fecha_es(ACTUALIZADO)} · Revisada por ${REVISOR}</p>
  </div>
</section>

<section class="sec">
  <div class="wrap guia">
    <nav class="guia__ind" aria-label="Contenido de la guía">
      <b>En esta guía</b>
      <ol>${g.ind.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join("")}</ol>
    </nav>
    <div class="prose guia__cuerpo">
      ${g.cuerpo}

      <h2 id="fuentes">De dónde sale lo que dice esta guía</h2>
      <dl class="guia__fuentes">
        ${g.fuentes.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}
      </dl>
      <p class="guia__meta">Si algún dato cambia o encontrás algo que no coincide con
      lo que te dijimos en el local, escribinos y lo corregimos.</p>

      <div class="guia__cta">
        <h3>¿Seguimos por acá?</h3>
        <div class="acts">
          <a class="btn btn--p" href="/test-ride">Reservar un test ride sin cargo</a>
          <a class="btn btn--g" href="/productos">Comparar los ${P.length} modelos</a>
          <a class="btn btn--wa" href="${WA_TXT("Hola MC Ebikes, leí la guía de cómo elegir y quiero hacer una consulta.")}" target="_blank" rel="noopener">${waIcon} Consultar</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

/* El hub */
const guiasHub = `
<section class="phero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Ruta">
      <a href="/">Inicio</a> / <span aria-current="page">Guías</span>
    </nav>
    <span class="kick">Guías y respuestas</span>
    <h1>Cómo decidir, explicado</h1>
    <p>Lo que preguntan todos antes de comprar, contestado sin apuro y sin vender.
    Cada guía dice de dónde sale lo que afirma y qué parte todavía hay que probar.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="guias-lista">
      ${GUIAS.map((g) => `
      <a class="guia-card rv" href="/${g.slug}">
        <span class="kick">${g.kicker}</span>
        <h2 class="h3">${g.h1}</h2>
        <p>${g.lead}</p>
        <span class="guia-card__pie">Actualizada el ${fecha_es(ACTUALIZADO)} ${ico(I.arrow, 2.2)}</span>
      </a>`).join("")}
      <div class="guia-card guia-card--proxima">
        <span class="kick kick--plain">En preparación</span>
        <h2 class="h3">Seguridad y condiciones de uso en Argentina</h2>
        <p>Qué mirar antes de circular, y qué depende de la clasificación del vehículo y de
        la jurisdicción. No la publicamos hasta tener la revisión legal hecha: preferimos no
        contestar antes que contestar mal.</p>
      </div>
      <div class="guia-card guia-card--proxima">
        <span class="kick kick--plain">En preparación</span>
        <h2 class="h3">Pruebas, clientes y taller</h2>
        <p>Nuestras pruebas de autonomía con fecha y condiciones, y las historias de quienes
        ya la están usando. Sale cuando tengamos los casos reales y su autorización: no
        inventamos testimonios.</p>
      </div>
    </div>
  </div>
</section>
${ctaBlock("¿Tenés una pregunta que no está acá?", "Escribinos y te la contestamos. Si le sirve a alguien más, la sumamos como guía.")}`;

writeFileSync(new URL("./guias.html", import.meta.url), page({
  slug: "guias", active: "guias",
  title: "Guías y respuestas | MC Ebikes",
  desc: "Cómo elegir una e-bike para el campo, qué cambia la autonomía real y cómo se cuida la batería. Guías escritas por MC Ebikes, con las fuentes a la vista.",
  ld: crumbLD("Guías", "guias"),
  main: guiasHub,
}));
console.log("✓ guias.html");

GUIAS.forEach((g) => {
  writeFileSync(new URL(`./${g.slug}.html`, import.meta.url), page({
    slug: g.slug, active: "guias",
    title: g.title, desc: g.desc,
    ld: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [JSON.parse(crumbLD(g.kicker, g.slug)), {
        "@type": "Article",
        headline: g.h1,
        description: g.desc,
        inLanguage: "es-AR",
        datePublished: g.fecha,
        dateModified: g.fecha,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/${g.slug}` },
        author: { "@type": "Organization", name: "MC Ebikes", url: SITE + "/" },
        publisher: { "@type": "Organization", name: "MC Ebikes", url: SITE + "/" },
      }],
    }, null, 1),
    main: guiaPage(g),
  }));
  console.log("✓ " + g.slug + ".html");
});

/* ---------- Manifest, sitemap, robots ---------- */
writeFileSync(new URL("./site.webmanifest", import.meta.url), JSON.stringify({
  name: "MC Ebikes", short_name: "MC Ebikes",
  description: "Fat e-bikes de 1000W en zona oeste.",
  start_url: "/", display: "standalone", background_color: "#14161A", theme_color: "#14161A",
  icons: [{ src: "assets/img/icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "assets/img/icon-512.png", sizes: "512x512", type: "image/png" }],
}, null, 2));

const urls = [["", "1.0"], ["productos", "0.9"], ["test-ride", "0.9"], ["servicio", "0.8"],
["nosotros", "0.7"], ["faq", "0.7"], ["contacto", "0.8"],
["privacidad", "0.3"], ["terminos", "0.3"], ["envios", "0.5"],
["guias", "0.8"], ...GUIAS.map((g) => [g.slug, "0.7"]),
...P.map((p) => [p.slug, "0.9"])];
const today = new Date().toISOString().slice(0, 10);
writeFileSync(new URL("./sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([u, p]) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join("\n") +
  `\n</urlset>`);
writeFileSync(new URL("./robots.txt", import.meta.url), `User-agent: *\nAllow: /\nDisallow: /propuestas/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("✓ sitemap.xml + robots.txt + manifest");
console.log("\nBuild completo — " + (7 + P.length) + " páginas");
