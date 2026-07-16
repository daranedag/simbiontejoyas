# Simbionte Joyas — fase 1

Sitio de portafolio estático construido con Vite, React, pnpm y PhotoSwipe.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Para una versión de producción:

```bash
pnpm build
```

## Contenido provisional

- `src/data.ts` contiene las piezas de muestra; será el punto de sustitución por el cliente del futuro backend.
- `src/styles.css` concentra los tokens visuales (colores y fuentes) al inicio del archivo.
- Los gráficos de la grilla son marcadores SVG locales, no fotos finales.

## Publicación

El workflow `.github/workflows/deploy.yml` publica cada envío a `main` en GitHub Pages usando Node 24.

Para el primer despliegue, elige una de estas alternativas:

- Activa **Settings → Pages → Build and deployment → GitHub Actions** una vez.
- O crea el secreto `PAGES_DEPLOY_TOKEN` con un fine-grained personal access token limitado a este repositorio y con permisos **Administration: write** y **Pages: write**. El workflow habilitará Pages automáticamente.
