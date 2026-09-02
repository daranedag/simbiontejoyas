-- Generated 2026-09-02T15:40:50.709Z
BEGIN;

-- ===== MIGRATION =====
-- [MIGRATION] migration system.20260820212804 (add)
-- Migration 20260820212804: create-content-model
CREATE TABLE IF NOT EXISTS public.page_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL,
  locale text NOT NULL DEFAULT 'es-CL',
  page_key text NOT NULL DEFAULT 'home',
  section_key text NOT NULL,
  admin_label text NOT NULL,
  content text NOT NULL DEFAULT '',
  content_format text NOT NULL DEFAULT 'plain',
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT page_texts_content_key_locale_unique UNIQUE (content_key, locale),
  CONSTRAINT page_texts_content_key_format_check CHECK (
    content_key ~ '^[a-z0-9]+([._-][a-z0-9]+)*$'
  ),
  CONSTRAINT page_texts_page_key_format_check CHECK (
    page_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'
  ),
  CONSTRAINT page_texts_section_key_format_check CHECK (
    section_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'
  ),
  CONSTRAINT page_texts_content_format_check CHECK (
    content_format IN ('plain', 'markdown')
  ),
  CONSTRAINT page_texts_status_check CHECK (
    status IN ('draft', 'published', 'archived')
  ),
  CONSTRAINT page_texts_sort_order_check CHECK (sort_order >= 0)
);
CREATE TABLE IF NOT EXISTS public.images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'imagekit',
  provider_file_id text NOT NULL,
  provider_file_path text,
  file_name text NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  mime_type text,
  width integer,
  height integer,
  file_size_bytes bigint,
  title text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT images_provider_file_unique UNIQUE (provider, provider_file_id),
  CONSTRAINT images_provider_not_blank_check CHECK (btrim(provider) <> ''),
  CONSTRAINT images_provider_file_id_not_blank_check CHECK (
    btrim(provider_file_id) <> ''
  ),
  CONSTRAINT images_file_name_not_blank_check CHECK (btrim(file_name) <> ''),
  CONSTRAINT images_url_https_check CHECK (url ~ '^https://'),
  CONSTRAINT images_thumbnail_url_https_check CHECK (
    thumbnail_url IS NULL OR thumbnail_url ~ '^https://'
  ),
  CONSTRAINT images_width_check CHECK (width IS NULL OR width > 0),
  CONSTRAINT images_height_check CHECK (height IS NULL OR height > 0),
  CONSTRAINT images_file_size_check CHECK (
    file_size_bytes IS NULL OR file_size_bytes >= 0
  ),
  CONSTRAINT images_status_check CHECK (
    status IN ('draft', 'published', 'archived')
  )
);
CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT collections_name_not_blank_check CHECK (btrim(name) <> ''),
  CONSTRAINT collections_slug_format_check CHECK (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  CONSTRAINT collections_status_check CHECK (
    status IN ('draft', 'published', 'archived')
  ),
  CONSTRAINT collections_sort_order_check CHECK (sort_order >= 0),
  CONSTRAINT collections_published_at_check CHECK (
    status <> 'published' OR published_at IS NOT NULL
  )
);
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT projects_name_not_blank_check CHECK (btrim(name) <> ''),
  CONSTRAINT projects_slug_format_check CHECK (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  CONSTRAINT projects_status_check CHECK (
    status IN ('draft', 'published', 'archived')
  ),
  CONSTRAINT projects_sort_order_check CHECK (sort_order >= 0),
  CONSTRAINT projects_published_at_check CHECK (
    status <> 'published' OR published_at IS NOT NULL
  )
);
CREATE TABLE IF NOT EXISTS public.collection_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT collection_images_image_unique UNIQUE (collection_id, image_id),
  CONSTRAINT collection_images_position_check CHECK (position >= 0)
);
CREATE TABLE IF NOT EXISTS public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT project_images_image_unique UNIQUE (project_id, image_id),
  CONSTRAINT project_images_position_check CHECK (position >= 0)
);
CREATE INDEX IF NOT EXISTS page_texts_public_order_idx
  ON public.page_texts (page_key, section_key, sort_order)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS images_public_idx
  ON public.images (created_at DESC)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS collections_public_order_idx
  ON public.collections (sort_order, published_at DESC)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS projects_public_order_idx
  ON public.projects (sort_order, published_at DESC)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS collection_images_order_idx
  ON public.collection_images (collection_id, position, id);
