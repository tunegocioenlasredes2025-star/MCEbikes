/* MC EBIKES — app.js */
(function () {
  "use strict";
  var doc = document, body = doc.body;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA = doc.documentElement.dataset.wa || "";
  var win = window;

  /* =====================================================================
     MEDICION
     La auditoria pedia poder saber si el trafico genera conversaciones o
     solo visitas. Cada evento se empuja al dataLayer, que es el formato que
     leen tanto Google Analytics como Tag Manager: el dia que carguen la
     cuenta, el historial de eventos ya esta instrumentado y no hay que
     tocar nada aca. Sin cuenta configurada no se carga ningun script de
     terceros ni se deja ninguna cookie.
     ===================================================================== */
  win.dataLayer = win.dataLayer || [];
  function track(evento, datos) {
    var d = datos || {};
    d.event = evento;
    d.pagina = doc.body.dataset.pagina || location.pathname;
    win.dataLayer.push(d);
    if (typeof win.gtag === "function") win.gtag("event", evento, d);
  }

  /* Ficha de producto vista */
  var fichaModelo = doc.body.dataset.modelo;
  if (fichaModelo) track("ver_modelo", { modelo: fichaModelo });

  /* Cualquier salida a WhatsApp, con el lugar desde donde se hizo clic */
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    var origen = a.classList.contains("fab") ? "boton flotante"
      : a.closest(".ftr") ? "pie"
      : a.closest(".hdr") ? "barra"
      : a.closest(".cta") ? "cierre"
      : "cuerpo";
    track("whatsapp", { origen: origen, modelo: fichaModelo || "" });
  });

  /* Comparador y filtros del catalogo */
  doc.querySelectorAll(".chip[data-f]").forEach(function (c) {
    c.addEventListener("click", function () { track("filtrar_catalogo", { filtro: c.dataset.f }); });
  });
  var selOrden = doc.querySelector("[data-sort]");
  if (selOrden) selOrden.addEventListener("change", function () {
    track("ordenar_catalogo", { orden: selOrden.value });
  });


  /* Header */
  var hdr = doc.querySelector(".hdr");
  function onScroll() { if (hdr) hdr.classList.toggle("solid", scrollY > 30); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Menú móvil */
  var burger = doc.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("menu");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      body.style.overflow = open ? "hidden" : "";
    });
    doc.querySelectorAll(".mnav a").forEach(function (a) {
      a.addEventListener("click", function () {
        body.classList.remove("menu"); body.style.overflow = "";
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Reveal */
  var rv = doc.querySelectorAll(".rv");
  if (rv.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      rv.forEach(function (e) { e.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: .1, rootMargin: "0px 0px -6% 0px" });
      rv.forEach(function (e) { io.observe(e); });
    }
  }

  /* Galería de producto */
  var thumbs = doc.querySelectorAll(".gal__thumbs button");
  var main = doc.querySelector(".gal__main img");
  thumbs.forEach(function (b) {
    b.addEventListener("click", function () {
      var full = b.dataset.full;
      if (main && full) { main.src = full; main.alt = b.querySelector("img").alt; }
      thumbs.forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
    });
  });

  /* Filtros de catálogo */
  var chips = doc.querySelectorAll(".chip[data-f]");
  var cards = doc.querySelectorAll("[data-cat]");
  var counter = doc.querySelector("[data-count]");
  var sorter = doc.querySelector("[data-sort]");
  var current = "todos";

  function apply() {
    var n = 0;
    cards.forEach(function (c) {
      var ok = current === "todos" || (c.dataset.cat || "").split(" ").indexOf(current) > -1;
      c.style.display = ok ? "" : "none";
      if (ok) n++;
    });
    if (counter) counter.textContent = n + (n === 1 ? " modelo" : " modelos");
  }
  chips.forEach(function (ch) {
    ch.addEventListener("click", function () {
      chips.forEach(function (x) { x.classList.remove("on"); });
      ch.classList.add("on");
      current = ch.dataset.f;
      apply();
    });
  });
  if (sorter) {
    sorter.addEventListener("change", function () {
      var grid = doc.querySelector(".grid-p");
      if (!grid) return;
      var arr = Array.prototype.slice.call(grid.children);
      var v = sorter.value;
      arr.sort(function (a, b) {
        var pa = +a.dataset.price || 0, pb = +b.dataset.price || 0;
        var aa = +a.dataset.aut || 0, ab = +b.dataset.aut || 0;
        if (v === "precio-asc") return pa - pb;
        if (v === "precio-desc") return pb - pa;
        if (v === "autonomia") return ab - aa;
        return (+a.dataset.ord || 0) - (+b.dataset.ord || 0);
      });
      arr.forEach(function (el) { grid.appendChild(el); });
    });
  }
  if (cards.length) apply();

  /* Selector "cuál me conviene" */
  var quiz = doc.querySelectorAll(".quiz button[data-rec]");
  var quizRes = doc.querySelector(".quiz-res");
  quiz.forEach(function (b) {
    b.addEventListener("click", function () {
      if (!quizRes) return;
      quizRes.innerHTML = '<b>' + b.dataset.rec + '</b><p>' + b.dataset.why +
        '</p><a class="btn btn--p btn--sm" style="margin-top:14px" href="' + b.dataset.url + '">Ver ficha completa</a>';
      quizRes.classList.add("on");
      track("elegir_recorrido", { recorrido: b.querySelector("b").textContent, recomendado: b.dataset.rec });
      quizRes.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
    });
  });

  /* Calculadora de ahorro */
  var calc = doc.querySelector("#calc");
  if (calc) {
    var km = calc.querySelector("#km");
    var oAhorro = calc.querySelector("#o-ahorro"), oCargas = calc.querySelector("#o-cargas"), oAnual = calc.querySelector("#o-anual");
    // costo de combustible por km de un vehiculo de referencia (AR$).
    // Antes se elegia entre auto, colectivo y moto; el selector se saco para
    // que la marca deje de compararse con una moto.
    var COSTO_REF = 75;
    var COSTO_CARGA = 180;   // AR$ por carga completa
    var KM_CARGA = 60;       // km por carga
    function run() {
      var d = Math.max(0, +km.value || 0);
      var mes = d * 22;                       // días hábiles
      var gasto = mes * COSTO_REF;
      var cargas = mes / KM_CARGA;
      var costoLuz = cargas * COSTO_CARGA;
      var ahorro = Math.max(0, gasto - costoLuz);
      oAhorro.textContent = "$" + Math.round(ahorro).toLocaleString("es-AR");
      oCargas.textContent = Math.round(cargas);
      oAnual.textContent = "$" + Math.round(ahorro * 12).toLocaleString("es-AR");
    }
    var calcUsada = false;
    [km].forEach(function (el) { if (el) {
      el.addEventListener("input", function () { run(); if (!calcUsada) { calcUsada = true; track("usar_calculadora"); } });
      el.addEventListener("change", run);
    } });
    run();
  }

  /* FAQ */
  doc.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var i = q.closest(".faq__i"), a = i.querySelector(".faq__a");
      var open = i.classList.toggle("on");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
  });

  /* Formularios → WhatsApp */
  function wire(sel, build) {
    var f = doc.querySelector(sel);
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var g = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ""; };
      track("formulario_enviado", { formulario: sel.replace("#f-", ""), modelo: g("modelo") || fichaModelo || "" });
      var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(build(g, f));
      open(url, "_blank");
      var ok = f.querySelector(".ok"); if (ok) ok.classList.add("on");
    });
  }
  wire("#f-test", function (g) {
    return ["Hola MC Ebikes, quiero reservar un test ride.", "",
      "Nombre: " + g("nombre"),
      "Modelo que quiero probar: " + g("modelo"),
      g("dia") ? "Día preferido: " + g("dia") : "",
      g("mensaje") ? "Comentario: " + g("mensaje") : ""].filter(Boolean).join("\n");
  });
  wire("#f-contacto", function (g) {
    return ["Hola MC Ebikes,", "",
      "Nombre: " + g("nombre"),
      g("email") ? "Email: " + g("email") : "",
      g("telefono") ? "Teléfono: " + g("telefono") : "",
      "Consulta: " + g("mensaje")].filter(Boolean).join("\n");
  });

  /* Año */
  doc.querySelectorAll("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
