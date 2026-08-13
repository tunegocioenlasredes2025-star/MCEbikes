# MC Ebikes — E-commerce

Sitio de **MC Ebikes**, fat e-bikes de 1000W en Castelar, zona oeste del GBA.
Construido sobre el sistema visual del Brand Board (asfalto + ámbar señal, Teko + Barlow).

## Pendientes antes de publicar

Estos valores son **provisorios** y están centralizados arriba de `build.mjs`:

| Dato | Valor actual | Dónde |
|---|---|---|
| WhatsApp | `5491112345678` (placeholder) | `const WA` |
| Email | `hola@mcebikes.com.ar` | `const MAIL` |
| Dirección | "Castelar, Buenos Aires" (sin calle) | `const DIR` |
| Horarios | Lun a Vie 10-19 · Sáb 10-14 | `const HORARIO` |
| Dominio | `mcebikes.com.ar` | `const SITE` |
| Instagram | link vacío | `footer()` |
| **Precios** | estimados de mercado | array `P`, campo `price` |

Después de cambiarlos: `node build.mjs`.

## Stack

HTML estático + CSS + JS vanilla. Sin frameworks ni dependencias.

- Fuentes servidas localmente en woff2 (subset latin), con `preload` de las críticas.
- Imágenes en WebP, dos tamaños (`-sm` para cards, completa para hero y galería).
- Lazy loading en todo lo que no es above-the-fold.
- Cache busting automático: `?v=` con timestamp en cada build.

**Primera carga de la home: ~234 KB.**

## Estructura

```
index.html              Home
productos.html          Catálogo con filtros, orden y comparador
v20-pro.html            Ficha SW V20 Pro
v29-pro.html            Ficha SW V29 Pro
v40.html                Ficha SW V40
s20-pro.html            Ficha SW S20 Pro
test-ride.html          Reserva de test ride (conversión principal)
servicio.html           Service, garantía y repuestos
nosotros.html           Historia y forma de trabajo
faq.html                Preguntas frecuentes
contacto.html           Contacto + mapa
404.html
sitemap.xml · robots.txt · site.webmanifest · vercel.json
build.mjs               Generador: fuente única de header, footer y datos
```

## Desarrollo

```bash
python -m http.server 5620
```

Para regenerar las páginas después de tocar `build.mjs`:

```bash
node build.mjs
```

> Todo el HTML se genera desde `build.mjs`. No editar los `.html` a mano: se sobrescriben.

## Funcionalidades

- **Test ride**: formulario que arma el mensaje y abre WhatsApp.
- **Selector "¿cuál me conviene?"**: recomienda modelo según uso.
- **Calculadora de ahorro**: compara contra auto, colectivo o moto.
- **Comparador**: los 4 modelos lado a lado.
- **Filtros y orden** por categoría, precio y autonomía.

## Datos técnicos

Salen de las fichas del proveedor. Si cambian, se editan en el array `P` de `build.mjs`
y se propagan solos a cards, fichas, comparador y schema.
