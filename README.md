# Simbionte Joyas

Sitio de portafolio construido con Next.js, React, pnpm y PhotoSwipe. La página actual conserva contenido local mientras se prepara la integración editorial con InsForge e ImageKit.

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

## Contenido provisional

- `src/data.ts` contiene las piezas de muestra; será el punto de sustitución por el cliente del futuro backend.
- `src/styles.css` concentra los tokens visuales (colores y fuentes) al inicio del archivo.
- Los gráficos de la grilla son marcadores SVG locales, no fotos finales.

## Backend previsto

- El [modelo de datos](docs/modelo-de-datos.md) define textos de página, imágenes de ImageKit, colecciones y proyectos.
- La migración inicial está en `migrations/20260820212804_create-content-model.sql` y se aplicará cuando el repositorio esté vinculado al nuevo proyecto de InsForge.
- Las siguientes fases están registradas en [TODO.md](TODO.md), incluido el panel administrativo.

## Publicación

El proyecto está preparado para desplegarse en Vercel como aplicación Next.js. Al importar el repositorio, Vercel detectará el framework y usará `pnpm build` automáticamente.

Antes de integrar el backend, no se requieren variables de entorno. En las fases de InsForge e ImageKit, las claves privadas se configurarán como variables seguras en Vercel y nunca se incluirán en el navegador ni en el repositorio.

GitHub Pages deja de ser el destino de publicación porque no admite las rutas de servidor necesarias para el futuro BFF y panel administrativo.
