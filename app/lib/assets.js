import fs from 'node:fs'
import path from 'node:path'
import config from '../config.js'

const devServer = 'http://localhost:5173/build'
const manifestPath = path.join(import.meta.dirname, '../public/build/.vite/manifest.json')

const preloadFonts = /\/(open-sans-latin-400-normal|open-sans-latin-300-italic|cormorant-infant-latin-500-normal|cormorant-sc-latin-400-normal)-[\w-]+\.woff2$/

let manifest

const importedChunks = (name, seen = new Set()) =>
  (manifest[name].imports ?? []).flatMap(key => {
    if (seen.has(key)) {
      return []
    }
    seen.add(key)
    return [...importedChunks(key, seen), manifest[key]]
  })

const productionTags = entries => {
  manifest ??= JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const styles = new Set()
  const fonts = new Set()
  const scripts = []
  const preloads = new Set()

  for (const name of entries) {
    styles.add(manifest[`${name}.css`].file)
    for (const file of manifest[`${name}.css`].assets ?? []) {
      if (preloadFonts.test(`/${file}`)) {
        fonts.add(file)
      }
    }
    const chunks = importedChunks(`${name}.js`)
    for (const file of chunks.flatMap(chunk => chunk.css ?? [])) {
      styles.add(file)
    }
    for (const chunk of chunks) {
      preloads.add(chunk.file)
    }
    scripts.push(manifest[`${name}.js`].file)
  }

  return [
    ...[...fonts].map(file => `<link rel="preload" href="/build/${file}" as="font" type="font/woff2" crossorigin />`),
    ...[...styles].map(file => `<link rel="stylesheet" href="/build/${file}" />`),
    ...scripts.map(file => `<script type="module" src="/build/${file}"></script>`),
    ...[...preloads].map(file => `<link rel="modulepreload" href="/build/${file}" />`)
  ].join('\n')
}

const devTags = entries => [
  ...entries.map(name => `<link rel="stylesheet" href="${devServer}/${name}.css" />`),
  `<script type="module" src="${devServer}/@vite/client"></script>`,
  ...entries.map(name => `<script type="module" src="${devServer}/${name}.js"></script>`)
].join('\n')

export const assetTags = (...names) => {
  const entries = names.filter(Boolean)
  return config.production ? productionTags(entries) : devTags(entries)
}
