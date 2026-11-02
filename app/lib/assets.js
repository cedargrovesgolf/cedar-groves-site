import fs from 'node:fs'
import path from 'node:path'
import config from '../config.js'

const devServer = 'http://localhost:5173/build'
const manifestPath = path.join(import.meta.dirname, '../public/build/.vite/manifest.json')

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
  const scripts = []
  const preloads = new Set()

  for (const name of entries) {
    styles.add(manifest[`${name}.css`].file)
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
