# Resumen - Blog Teknalis

## Contenido extraido de la web publicada

- URL principal: `https://www.teknalis.com.ar/blog`.
- Articulos publicados:
  - `5 tareas que tu PyME puede automatizar hoy mismo`.
  - `¿Cuanto cuesta una tienda online en Argentina?`.
  - `¿Por que tu empresa necesita un sitio web propio en 2026?`.
- Fechas y tiempos de lectura:
  - 10 de junio de 2026, 5 min de lectura.
  - 5 de junio de 2026, 6 min de lectura.
  - 1 de junio de 2026, 5 min de lectura.
- Categorias tematicas usadas para presentar el contenido:
  - Automatizacion.
  - E-commerce.
  - Desarrollo web.
- No se detecto paginacion necesaria porque hay 3 articulos publicados.

## Componentes reutilizados de la Home

- Header `tf-header header2` con logo real de Teknalis.
- Footer con navegacion, logo, claim y copyright.
- Menu mobile/offcanvas.
- Hero `teknalis-hero` con isotipo, paleta y tipografia de la Home.
- Botones `tf-btn` y `tf-btn-2`.
- CTA final `teknalis-cta`.
- Cards blancas con borde sutil, sombra y radios de 8px.
- Paleta Teknalis: slate, celeste, blanco y gris claro.

## Componentes tomados del template

- Estructura de blog con listado y sidebar, adaptada desde `blog-standard.html`.
- Lectura de articulo con metadatos, tags/relacionados y CTA, inspirada en `blog-single.html`.
- Animaciones `effectFade`.
- Iconografia de Icomoon.
- Grillas Bootstrap responsive.

## Secciones desarrolladas

- `blog.html`: pagina principal del Blog con hero, articulo destacado, tarjetas, categorias y listado lateral.
- `blog/automatizar-tareas-pyme.html`: articulo individual.
- `blog/cuanto-cuesta-una-tienda-online.html`: articulo individual.
- `blog/por-que-tu-empresa-necesita-sitio-web.html`: articulo individual.
- `assets/css/teknalis.css`: estilos del Blog y articulos.
- `index.html` y `servicios.html`: navegacion actualizada para incluir Blog.

## Pendientes

- Definir si las URLs finales deben publicarse como `/blog/slug` dentro de una app Next.js o mantenerse como HTML estatico.
- Agregar busqueda real solo si el Blog crece.
- Agregar paginacion cuando haya mas articulos.
- Confirmar si se quiere conservar tildes exactas en metadatos y titulos para produccion final.
