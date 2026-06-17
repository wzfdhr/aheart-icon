import path from 'path'
import glob from 'fast-glob'
import {
  ensureDir,
  readFile,
  writeFile
} from 'fs-extra'

import {
  docsPath,
  iconsPath,
  rootPath,
  toPascalCase
} from './shared'

type IconMeta = {
  name: string
  component: string
  kind: 'fill' | 'outline'
  svg: string
}

type PackageMeta = {
  name: string
  version: string
  description?: string
  homepage?: string
  repository?: {
    url?: string
  }
}

const brandIcons = new Set([
  'alipay',
  'angularjs',
  'angularjs-fill',
  'chrome',
  'chrome-fill',
  'codepen',
  'dribbble',
  'github',
  'github-fill',
  'gitlab',
  'gitlab-fill',
  'instagram',
  'instagram-fill',
  'linkedin',
  'pinterest',
  'pinterest-fill',
  'playstation',
  'reactjs',
  'slack',
  'twitch',
  'twitch-fill',
  'twitter',
  'twitter-fill',
  'vuejs-fill',
  'wechat',
  'wechat-fill',
  'weibo',
  'whats-app',
  'whats-app-fill',
  'xbox',
  'xbox-fill',
  'youtube',
  'youtube-fill'
])

const getSvgFiles = async () => {
  const files = await glob('*.svg', {
    cwd: iconsPath,
    absolute: true
  })

  return files.sort((a, b) => path.basename(a).localeCompare(path.basename(b)))
}

const getPackageMeta = async (): Promise<PackageMeta> => {
  const content = await readFile(path.resolve(rootPath, 'package.json'), 'utf-8')
  return JSON.parse(content)
}

const getIcons = async (): Promise<IconMeta[]> => {
  const files = await getSvgFiles()

  return Promise.all(
    files.map(async file => {
      const name = path.basename(file, '.svg')
      const svg = await readFile(file, 'utf-8')

      return {
        name,
        component: toPascalCase(name),
        kind: name.endsWith('-fill') ? 'fill' : 'outline',
        svg
      }
    })
  )
}

const getRepositoryUrl = (meta: PackageMeta) => {
  const url = meta.repository?.url || 'https://github.com/wzfdhr/aheart-icon'
  return url.replace(/^git\+/, '').replace(/\.git$/, '')
}

