# Plan de adaptación Teknalis sobre Aigocy

## Base usada
- Template principal: `Aigocy/index.html`.
- Estructura nueva: `teknalis-aigocy/`, sin modificar los archivos originales de `TeknalisTest`.
- Assets reales: `assets-teknalis/` para logos y mockups de proyectos.

## Secciones mapeadas
1. Header / navegación: header original `tf-header header2`, simplificado a anclas internas.
2. Hero: `section-hero`, adaptado al mensaje principal de Teknalis.
3. Servicios: `section-services` con accordion original y cuatro servicios reales.
4. Proceso de trabajo: `section-process` con slider/cards del template.
5. Casos / proyectos: `section-featured-works` con mockups de `assets-teknalis`.
6. Diferencial: `section-benefits` + estilo de cards existente para explicar el enfoque de Teknalis.
7. CTA final: bloque propio con clases/botones del template.
8. Contacto: `section-contact`, formulario visual sin backend.
9. Footer: footer original simplificado.

## Secciones eliminadas
- Partners/logos demo, testimonios, equipo, pricing, blog, selector de color y páginas internas demo.

## Criterios visuales
- Reemplazar paleta Aigocy por branding Teknalis: `#0F172A`, `#0EA5E9`, `#06B6D4`, `#F1F5F9`, `#FFFFFF`.
- Mantener grillas, cards, animaciones `effectFade`, accordion, swiper y responsive del template.
- Usar Manrope si está disponible mediante Google Fonts, con fallback sans-serif.
