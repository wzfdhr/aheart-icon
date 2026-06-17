# Aheart Icon

Aheart Icon is a tree-shakeable Vue 3 icon library generated from SVG files. It ships each icon as an independent Vue component and includes a searchable icon gallery for browsing names, component exports, and import snippets.

[Icon gallery](https://wzfdhr.github.io/aheart-icon/) · [GitHub repository](https://github.com/wzfdhr/aheart-icon)

## Features

- 518 SVG icons generated as Vue 3 single-file components
- ESM, CommonJS, and IIFE bundles
- Type declarations for TypeScript projects
- `currentColor` based icons for easy styling
- Searchable static gallery built from the source SVG files
- GitHub Packages publishing workflow

## Install

This package is published to GitHub Packages. Add the package scope to your project `.npmrc`:

```ini
@wzfdhr:registry=https://npm.pkg.github.com
```

Install the package:

```bash
npm install @wzfdhr/aheart-icon
```

GitHub Packages requires authentication for npm packages. For local installs, sign in with a GitHub personal access token that has `read:packages` permission:

```bash
npm login --scope=@wzfdhr --auth-type=legacy --registry=https://npm.pkg.github.com
```

## Usage

Import only the icons you need:

```vue
<template>
  <HeartFill class="icon" />
  <Search class="icon" />
</template>

<script setup lang="ts">
import {
  HeartFill,
  Search
} from '@wzfdhr/aheart-icon'
</script>

<style scoped>
.icon {
  width: 24px;
  height: 24px;
  color: #0f766e;
}
</style>
```

If a component name conflicts with local code or native elements, import it with an alias:

```ts
import {
  At as IconAt,
  UserFill
} from '@wzfdhr/aheart-icon'
```

## Gallery

Build the static gallery from `icons/*.svg`:

```bash
npm run docs:build
```

The generated page is written to `docs/index.html`. GitHub Pages deployment is handled by `.github/workflows/pages.yml` when changes are pushed to `master`.

## Development

Put source SVG files in `icons/`, then generate Vue SFCs:

```bash
npm run generate:sfc
```

Build the package:

```bash
npm run build
```

The package output is written to `dist/`.

## Publishing

Create a GitHub Release to publish a new package version. The `.github/workflows/publish-package.yml` workflow installs dependencies, builds the package through `prepack`, and runs `npm publish` against GitHub Packages using `GITHUB_TOKEN`.

Before creating a release, update the package version:

```bash
npm version patch
git push --follow-tags
```

## Scripts

```bash
npm run svgo          # Optimize SVG files in icons/
npm run generate:sfc  # Generate Vue components in packages/
npm run build:sfc     # Build JS bundles only
npm run build:types   # Generate type declarations only
npm run build         # Generate and build the package
npm run docs:build    # Generate docs/index.html
```

## License

MIT
