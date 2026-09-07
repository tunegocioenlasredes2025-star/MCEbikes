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

  /* Eleccion de un modelo desde cualquier listado */
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href$='-pro'], a[href$='/v40']");
    if (!a || a.closest(".hdr") || a.closest(".ftr")) return;
    var slug = a.getAttribute("href").replace(/^\//, "");
    track("select_product", {
      modelo: slug,
      origen: a.closest(".m") ? "linea de modelos"
        : a.closest(".pc") ? "tarjeta de catalogo"
        : a.closest("#calc-rec") ? "recomendador"
        : "enlace de texto",
    });
  });

  /* Telefono y mapa: intencion de visita al local */
  doc.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("a[href^='tel:']");
    if (t) { track("phone_click", { pagina: doc.body.dataset.pagina }); return; }
    var m = e.target.closest && e.target.closest("a[href*='maps.'], a[href*='/maps'], a[href*='goo.gl/maps']");
    if (m) track("map_click", { pagina: doc.body.dataset.pagina });
  });

  /* Posventa: una consulta que sale de la pagina de service */
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a || doc.body.dataset.pagina !== "servicio") return;
    track("service_request", { tipo: "consulta por WhatsApp", modelo: fichaModelo || "" });
  });

  /* qualified_lead NO se dispara desde el sitio.
     El plan de medicion es explicito: un clic de WhatsApp no se cuenta como
     oportunidad real. El evento lo activa quien califica el contacto, desde
     el CRM o a mano, llamando a esta funcion con los criterios cumplidos. */
  win.mcLeadCalificado = function (datos) { track("qualified_lead", datos || {}); };

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

  /* Reveal
     Ademas de los bloques .rv entran la linea de ruta del kicker y las
     marcas de encuadre de las ventanas de imagen: son los tres gestos de
     la direccion elegida y comparten el mismo observador. La estrategia
     pide revelado suave y desplazamientos minimos, nada de parallax. */
  var rv = doc.querySelectorAll(".rv,.kick,.marco");
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

  /* Barra de progreso de lectura */
  var prog = doc.querySelector(".prog");
  if (prog) {
    addEventListener("scroll", function () {
      var h = doc.documentElement.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
    }, { passive: true });
  }

  /* Franja de datos: los numeros cuentan una sola vez al aparecer.
     Se conserva el texto original y solo se reemplaza la cifra, para que
     "110 km" o "32 km/h" no pierdan la unidad durante la animacion. */
  var nums = doc.querySelectorAll("[data-num]");
  if (nums.length && !reduced && "IntersectionObserver" in window) {
    var contar = function (el) {
      var txt = el.textContent, m = txt.match(/[0-9.]+/);
      if (!m) return;
      var fin = parseFloat(m[0].replace(".", "")), ini = performance.now(), dur = 900;
      var paso = function (t) {
        var k = Math.min((t - ini) / dur, 1);
        if (k >= 1) {
          /* al terminar se restituye el texto original: la cifra escrita
             es un dato tecnico ("1000W", no "1.000W") y el separador de
             miles del formato local lo estaba alterando. */
          el.textContent = txt;
          return;
        }
        var v = Math.round(fin * (1 - Math.pow(1 - k, 3)));
        el.textContent = txt.replace(m[0], v.toLocaleString("es-AR"));
        requestAnimationFrame(paso);
      };
      el.textContent = txt.replace(m[0], "0");
      requestAnimationFrame(paso);
    };
    var ioN = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { contar(e.target); ioN.unobserve(e.target); } });
    }, { threshold: .6 });
    nums.forEach(function (e) { ioN.observe(e); });
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

  /* =====================================================================
     RECOMENDADOR Y CALCULADORA
     El hallazgo 13 del panel pedia "una herramienta para llevar uso, peso y
     recorrido a una recomendacion". La cuenta parte de la autonomia que
     publica el proveedor, la ajusta por terreno y carga, y exige un margen
     del 30% para no recomendar un modelo que llegue justo. Los numeros se
     presentan como estimacion, nunca como promesa: la regla de seguridad
     comercial de la estrategia pide que un dato sin fuente vigente no
     aparezca como promesa principal.
     ===================================================================== */
  var calc = doc.querySelector("#calc");
  if (calc) {
    var km = calc.querySelector("#km");
    var terreno = calc.querySelector("#terreno");
    var carga = calc.querySelector("#carga");
    var salida = doc.querySelector("#calc-rec");
    var oAhorro = calc.querySelector("#o-ahorro");
    var oCargas = calc.querySelector("#o-cargas");
    var oAnual = calc.querySelector("#o-anual");

    /* Los modelos los publica la pagina; la fuente sigue siendo build.mjs */
    var MOD = [];
    try {
      var crudo = doc.querySelector("#modelos");
      if (crudo) MOD = JSON.parse(crudo.textContent);
    } catch (e) { MOD = []; }
    MOD.sort(function (a, b) { return a.aut - b.aut; });

    var COSTO_REF = 75;      // AR$ por km de un vehiculo de referencia
    var COSTO_CARGA = 180;   // AR$ una carga completa
    var KM_CARGA = 60;       // km que rinde una carga
    var MARGEN = 1.3;        // no se recomienda un modelo que llegue justo

    var pesos = function (n) { return "$" + Math.round(n).toLocaleString("es-AR"); };

    function recomendar(diarios, fT, fC) {
      var elegido = null;
      for (var i = 0; i < MOD.length; i++) {
        var real = Math.round(MOD[i].aut * fT * fC);
        if (real >= diarios * MARGEN) { elegido = MOD[i]; elegido._real = real; break; }
      }
      if (!elegido && MOD.length) {
        /* Ninguno llega con margen: se muestra el de mayor autonomia y se
           dice que conviene consultarlo, en vez de forzar una venta. */
        elegido = MOD[MOD.length - 1];
        elegido._real = Math.round(elegido.aut * fT * fC);
        elegido._corto = true;
      }
      return elegido;
    }

    function run() {
      var d = Math.max(0, +km.value || 0);
      var fT = parseFloat(terreno.value) || 1;
      var fC = parseFloat(carga.value) || 1;

      /* --- ahorro --- */
      var mes = d * 22;
      var cargas = mes / KM_CARGA;
      var ahorro = Math.max(0, mes * COSTO_REF - cargas * COSTO_CARGA);
      oAhorro.textContent = pesos(ahorro);
      oCargas.textContent = Math.round(cargas);
      oAnual.textContent = pesos(ahorro * 12);

      /* --- recomendacion --- */
      if (!salida) return;
      if (!d || !MOD.length) { salida.innerHTML = ""; salida.classList.remove("on"); return; }
      var m = recomendar(d, fT, fC);
      if (!m) { salida.innerHTML = ""; salida.classList.remove("on"); return; }

      var detalle = m._corto
        ? "Con ese recorrido y esas condiciones ningún modelo te deja el margen que nos gusta dejar. Es la que más autonomía tiene de la línea: escribinos y lo vemos juntos antes de que decidas."
        : "Con ese recorrido te quedan unos " + Math.max(0, m._real - d) + " km de margen por carga, que es lo que buscamos para que no vuelvas justo.";
      var aviso = m.revision
        ? '<span class="calc__aviso">La ficha técnica de este modelo está en confirmación con el fabricante.</span>'
        : "";

      salida.innerHTML =
        '<span class="calc__k">Para tu recorrido</span>' +
        '<b>' + m.name + '</b>' +
        '<span class="calc__uso">' + m.rec + '</span>' +
        '<p>Estimamos unos <b>' + m._real + ' km por carga</b> en tu terreno y con tu carga, sobre los ' +
        m.aut + ' km publicados. ' + detalle + '</p>' + aviso +
        '<a class="btn btn--p btn--sm" href="/' + m.slug + '">Ver la ficha de la ' + m.name + '</a>' +
        '<a class="btn btn--g btn--sm" href="/test-ride?m=' + m.slug + '">Probarla</a>';
      salida.classList.add("on");
      return m;
    }

    var usada = false;
    [km, terreno, carga].forEach(function (el) {
      if (!el) return;
      var handler = function () {
        var m = run();
        if (!usada) {
          usada = true;
          track("use_savings_calculator", {
            km_por_dia: +km.value || 0,
            terreno: terreno.options[terreno.selectedIndex].text,
            carga: carga.options[carga.selectedIndex].text,
            recomendado: m ? m.name : "",
          });
        }
      };
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    });
    run();
  }

  /* FAQ */
  doc.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var i = q.closest(".faq__i"), a = i.querySelector(".faq__a");
      var open = i.classList.toggle("on");
      /* Solo la pregunta, nunca la respuesta completa: la respuesta puede
         traer datos que no hacen falta en la analitica. */
      if (open) track("faq_expand", { pregunta: (q.textContent || "").trim().slice(0, 90) });
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
  });

  /* Inicio de un test ride: la primera vez que la persona toca el formulario */
  var fTest = doc.querySelector("#f-test");
  if (fTest) {
    var arranco = false;
    fTest.addEventListener("input", function () {
      if (arranco) return;
      arranco = true;
      var m = fTest.elements["modelo"];
      track("test_ride_start", {
        modelo: m ? m.value : "",
        pagina: doc.body.dataset.pagina,
      });
    }, true);
  }

  /* Formularios → WhatsApp */
  function wire(sel, build) {
    var f = doc.querySelector(sel);
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var g = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ""; };
      track("formulario_enviado", { formulario: sel.replace("#f-", ""), modelo: g("modelo") || fichaModelo || "" });
      var texto = build(g, f);
      open("https://wa.me/" + WA + "?text=" + encodeURIComponent(texto), "_blank");
      var ok = f.querySelector(".ok");
      if (ok) {
        ok.classList.add("on");
        /* T-29: si WhatsApp no abre (escritorio sin la app, bloqueador, o
           el navegador de una red social) la persona tiene que poder mandar
           el mismo mensaje igual. La alternativa aparece siempre, asi no
           depende de detectar algo que el navegador no informa. */
        var alt = f.querySelector(".ok__alt");
        if (!alt) {
          alt = doc.createElement("div");
          alt.className = "ok__alt";
          alt.innerHTML =
            "¿No se abrió WhatsApp? Mandanos el mismo mensaje por mail " +
            '<a href="mailto:' + (doc.documentElement.dataset.mail || "") +
            "?subject=" + encodeURIComponent("Consulta desde la web") +
            "&body=" + encodeURIComponent(texto) + '">o copialo y pegalo donde quieras</a>.' +
            ' <button type="button" class="ok__copiar">Copiar el mensaje</button>';
          ok.appendChild(alt);
          alt.querySelector(".ok__copiar").addEventListener("click", function () {
            var b = this;
            var listo = function () { b.textContent = "Copiado"; };
            if (navigator.clipboard) navigator.clipboard.writeText(texto).then(listo, listo);
            else listo();
            track("copiar_mensaje", { formulario: sel.replace("#f-", "") });
          });
        }
      }
    });
  }
  /* El mensaje llega con el recorrido ya cargado: es el protocolo de
     calificacion del manual de WhatsApp, para que la conversacion no
     empiece de cero y el operador sepa que mostrar. */
  wire("#f-test", function (g) {
    return ["Hola MC Ebikes, quiero reservar un test ride.", "",
      "Nombre: " + g("nombre"),
      "Modelo que quiero probar: " + g("modelo"),
      g("dia") ? "Día preferido: " + g("dia") : "",
      g("localidad") ? "Localidad: " + g("localidad") : "",
      "", "Mi recorrido:",
      g("km") ? "· " + g("km") + " km por día, ida y vuelta" : "",
      g("terreno") ? "· Por dónde: " + g("terreno") : "",
      g("carga") ? "· Peso que llevo: " + g("carga") : "",
      g("guardado") ? "· Carga y guardado: " + g("guardado") : "",
      "",
      g("conductor") ? "Quién maneja: " + g("conductor") : "",
      g("adulto") ? "Adulto responsable: " + g("adulto") : "",
      g("mensaje") ? "" : "", g("mensaje") ? "Comentario: " + g("mensaje") : ""].filter(Boolean).join("\n");
  });

  /* El campo del adulto responsable aparece solo cuando hace falta */
  var quien = doc.querySelector("#t-q"), wrapAdulto = doc.querySelector("#t-adulto-wrap");
  if (quien && wrapAdulto) {
    quien.addEventListener("change", function () {
      var menor = quien.value.indexOf("menor") > -1;
      wrapAdulto.hidden = !menor;
      var inp = wrapAdulto.querySelector("input");
      if (inp) inp.required = menor;
    });
  }
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
