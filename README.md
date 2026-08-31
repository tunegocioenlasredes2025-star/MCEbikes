# MC Ebikes — E-commerce

Sitio de **MC Ebikes**, fat e-bikes de 1000W en Castelar, zona oeste del GBA.
Construido sobre el Manual de Marca v1.0 (Negro Carbón + Naranja Tierra, Archivo + Inter
+ Big Shoulders) y sobre la **dirección visual Editorial**, que es la propuesta 1 de las
cinco que se le presentaron al cliente y la que eligió.

La maqueta original de esa propuesta sigue viva en `/propuestas/elegida.html` como
referencia: es la fuente de la línea de ruta, las ventanas de imagen con epígrafe, la
franja de datos y el ritmo por capítulos numerados que ahora usan las catorce páginas.

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
| **Fotos de modelo** | ver abajo | `assets/img/` |

### Fotos de modelo: no coinciden con el nombre

Los archivos del proveedor están cruzados y ahora se ven a pantalla completa en la home,
así que se nota. Lo que dice el cuadro de cada bici en la foto:

| Archivo | Se usa para | Cuadro que se lee en la foto |
|---|---|---|
| `v20-negra.webp` | SW V20 Pro | **V40** |
| `v40-negra.webp` | SW V40 | **V29 PRO** |
| `s20-blanca.webp` | SW S20 Pro | **S30 PRO** |
| `v29-negra.webp` | SW V29 Pro | sin cartel, y es otro tipo de cuadro |

Hay que confirmarlo con el cliente antes de reasignarlas: puede ser que los archivos
estén mal nombrados o que el proveedor mande fotos de otro modelo. No se tocó nada.

Después de cambiarlos: `node build.mjs`.

## Stack

HTML estático + CSS + JS vanilla. Sin frameworks ni dependencias.

- Fuentes servidas localmente en woff2 (subset latin), con `preload` de las críticas.
- Imágenes en WebP, dos tamaños (`-sm` para cards, completa para hero y galería).
- Lazy loading en todo lo que no es above-the-fold.
- Cache busting automático: `?v=` con timestamp en cada build.

**Primera carga de la home: ~209 KB en teléfono, ~473 KB en desktop.** La diferencia es
el hero, que se sirve en tres tamaños (`-sm` 1000px, `-md` 1280px y completo 1600px) por
`srcset`, con el mismo `imagesrcset` declarado en el `preload` para que no se baje dos
veces. Las escenas están recortadas al tamaño real en el que se muestran.

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
- **Revelado editorial**: la línea de ruta crece al entrar, las ventanas de imagen abren
  sus marcas de encuadre, la franja cuenta sus números y una barra fina marca el avance
  de lectura. Todo se apaga con `prefers-reduced-motion`.
- **Calculadora de ahorro**: compara contra auto, colectivo o moto.
- **Comparador**: los 4 modelos lado a lado.
- **Filtros y orden** por categoría, precio y autonomía.

## Datos técnicos

Salen de las fichas del proveedor. Si cambian, se editan en el array `P` de `build.mjs`
y se propagan solos a cards, fichas, comparador y schema.