const createHtml = (icons: IconMeta[], meta: PackageMeta) => {
  const repositoryUrl = getRepositoryUrl(meta)
  const generatedAt = new Date().toISOString().slice(0, 10)
  const fillCount = icons.filter(icon => icon.kind === 'fill').length
  const outlineCount = icons.length - fillCount
  const brandCount = icons.filter(icon => brandIcons.has(icon.name)).length

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Aheart Icon Gallery</title>
  <meta name="description" content="${meta.description || 'A tree-shakeable Vue 3 icon library'}">
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f8fa;
      --surface: #ffffff;
      --ink: #1f2937;
      --muted: #6b7280;
      --line: #d9dee7;
      --accent: #0f766e;
      --accent-soft: #dff5f1;
      --warm: #f97316;
      --warm-soft: #fff1e7;
      --shadow: 0 10px 28px rgba(31, 41, 55, 0.08);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .shell {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
    }

    .hero {
      border-bottom: 1px solid var(--line);
      background: var(--surface);
    }

    .hero-inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 40px;
      align-items: end;
      padding: 56px 0 34px;
    }

    .eyebrow {
      margin: 0 0 10px;
      color: var(--accent);
      font-size: 14px;
      font-weight: 700;
    }

    h1 {
      margin: 0;
      max-width: 760px;
      font-size: clamp(40px, 7vw, 88px);
      line-height: 0.95;
      font-weight: 800;
    }

    .intro {
      max-width: 680px;
      margin: 22px 0 0;
      color: var(--muted);
      font-size: 18px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 28px;
    }

    .button {
      display: inline-flex;
      min-height: 42px;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      color: var(--ink);
      padding: 0 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .button.primary {
      border-color: var(--accent);
      background: var(--accent);
      color: #ffffff;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .stat {
      min-height: 88px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: 16px;
      box-shadow: var(--shadow);
    }

    .stat strong {
      display: block;
      font-size: 28px;
      line-height: 1;
    }

    .stat span {
      display: block;
      margin-top: 8px;
      color: var(--muted);
      font-size: 13px;
    }

    .install {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 16px;
      align-items: center;
      border-bottom: 1px solid var(--line);
      padding: 18px 0;
    }

    .install code {
      display: block;
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #111827;
      color: #f9fafb;
      padding: 12px 14px;
      font-size: 14px;
      white-space: nowrap;
    }

    .controls {
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 1px solid var(--line);
      background: rgba(247, 248, 250, 0.96);
      backdrop-filter: blur(10px);
    }

    .controls-inner {
      display: grid;
      grid-template-columns: minmax(240px, 1fr) auto;
      gap: 14px;
      align-items: center;
      padding: 16px 0;
    }

    .search {
      width: 100%;
      min-height: 44px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      color: var(--ink);
      padding: 0 14px;
      font: inherit;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
    }

    .filter {
      min-height: 40px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      color: var(--ink);
      padding: 0 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .filter[aria-pressed="true"] {
      border-color: var(--warm);
      background: var(--warm-soft);
      color: #9a3412;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      padding: 24px 0 14px;
      color: var(--muted);
      font-size: 14px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(154px, 1fr));
      gap: 12px;
      padding: 0 0 56px;
    }

    .card {
      min-height: 154px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      color: var(--ink);
      padding: 16px;
      text-align: left;
      cursor: pointer;
      transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
    }

    .card:hover,
    .card:focus-visible {
      border-color: var(--accent);
      box-shadow: var(--shadow);
      transform: translateY(-2px);
      outline: none;
    }

    .icon-box {
      display: grid;
      width: 48px;
      height: 48px;
      place-items: center;
      color: var(--accent);
    }

    .icon-box svg {
      width: 32px;
      height: 32px;
      display: block;
    }

    .icon-box svg path:not([fill="none"]),
    .icon-box svg circle:not([fill="none"]),
    .icon-box svg rect:not([fill="none"]),
    .icon-box svg polygon:not([fill="none"]) {
      fill: currentColor;
    }

    .icon-name {
      display: block;
      margin-top: 18px;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .component-name {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 12px;
      overflow-wrap: anywhere;
    }

    .empty {
      display: none;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: 24px;
      color: var(--muted);
    }

    .toast {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 20;
      max-width: min(420px, calc(100vw - 36px));
      border: 1px solid var(--accent);
      border-radius: 8px;
      background: var(--accent);
      color: #ffffff;
      padding: 12px 14px;
      box-shadow: var(--shadow);
      opacity: 0;
      transform: translateY(10px);
      pointer-events: none;
      transition: opacity 160ms ease, transform 160ms ease;
      font-size: 14px;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    footer {
      border-top: 1px solid var(--line);
      padding: 24px 0 36px;
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 860px) {
      .hero-inner {
        grid-template-columns: 1fr;
        gap: 26px;
        padding-top: 40px;
      }

      .stats {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .controls-inner,
      .install {
        grid-template-columns: 1fr;
      }

      .filters {
        justify-content: flex-start;
      }
    }

    @media (max-width: 560px) {
      .shell {
        width: min(100% - 22px, 1180px);
      }

      .stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .card {
        min-height: 144px;
        padding: 14px;
      }
    }
  </style>
</head>
<body>
  <header class="hero">
    <div class="shell hero-inner">
      <div>
        <p class="eyebrow">Vue 3 Icon Library</p>
        <h1>Aheart Icon</h1>
        <p class="intro">${meta.description || 'A tree-shakeable Vue 3 icon library'}.</p>
        <div class="hero-actions">
          <a class="button primary" href="#icons">Browse Icons</a>
          <a class="button" href="${repositoryUrl}">GitHub</a>
        </div>
      </div>
      <div class="stats" aria-label="Icon library summary">
        <div class="stat"><strong>${icons.length}</strong><span>icons</span></div>
        <div class="stat"><strong>${outlineCount}</strong><span>outline</span></div>
        <div class="stat"><strong>${fillCount}</strong><span>filled</span></div>
        <div class="stat"><strong>${brandCount}</strong><span>brand</span></div>
      </div>
    </div>
  </header>

  <section class="shell install" aria-label="Install">
    <code>npm install ${meta.name} --registry=https://npm.pkg.github.com</code>
    <button class="button" id="copy-install" type="button">Copy Install</button>
  </section>

  <section class="controls" id="icons">
    <div class="shell controls-inner">
      <input class="search" id="search" type="search" placeholder="Search icons by name or component" autocomplete="off">
      <div class="filters" role="group" aria-label="Icon filters">
        <button class="filter" type="button" data-filter="all" aria-pressed="true">All</button>
        <button class="filter" type="button" data-filter="outline" aria-pressed="false">Outline</button>
        <button class="filter" type="button" data-filter="fill" aria-pressed="false">Filled</button>
        <button class="filter" type="button" data-filter="brand" aria-pressed="false">Brand</button>
      </div>
    </div>
  </section>

  <main class="shell">
    <div class="meta-row">
      <span id="result-count"></span>
      <span>Generated ${generatedAt}</span>
    </div>
    <div class="empty" id="empty">No icons match this search.</div>
    <div class="grid" id="grid" aria-live="polite"></div>
  </main>

  <footer>
    <div class="shell">${meta.name}@${meta.version}</div>
  </footer>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>

  <script>
    const packageName = ${JSON.stringify(meta.name)};
    const icons = ${JSON.stringify(icons)};
    const brandIcons = new Set(${JSON.stringify(Array.from(brandIcons))});
    const grid = document.querySelector('#grid');
    const search = document.querySelector('#search');
    const resultCount = document.querySelector('#result-count');
    const empty = document.querySelector('#empty');
    const toast = document.querySelector('#toast');
    const filterButtons = Array.from(document.querySelectorAll('.filter'));
    let activeFilter = 'all';
    let toastTimer;

    const copyText = async (value, message) => {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }

      window.clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add('show');
      toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1600);
    };

    const matchesFilter = icon => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'brand') return brandIcons.has(icon.name);
      return icon.kind === activeFilter;
    };

    const createCard = icon => {
      const card = document.createElement('button');
      card.className = 'card';
      card.type = 'button';
      card.setAttribute('aria-label', 'Copy import for ' + icon.component);

      const iconBox = document.createElement('span');
      iconBox.className = 'icon-box';
      iconBox.innerHTML = icon.svg;

      const name = document.createElement('span');
      name.className = 'icon-name';
      name.textContent = icon.name;

      const component = document.createElement('span');
      component.className = 'component-name';
      component.textContent = icon.component;

      card.append(iconBox, name, component);
      card.addEventListener('click', () => {
        copyText(
          "import { " + icon.component + " } from '" + packageName + "'",
          icon.component + ' import copied'
        );
      });

      return card;
    };

    const render = () => {
      const query = search.value.trim().toLowerCase();
      const visible = icons.filter(icon => {
        const haystack = (icon.name + ' ' + icon.component).toLowerCase();
        return matchesFilter(icon) && haystack.includes(query);
      });

      grid.replaceChildren(...visible.map(createCard));
      resultCount.textContent = visible.length + ' of ' + icons.length + ' icons';
      empty.style.display = visible.length ? 'none' : 'block';
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach(item => {
          item.setAttribute('aria-pressed', String(item === button));
        });
        render();
      });
    });

    document.querySelector('#copy-install').addEventListener('click', () => {
      copyText('npm install ' + packageName + ' --registry=https://npm.pkg.github.com', 'Install command copied');
    });

    search.addEventListener('input', render);
    render();
  </script>
</body>
</html>
`
}

;(async () => {
  const [icons, meta] = await Promise.all([
    getIcons(),
    getPackageMeta()
  ])

  await ensureDir(docsPath)
  await writeFile(path.resolve(docsPath, 'index.html'), createHtml(icons, meta), 'utf-8')
})()
