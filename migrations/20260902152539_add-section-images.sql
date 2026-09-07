-- Relaciona fotografías de ImageKit con ubicaciones concretas de una página.
-- La escritura ocurre sólo desde las rutas administrativas de servidor;
-- el público únicamente puede resolver imágenes publicadas.

CREATE TABLE public.section_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL DEFAULT 'home',
  section_key text NOT NULL,
  slot_key text NOT NULL DEFAULT 'default',
  position integer NOT NULL DEFAULT 0,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT section_images_page_key_format_check CHECK (
    page_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'
  ),
  CONSTRAINT section_images_section_key_format_check CHECK (
    section_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'
  ),
  CONSTRAINT section_images_slot_key_format_check CHECK (
    slot_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'
  ),
  CONSTRAINT section_images_position_check CHECK (position >= 0),
  CONSTRAINT section_images_slot_position_unique UNIQUE (
    page_key,
    section_key,
    slot_key,
    position
  )
);

CREATE INDEX section_images_lookup_idx
  ON public.section_images (page_key, section_key, slot_key, position);

CREATE INDEX section_images_image_idx
  ON public.section_images (image_id);

ALTER TABLE public.section_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY section_images_public_read
ON public.section_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.images
    WHERE images.id = section_images.image_id
      AND images.status = 'published'
  )
);

GRANT SELECT ON public.section_images TO anon, authenticated;