CREATE INDEX IF NOT EXISTS collection_images_image_idx
  ON public.collection_images (image_id);
CREATE UNIQUE INDEX IF NOT EXISTS collection_images_one_cover_idx
  ON public.collection_images (collection_id)
  WHERE is_cover;
CREATE INDEX IF NOT EXISTS project_images_order_idx
  ON public.project_images (project_id, position, id);
CREATE INDEX IF NOT EXISTS project_images_image_idx
  ON public.project_images (image_id);
CREATE UNIQUE INDEX IF NOT EXISTS project_images_one_cover_idx
  ON public.project_images (project_id)
  WHERE is_cover;
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS page_texts_set_updated_at ON public.page_texts;
CREATE TRIGGER page_texts_set_updated_at
BEFORE UPDATE ON public.page_texts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS images_set_updated_at ON public.images;
CREATE TRIGGER images_set_updated_at
BEFORE UPDATE ON public.images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS collections_set_updated_at ON public.collections;
CREATE TRIGGER collections_set_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS projects_set_updated_at ON public.projects;
CREATE TRIGGER projects_set_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.page_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS page_texts_public_read ON public.page_texts;
CREATE POLICY page_texts_public_read
ON public.page_texts
FOR SELECT
TO anon, authenticated
USING (status = 'published');
DROP POLICY IF EXISTS images_public_read ON public.images;
CREATE POLICY images_public_read
ON public.images
FOR SELECT
TO anon, authenticated
USING (status = 'published');
DROP POLICY IF EXISTS collections_public_read ON public.collections;
CREATE POLICY collections_public_read
ON public.collections
FOR SELECT
TO anon, authenticated
USING (status = 'published');
DROP POLICY IF EXISTS projects_public_read ON public.projects;
CREATE POLICY projects_public_read
ON public.projects
FOR SELECT
TO anon, authenticated
USING (status = 'published');
DROP POLICY IF EXISTS collection_images_public_read ON public.collection_images;
CREATE POLICY collection_images_public_read
ON public.collection_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.collections
    WHERE collections.id = collection_images.collection_id
      AND collections.status = 'published'
  )
  AND EXISTS (
    SELECT 1
    FROM public.images
    WHERE images.id = collection_images.image_id
      AND images.status = 'published'
  )
);
DROP POLICY IF EXISTS project_images_public_read ON public.project_images;
CREATE POLICY project_images_public_read
ON public.project_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.projects
    WHERE projects.id = project_images.project_id
      AND projects.status = 'published'
  )
  AND EXISTS (
    SELECT 1
    FROM public.images
    WHERE images.id = project_images.image_id
      AND images.status = 'published'
  )
);
GRANT SELECT ON public.page_texts TO anon, authenticated;
GRANT SELECT ON public.images TO anon, authenticated;
GRANT SELECT ON public.collections TO anon, authenticated;
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT SELECT ON public.collection_images TO anon, authenticated;
GRANT SELECT ON public.project_images TO anon, authenticated;
INSERT INTO "system"."custom_migrations" ("version", "name", "statements", "created_at") VALUES ('20260820212804', 'create-content-model', ARRAY['CREATE TABLE IF NOT EXISTS public.page_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL,
  locale text NOT NULL DEFAULT ''es-CL'',
  page_key text NOT NULL DEFAULT ''home'',
  section_key text NOT NULL,
  admin_label text NOT NULL,
  content text NOT NULL DEFAULT '''',
  content_format text NOT NULL DEFAULT ''plain'',
  status text NOT NULL DEFAULT ''draft'',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT page_texts_content_key_locale_unique UNIQUE (content_key, locale),
  CONSTRAINT page_texts_content_key_format_check CHECK (
    content_key ~ ''^[a-z0-9]+([._-][a-z0-9]+)*$''
  ),
  CONSTRAINT page_texts_page_key_format_check CHECK (
    page_key ~ ''^[a-z0-9]+([_-][a-z0-9]+)*$''
  ),
  CONSTRAINT page_texts_section_key_format_check CHECK (
    section_key ~ ''^[a-z0-9]+([_-][a-z0-9]+)*$''
  ),
  CONSTRAINT page_texts_content_format_check CHECK (
    content_format IN (''plain'', ''markdown'')
  ),
  CONSTRAINT page_texts_status_check CHECK (
    status IN (''draft'', ''published'', ''archived'')
  ),
  CONSTRAINT page_texts_sort_order_check CHECK (sort_order >= 0)
)', 'CREATE TABLE IF NOT EXISTS public.images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT ''imagekit'',
  provider_file_id text NOT NULL,
  provider_file_path text,
  file_name text NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  mime_type text,
  width integer,
  height integer,
  file_size_bytes bigint,
  title text NOT NULL DEFAULT '''',
  alt_text text NOT NULL DEFAULT '''',
  caption text NOT NULL DEFAULT '''',
  status text NOT NULL DEFAULT ''draft'',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT images_provider_file_unique UNIQUE (provider, provider_file_id),
  CONSTRAINT images_provider_not_blank_check CHECK (btrim(provider) <> ''''),
  CONSTRAINT images_provider_file_id_not_blank_check CHECK (
    btrim(provider_file_id) <> ''''
  ),
  CONSTRAINT images_file_name_not_blank_check CHECK (btrim(file_name) <> ''''),
  CONSTRAINT images_url_https_check CHECK (url ~ ''^https://''),
  CONSTRAINT images_thumbnail_url_https_check CHECK (
    thumbnail_url IS NULL OR thumbnail_url ~ ''^https://''
  ),
  CONSTRAINT images_width_check CHECK (width IS NULL OR width > 0),
  CONSTRAINT images_height_check CHECK (height IS NULL OR height > 0),
  CONSTRAINT images_file_size_check CHECK (
    file_size_bytes IS NULL OR file_size_bytes >= 0
  ),
  CONSTRAINT images_status_check CHECK (
    status IN (''draft'', ''published'', ''archived'')
  )
)', 'CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '''',
  status text NOT NULL DEFAULT ''draft'',
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT collections_name_not_blank_check CHECK (btrim(name) <> ''''),
  CONSTRAINT collections_slug_format_check CHECK (
    slug ~ ''^[a-z0-9]+(-[a-z0-9]+)*$''
  ),
  CONSTRAINT collections_status_check CHECK (
    status IN (''draft'', ''published'', ''archived'')
  ),
  CONSTRAINT collections_sort_order_check CHECK (sort_order >= 0),
  CONSTRAINT collections_published_at_check CHECK (
    status <> ''published'' OR published_at IS NOT NULL
  )
)', 'CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '''',
  status text NOT NULL DEFAULT ''draft'',
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT projects_name_not_blank_check CHECK (btrim(name) <> ''''),
  CONSTRAINT projects_slug_format_check CHECK (
    slug ~ ''^[a-z0-9]+(-[a-z0-9]+)*$''
  ),
  CONSTRAINT projects_status_check CHECK (
    status IN (''draft'', ''published'', ''archived'')
  ),
  CONSTRAINT projects_sort_order_check CHECK (sort_order >= 0),
  CONSTRAINT projects_published_at_check CHECK (
    status <> ''published'' OR published_at IS NOT NULL
  )
)', 'CREATE TABLE IF NOT EXISTS public.collection_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT collection_images_image_unique UNIQUE (collection_id, image_id),
  CONSTRAINT collection_images_position_check CHECK (position >= 0)
)', 'CREATE TABLE IF NOT EXISTS public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT project_images_image_unique UNIQUE (project_id, image_id),
  CONSTRAINT project_images_position_check CHECK (position >= 0)
)', 'CREATE INDEX IF NOT EXISTS page_texts_public_order_idx
  ON public.page_texts (page_key, section_key, sort_order)
  WHERE status = ''published''', 'CREATE INDEX IF NOT EXISTS images_public_idx
  ON public.images (created_at DESC)
  WHERE status = ''published''', 'CREATE INDEX IF NOT EXISTS collections_public_order_idx
  ON public.collections (sort_order, published_at DESC)
  WHERE status = ''published''', 'CREATE INDEX IF NOT EXISTS projects_public_order_idx
  ON public.projects (sort_order, published_at DESC)
  WHERE status = ''published''', 'CREATE INDEX IF NOT EXISTS collection_images_order_idx
  ON public.collection_images (collection_id, position, id)', 'CREATE INDEX IF NOT EXISTS collection_images_image_idx
  ON public.collection_images (image_id)', 'CREATE UNIQUE INDEX IF NOT EXISTS collection_images_one_cover_idx
  ON public.collection_images (collection_id)
  WHERE is_cover', 'CREATE INDEX IF NOT EXISTS project_images_order_idx
  ON public.project_images (project_id, position, id)', 'CREATE INDEX IF NOT EXISTS project_images_image_idx
  ON public.project_images (image_id)', 'CREATE UNIQUE INDEX IF NOT EXISTS project_images_one_cover_idx
  ON public.project_images (project_id)
  WHERE is_cover', 'CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$', 'DROP TRIGGER IF EXISTS page_texts_set_updated_at ON public.page_texts', 'CREATE TRIGGER page_texts_set_updated_at
BEFORE UPDATE ON public.page_texts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', 'DROP TRIGGER IF EXISTS images_set_updated_at ON public.images', 'CREATE TRIGGER images_set_updated_at
BEFORE UPDATE ON public.images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', 'DROP TRIGGER IF EXISTS collections_set_updated_at ON public.collections', 'CREATE TRIGGER collections_set_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', 'DROP TRIGGER IF EXISTS projects_set_updated_at ON public.projects', 'CREATE TRIGGER projects_set_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', 'ALTER TABLE public.page_texts ENABLE ROW LEVEL SECURITY', 'ALTER TABLE public.images ENABLE ROW LEVEL SECURITY', 'ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY', 'ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY', 'ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY', 'ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY', 'DROP POLICY IF EXISTS page_texts_public_read ON public.page_texts', 'CREATE POLICY page_texts_public_read
ON public.page_texts
FOR SELECT
TO anon, authenticated
USING (status = ''published'')', 'DROP POLICY IF EXISTS images_public_read ON public.images', 'CREATE POLICY images_public_read
ON public.images
FOR SELECT
TO anon, authenticated
USING (status = ''published'')', 'DROP POLICY IF EXISTS collections_public_read ON public.collections', 'CREATE POLICY collections_public_read
ON public.collections
FOR SELECT
TO anon, authenticated
USING (status = ''published'')', 'DROP POLICY IF EXISTS projects_public_read ON public.projects', 'CREATE POLICY projects_public_read
ON public.projects
FOR SELECT
TO anon, authenticated
USING (status = ''published'')', 'DROP POLICY IF EXISTS collection_images_public_read ON public.collection_images', 'CREATE POLICY collection_images_public_read
ON public.collection_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.collections
    WHERE collections.id = collection_images.collection_id
      AND collections.status = ''published''
  )
  AND EXISTS (
    SELECT 1
    FROM public.images
    WHERE images.id = collection_images.image_id
      AND images.status = ''published''
  )
)', 'DROP POLICY IF EXISTS project_images_public_read ON public.project_images', 'CREATE POLICY project_images_public_read
ON public.project_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.projects
    WHERE projects.id = project_images.project_id
      AND projects.status = ''published''
  )
  AND EXISTS (
    SELECT 1
    FROM public.images
    WHERE images.id = project_images.image_id
      AND images.status = ''published''
  )
)', 'GRANT SELECT ON public.page_texts TO anon, authenticated', 'GRANT SELECT ON public.images TO anon, authenticated', 'GRANT SELECT ON public.collections TO anon, authenticated', 'GRANT SELECT ON public.projects TO anon, authenticated', 'GRANT SELECT ON public.collection_images TO anon, authenticated', 'GRANT SELECT ON public.project_images TO anon, authenticated'], '2026-09-02T15:36:54.252692+00:00')
  ON CONFLICT ("version") DO UPDATE SET "name" = EXCLUDED."name", "statements" = EXCLUDED."statements", "created_at" = EXCLUDED."created_at";

-- [MIGRATION] migration system.20260902152539 (add)
-- Migration 20260902152539: add-section-images
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
INSERT INTO "system"."custom_migrations" ("version", "name", "statements", "created_at") VALUES ('20260902152539', 'add-section-images', ARRAY['CREATE TABLE public.section_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL DEFAULT ''home'',
  section_key text NOT NULL,
  slot_key text NOT NULL DEFAULT ''default'',
  position integer NOT NULL DEFAULT 0,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT section_images_page_key_format_check CHECK (
    page_key ~ ''^[a-z0-9]+([_-][a-z0-9]+)*$''
  ),
  CONSTRAINT section_images_section_key_format_check CHECK (
    section_key ~ ''^[a-z0-9]+([_-][a-z0-9]+)*$''
  ),
  CONSTRAINT section_images_slot_key_format_check CHECK (
    slot_key ~ ''^[a-z0-9]+([_-][a-z0-9]+)*$''
  ),
  CONSTRAINT section_images_position_check CHECK (position >= 0),
  CONSTRAINT section_images_slot_position_unique UNIQUE (
    page_key,
    section_key,
    slot_key,
    position
  )
)', 'CREATE INDEX section_images_lookup_idx
  ON public.section_images (page_key, section_key, slot_key, position)', 'CREATE INDEX section_images_image_idx
  ON public.section_images (image_id)', 'ALTER TABLE public.section_images ENABLE ROW LEVEL SECURITY', 'CREATE POLICY section_images_public_read
ON public.section_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.images
    WHERE images.id = section_images.image_id
      AND images.status = ''published''
  )
)', 'GRANT SELECT ON public.section_images TO anon, authenticated'], '2026-09-02T15:37:09.385058+00:00')
  ON CONFLICT ("version") DO UPDATE SET "name" = EXCLUDED."name", "statements" = EXCLUDED."statements", "created_at" = EXCLUDED."created_at";

-- ===== DDL =====
-- [DDL] table public.section_images (add)
CREATE TABLE IF NOT EXISTS public.section_images (id uuid NOT NULL DEFAULT gen_random_uuid(), page_key text NOT NULL DEFAULT 'home'::text, section_key text NOT NULL, slot_key text NOT NULL DEFAULT 'default'::text, "position" integer NOT NULL DEFAULT 0, image_id uuid NOT NULL, created_at timestamp with time zone NOT NULL DEFAULT now(), CHECK (page_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'::text), CHECK (section_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'::text), CHECK (slot_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'::text), CHECK ("position" >= 0), PRIMARY KEY (id), UNIQUE (page_key, section_key, slot_key, "position"), FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE);
CREATE INDEX IF NOT EXISTS section_images_image_idx ON public.section_images USING btree (image_id);
CREATE INDEX IF NOT EXISTS section_images_lookup_idx ON public.section_images USING btree (page_key, section_key, slot_key, "position");

-- [DDL] policy public.section_images.section_images_public_read (add)
DROP POLICY IF EXISTS "section_images_public_read" ON "public"."section_images";
CREATE POLICY "section_images_public_read" ON "public"."section_images"
  AS PERMISSIVE
  FOR SELECT
  TO "anon", "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM images
  WHERE ((images.id = section_images.image_id) AND (images.status = 'published'::text)))));

-- [DDL] function public.set_updated_at() (modify)
CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

COMMIT;