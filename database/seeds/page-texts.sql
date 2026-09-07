-- Textos iniciales extraídos de la página pública de Simbionte Joyas.
-- Este seed es idempotente: puede ejecutarse nuevamente para sincronizar
-- el contenido existente sin duplicar filas.

INSERT INTO public.page_texts (
  content_key,
  locale,
  page_key,
  section_key,
  admin_label,
  content,
  content_format,
  status,
  sort_order
)
VALUES
  (
    'home.seo.title',
    'es-CL',
    'home',
    'seo',
    'SEO · título',
    'Simbionte Joyas',
    'plain',
    'published',
    10
  ),
  (
    'home.seo.description',
    'es-CL',
    'home',
    'seo',
    'SEO · descripción',
    'Joyería de autor hecha a mano en Valdivia, Chile.',
    'plain',
    'published',
    20
  ),
  (
    'home.navigation.work',
    'es-CL',
    'home',
    'navigation',
    'Navegación · obra',
    'obra',
    'plain',
    'published',
    10
  ),
  (
    'home.navigation.about',
    'es-CL',
    'home',
    'navigation',
    'Navegación · sobre mí',
    'sobre mí',
    'plain',
    'published',
    20
  ),
  (
    'home.navigation.process',
    'es-CL',
    'home',
    'navigation',
    'Navegación · proceso',
    'proceso',
    'plain',
    'published',
    30
  ),
  (
    'home.navigation.contact',
    'es-CL',
    'home',
    'navigation',
    'Navegación · contacto',
    'contacto',
    'plain',
    'published',
    40
  ),
  (
    'home.hero.eyebrow',
    'es-CL',
    'home',
    'hero',
    'Portada · antetítulo',
    'Joyería de autor · hecha a mano',
    'plain',
    'published',
    10
  ),
  (
    'home.hero.title',
    'es-CL',
    'home',
    'hero',
    'Portada · título',
    $content$Fragmentos de un\
*paraíso.*$content$,
    'markdown',
    'published',
    20
  ),
  (
    'home.hero.description',
    'es-CL',
    'home',
    'hero',
    'Portada · descripción',
    'Piezas nacidas de la observación íntima del bosque valdiviano.',
    'plain',
    'published',
    30
  ),
  (
    'home.hero.cta',
    'es-CL',
    'home',
    'hero',
    'Portada · llamado a la acción',
    'Explorar la obra',
    'plain',
    'published',
    40
  ),
  (
    'home.hero.caption',
    'es-CL',
    'home',
    'hero',
    'Portada · texto lateral',
    $content$Valdivia, Chile\
Materia · memoria · forma$content$,
    'markdown',
    'published',
    50
  ),
  (
    'home.work.eyebrow',
    'es-CL',
    'home',
    'work',
    'Obra · antetítulo',
    'Obra',
    'plain',
    'published',
    10
  ),
  (
    'home.work.title',
    'es-CL',
    'home',
    'work',
    'Obra · título',
    'Pequeños *paisajes*, *texturas orgánicas* y *metales* que se encuentran para habitar el *cuerpo*.',
    'markdown',
    'published',
    20
  ),
  (
    'home.work.gallery_hint',
    'es-CL',
    'home',
    'work',
    'Obra · ayuda de galería',
    'Selecciona una imagen para verla en detalle.',
    'plain',
    'published',
    30
  ),
  (
    'home.about.eyebrow',
    'es-CL',
    'home',
    'about',
    'Sobre mí · antetítulo',
    'Sobre mí',
    'plain',
    'published',
    10
  ),
  (
    'home.about.title',
    'es-CL',
    'home',
    'about',
    'Sobre mí · título',
    $content$Soy *Claudia Lagos*,\
creadora de Simbionte Joyas.$content$,
    'markdown',
    'published',
    20
  ),
  (
    'home.about.body',
    'es-CL',
    'home',
    'about',
    'Sobre mí · cuerpo',
    'Vivo y creo en Valdivia, en la Región de Los Ríos, donde el bosque húmedo y la lluvia mantienen el paisaje en permanente transformación. Desde este territorio nacen las formas, materiales y memorias que dan vida a Simbionte.',
    'plain',
    'published',
    30
  ),
  (
    'home.process.eyebrow',
    'es-CL',
    'home',
    'process',
    'Proceso · antetítulo',
    'Proceso',
    'plain',
    'published',
    10
  ),
  (
    'home.process.title',
    'es-CL',
    'home',
    'process',
    'Proceso · título',
    'Del *paisaje* al *cuerpo*, cada pieza encuentra su *forma*.',
    'markdown',
    'published',
    20
  ),
  (
    'home.process.card-01-title',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 01 · título',
    'Cercanía con lo vivo',
    'plain',
    'published',
    110
  ),
  (
    'home.process.card-01-body',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 01 · cuerpo',
    'Hago joyas desde la cercanía con lo vivo.',
    'plain',
    'published',
    111
  ),
  (
    'home.process.card-02-title',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 02 · título',
    'Detener la mirada',
    'plain',
    'published',
    120
  ),
  (
    'home.process.card-02-body',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 02 · cuerpo',
    'Detengo la mirada en esos gestos mínimos del paisaje: una textura, un brote, una piedra. Simbionte es un modo de guardar esos encuentros y llevarlos cerca.',
    'plain',
    'published',
    121
  ),
  (
    'home.process.card-03-title',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 03 · título',
    'La voz de la materia',
    'plain',
    'published',
    130
  ),
  (
    'home.process.card-03-body',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 03 · cuerpo',
    'Trabajo lentamente, dejando que el metal, sus huellas y sus accidentes construyan una forma única. Cada pieza es una conversación entre el oficio y aquello que inspira.',
    'plain',
    'published',
    131
  ),
  (
    'home.process.card-04-title',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 04 · título',
    'Observar',
    'plain',
    'published',
    140
  ),
  (
    'home.process.card-04-body',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 04 · cuerpo',
    'Lo pequeño revela formas, texturas y ritmos que guían cada pieza.',
    'plain',
    'published',
    141
  ),
  (
    'home.process.card-05-title',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 05 · título',
    'Recoger',
    'plain',
    'published',
    150
  ),
  (
    'home.process.card-05-body',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 05 · cuerpo',
    'El paisaje del sur acompaña el imaginario de Simbionte.',
    'plain',
    'published',
    151
  ),
  (
    'home.process.card-06-title',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 06 · título',
    'Transformar',
    'plain',
    'published',
    160
  ),
  (
    'home.process.card-06-body',
    'es-CL',
    'home',
    'process',
    'Proceso · tarjeta 06 · cuerpo',
    'La materia cambia de escala para encontrar su lugar en el cuerpo.',
    'plain',
    'published',
    161
  ),
  (
    'home.contact.eyebrow',
    'es-CL',
    'home',
    'contact',
    'Contacto · antetítulo',
    'Piezas, encargos y novedades',
    'plain',
    'published',
    10
  ),
  (
    'home.contact.title',
    'es-CL',
    'home',
    'contact',
    'Contacto · título',
    'Hablemos.',
    'plain',
    'published',
    20
  ),
  (
    'home.contact.instagram-label',
    'es-CL',
    'home',
    'contact',
    'Contacto · etiqueta de Instagram',
    '@simbiontejoyas',
    'plain',
    'published',
    30
  ),
  (
    'home.footer.copyright-name',
    'es-CL',
    'home',
    'footer',
    'Pie · nombre de copyright',
    'Simbionte Joyas',
    'plain',
    'published',
    10
  ),
  (
    'home.footer.origin',
    'es-CL',
    'home',
    'footer',
    'Pie · origen',
    'De Valdivia',
    'plain',
    'published',
    20
  ),
  (
    'home.footer.credit',
    'es-CL',
    'home',
    'footer',
    'Pie · crédito',
    'por diegui.dev',
    'plain',
    'published',
    30
  ),
  (
    'home.footer.back-to-top',
    'es-CL',
    'home',
    'footer',
    'Pie · volver arriba',
    'Volver arriba',
    'plain',
    'published',
    40
  )
ON CONFLICT (content_key, locale)
DO UPDATE SET
  page_key = EXCLUDED.page_key,
  section_key = EXCLUDED.section_key,
  admin_label = EXCLUDED.admin_label,
  content = EXCLUDED.content,
  content_format = EXCLUDED.content_format,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

