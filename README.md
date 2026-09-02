# Simbionte Joyas

Sitio de portafolio construido con Next.js, React, pnpm y PhotoSwipe. El contenido publicado se obtiene desde InsForge; si el backend no está configurado, la portada conserva sus datos locales de respaldo.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Para ejecutar la versión de producción localmente:

```bash
pnpm build
pnpm start
```

## Panel administrativo

El panel se muestra en `https://admin.simbiontejoyas.cl`. Está protegido con inicio de sesión de Google mediante InsForge y admite:

- edición y publicación de los textos, incluido SEO;
- creación, orden y publicación de colecciones;
- carga directa de fotos a ImageKit, sin revelar la clave privada al navegador;
- metadatos, publicación y eliminación de imágenes, y asignación de fotos a las secciones de la portada.

El dominio público redirige `https://simbiontejoyas.cl/admin` al subdominio administrativo. En desarrollo también se puede abrir `http://localhost:3000/admin`.

Para permitir el acceso, agregue en `ADMIN_EMAILS` los correos de Google autorizados, separados por comas. Un usuario autenticado que no figure allí no puede ver ni modificar el panel.

## Configuración

Copie `.env.example` como `.env.local` y complete sus valores. Para producción, configure las mismas variables en Vercel:

```env
NEXT_PUBLIC_INSFORGE_URL=https://nc43x3r8.us-east.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=
INSFORGE_API_KEY=
ADMIN_EMAILS=admin@ejemplo.cl
NEXT_PUBLIC_APP_URL=https://admin.simbiontejoyas.cl
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_FOLDER=/simbiontejoyas
```

`INSFORGE_API_KEY` e `IMAGEKIT_PRIVATE_KEY` son exclusivas del servidor: nunca deben comenzar con `NEXT_PUBLIC_` ni subirse al repositorio. El proyecto de InsForge ya tiene configuradas las URLs de retorno de producción y desarrollo para Google SSO.

## Publicación

El proyecto se despliega en Vercel como aplicación Next.js con `pnpm build`. El subdominio `admin.simbiontejoyas.cl` está asignado al proyecto; Vercel emitirá el certificado SSL antes de dejarlo disponible. Después de cargar las variables de entorno, haga un nuevo despliegue para activar el panel.
