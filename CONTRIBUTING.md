# Cómo colaborar / Contributing

[Español](#español) · [English](#english)

## Español

Para reportar errores o sugerir mejoras no hace falta programar: use el [formulario de GitHub](https://github.com/steinsleger/afinerdo/issues/new?template=feedback.yml) o escriba a [asteins@gmail.com](mailto:asteins@gmail.com).

Para colaborar con código:

1. Siga los pasos de [Uso local](README.md#uso-local).
2. Haga cambios pequeños y enfocados. Si es algo grande, abra primero un issue para conversarlo.
3. Ejecute `pnpm test` y `pnpm build` antes de abrir el pull request.
4. Agregue los cambios visibles para los usuarios a [CHANGELOG.md](CHANGELOG.md).

Para sumar un idioma, agregue su diccionario en [`src/i18n.ts`](src/i18n.ts) con la misma forma que el castellano, título y descripción de la página incluidos, y su imagen para redes en `public/`. La página, el sitemap y la detección del idioma del sistema lo toman solos.

La rama `main` está protegida: todo cambio entra por pull request y necesita la aprobación de Adrián Steinsleger. Las convenciones del proyecto están en [AGENTS.md](AGENTS.md). Al contribuir, usted acepta que su aporte se publique bajo la misma [licencia](LICENSE) del proyecto.

## English

You don't need to code to report a bug or suggest an improvement: use the [GitHub form](https://github.com/steinsleger/afinerdo/issues/new?template=feedback.yml) or write to [asteins@gmail.com](mailto:asteins@gmail.com).

To contribute code:

1. Follow the steps in [Running it locally](README.md#running-it-locally).
2. Keep changes small and focused. For anything large, open an issue first to discuss it.
3. Run `pnpm test` and `pnpm build` before opening a pull request.
4. Add user-facing changes to [CHANGELOG.md](CHANGELOG.md).

To add a language, add its dictionary to [`src/i18n.ts`](src/i18n.ts) with the same shape as the Spanish one, page title and description included, and its social preview image to `public/`. Its page, the sitemap and the system language detection pick it up on their own.

The `main` branch is protected: every change goes through a pull request and needs Adrián Steinsleger's approval. The project's conventions are in [AGENTS.md](AGENTS.md). By contributing, you agree that your work is published under the project's [license](LICENSE).
