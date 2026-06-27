# Resumen - Pagina Servicios Teknalis

## Contenido extraido de la pagina online

- URL fuente: `https://www.teknalis.com.ar/servicios`.
- Mensaje principal: soluciones tecnologicas para automatizar, vender mas y escalar procesos.
- Bajada principal: desarrollo de sitios web, e-commerce, automatizaciones e inteligencia artificial aplicada para empresas que quieren trabajar mejor.
- Servicios identificados:
  - Desarrollo web: sitios corporativos, landing pages, aplicaciones web, SEO tecnico.
  - E-commerce: tiendas online, catalogos, integraciones, pagos y consultas.
  - Automatizacion: Excel, documentos, reportes, procesos internos.
  - Consultoria Digital: diagnostico digital, plan de accion, herramientas, acompanamiento.
  - Marketing Digital: SEO, redes sociales, campanas, resultados medibles.
- Proceso de trabajo:
  - Diagnostico.
  - Diseno de solucion.
  - Desarrollo.
  - Implementacion.
  - Mejora continua.
- Tecnologias mencionadas:
  - Next.js, TypeScript, Tailwind, Vercel, Firebase, Cloudflare, WordPress, Shopify, OpenAI, Excel.
- Casos relacionados:
  - INAES: automatizacion documental.
  - Estudio Tonnelier: desarrollo web.
  - ET Consultores: sitio institucional.
- CTA:
  - Pedir diagnostico.
  - Hablar por WhatsApp.
  - Ver casos.

## Componentes reutilizados de la Home

- Header `tf-header header2` con logo real de Teknalis, navegacion y boton `Hablemos`.
- Footer simplificado con logo, enlaces y copyright.
- Menu mobile/offcanvas adaptado a la navegacion de Teknalis.
- Hero visual basado en `teknalis-hero`, con gradientes, isotipo y botones de la Home.
- Botones `tf-btn` y `tf-btn-2`.
- CTA final `teknalis-cta`.
- Bloque de contacto con imagen de marca y formulario.
- Paleta, tipografia Manrope, gradientes de texto y tratamiento de cards de `teknalis.css`.

## Componentes tomados del template

- Estructura de hero interno del template Aigocy.
- Acordeon amplio de servicios `accordion-faq_item style-1`.
- Tags `tags-item` para atributos de cada servicio.
- Slider/cards de proceso `section-process`, `process-card` y Swiper.
- Grillas responsive Bootstrap del template.
- Animaciones `effectFade`, `fadeUp`, `fadeRotateX`.
- Iconografia de Icomoon ya incluida por Aigocy.

## Secciones modificadas

- Se creo `servicios.html` como pagina independiente dentro de `teknalis-aigocy`.
- Se reemplazo el contenido demo del template por contenido real de la pagina online.
- Se adapto el header/footer para mantener continuidad con la Home nueva.
- Se agrego una seccion de alcance para agrupar servicios por necesidad de negocio.
- Se adapto el proceso online a cards del template con cinco pasos.
- Se agrego una seccion de tecnologias con tags del contenido online.
- Se agrego una seccion de casos relacionados con los tres casos destacados online.
- Se extendio `assets/css/teknalis.css` con estilos especificos para la pagina Servicios.

## Pendientes

- Definir si la ruta final debe publicarse como `/servicios`, `servicios.html` o integrarse en una app Next.js.
- Conectar el formulario a un backend real si se necesita envio sin abrir cliente de mail.
- Revisar URLs definitivas de casos internos si luego se crean paginas individuales.
- Validar el numero de WhatsApp y email finales antes de publicar.
