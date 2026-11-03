import Sortable from 'sortablejs'
import { beforeSubmit } from './form-control.js'
import { showToast } from './toast.js'

const form = document.querySelector('form[data-cms-form]')
const saveBar = form.querySelector('.cms-save-bar')
const saveStatus = saveBar.querySelector('[data-save-status]')
const unsavedMessage = saveStatus.textContent
const serialize = () => new URLSearchParams(new FormData(form)).toString()
let baseline = serialize()
let leaving = false

const isDirty = () => serialize() !== baseline
const updateSaveBar = () => { saveBar.hidden = !isDirty() }

form.addEventListener('input', updateSaveBar)
form.addEventListener('change', updateSaveBar)
form.addEventListener('saved', ({ detail }) => {
  if (form.elements.version) {
    form.elements.version.value = detail.version
  }
  baseline = serialize()
  updateSaveBar()
})

let prepareSave

beforeSubmit(form, async () => {
  await prepareSave?.()
  saveStatus.textContent = 'Saving...'
})

form.addEventListener('settled', () => {
  saveStatus.textContent = unsavedMessage
})

saveBar.querySelector('[data-discard]').addEventListener('click', () => {
  leaving = true
  window.location.reload()
})

window.addEventListener('beforeunload', event => {
  if (!leaving && isDirty()) {
    event.preventDefault()
  }
})

const post = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams(data)
  })
  const result = await response.json()
  if (result.redirect) {
    window.location.assign(result.redirect)
  }
  if (result.type !== 'success') {
    throw new Error(result.message)
  }
  return result
}

const formatTime = value => {
  const [hours, minutes] = value.split(':').map(Number)
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
}

const statusInputs = form.querySelectorAll('input[name="status"]')

if (statusInputs.length) {
  const preview = form.querySelector('[data-hours-preview]')
  const openHour = form.elements.openHour
  const closeHour = form.elements.closeHour
  const overrideMsg = form.elements.overrideMsg

  const updateHours = () => {
    const status = form.elements.status.value
    form.querySelectorAll('[data-status-panel]').forEach(panel => {
      panel.hidden = panel.dataset.statusPanel !== status
    })
    openHour.required = closeHour.required = status === 'open'
    overrideMsg.required = status === 'message'

    if (status === 'open') {
      preview.textContent = openHour.value && closeHour.value
        ? `Monday - Sunday ${formatTime(openHour.value)} - ${formatTime(closeHour.value)}`
        : 'Enter both times'
    } else if (status === 'message') {
      preview.textContent = overrideMsg.value.trim() || 'Enter a message'
    } else {
      preview.textContent = 'CLOSED'
    }
  }

  form.addEventListener('input', updateHours)
  form.addEventListener('change', updateHours)
  updateHours()
}

const resize = (bitmap, maxSize) => {
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise(resolve => canvas.toBlob(blob => resolve({ blob, width: canvas.width, height: canvas.height }), 'image/jpeg', 0.85))
}

const resizePhoto = async file => {
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(`${file.name} could not be read. Use a JPEG or PNG photo.`)
  }
  const [full, thumb] = await Promise.all([resize(bitmap, 2000), resize(bitmap, 600)])
  bitmap.close()
  return { full, thumb }
}

const uploadToBucket = async ({ url, fields }, blob) => {
  const data = new FormData()
  Object.entries(fields).forEach(([key, value]) => data.append(key, value))
  data.append('file', blob)
  const response = await fetch(url, { method: 'POST', body: data })
  if (!response.ok) {
    throw new Error('The upload failed. Please try again.')
  }
}

const tiles = form.querySelector('[data-tiles]')

if (tiles) {
  const tileTemplate = form.querySelector('[data-tile-template]')
  const uploadInput = form.querySelector('[data-upload]')
  const editor = form.querySelector('.cms-editor')
  const editorImage = editor.querySelector('.cms-editor-image')
  const editorName = editor.querySelector('#edit-name')
  const editorCaption = editor.querySelector('#edit-caption')
  const pending = new Map()
  let editing

  const field = (tile, name) => tile.querySelector(`input[name="${name}"]`)
  const markChanged = () => form.dispatchEvent(new Event('input'))

  const renderTile = tile => {
    tile.querySelector('.cms-tile-name').textContent = field(tile, 'name').value || 'Untitled'
    tile.querySelector('.cms-tile-caption').textContent = field(tile, 'caption').value
  }

  const removeTile = tile => {
    if (pending.delete(field(tile, 'id').value)) {
      URL.revokeObjectURL(tile.dataset.full)
      URL.revokeObjectURL(tile.querySelector('img').src)
    }
    tile.remove()
    markChanged()
  }

  Sortable.create(tiles, {
    animation: 150,
    delay: 150,
    delayOnTouchOnly: true,
    filter: '.cms-tile-delete',
    preventOnFilter: false,
    onEnd: markChanged
  })

  tiles.addEventListener('click', event => {
    const tile = event.target.closest('.cms-tile')
    if (!tile) {
      return
    }
    if (event.target.closest('.cms-tile-delete')) {
      removeTile(tile)
      return
    }
    editing = tile
    editorImage.width = field(tile, 'width').value
    editorImage.height = field(tile, 'height').value
    editorImage.src = tile.querySelector('img').src
    const full = new Image()
    full.addEventListener('load', () => {
      if (editing === tile) {
        editorImage.src = full.src
      }
    })
    full.src = tile.dataset.full
    editorName.value = field(tile, 'name').value
    editorCaption.value = field(tile, 'caption').value
    editor.showModal()
  })

  const applyEdit = () => {
    field(editing, 'name').value = editorName.value.trim()
    field(editing, 'caption').value = editorCaption.value.trim()
    renderTile(editing)
    editor.close()
    markChanged()
  }

  editor.querySelector('[data-editor-done]').addEventListener('click', applyEdit)
  editor.addEventListener('click', event => {
    if (event.target === editor || event.target.closest('[data-editor-close]')) {
      editor.close()
    }
  })
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.matches('input')) {
      event.preventDefault()
      applyEdit()
    }
  })

  const addPhoto = async file => {
    const { full, thumb } = await resizePhoto(file)
    const id = crypto.randomUUID()
    const tile = tileTemplate.content.firstElementChild.cloneNode(true)
    tile.dataset.full = URL.createObjectURL(full.blob)
    tile.querySelector('img').src = URL.createObjectURL(thumb.blob)
    field(tile, 'id').value = id
    field(tile, 'name').value = file.name.replace(/\.[^.]+$/, '')
    field(tile, 'width').value = full.width
    field(tile, 'height').value = full.height
    pending.set(id, { full: full.blob, thumb: thumb.blob })
    renderTile(tile)
    tiles.append(tile)
  }

  uploadInput.addEventListener('change', async () => {
    const files = [...uploadInput.files]
    uploadInput.value = ''
    for (const file of files) {
      await addPhoto(file).catch(err => showToast({ type: 'error', message: err.message }))
    }
    markChanged()
  })

  prepareSave = async () => {
    const ids = [...tiles.querySelectorAll('input[name="id"]')].map(input => input.value).filter(id => pending.has(id))
    for (const [index, id] of ids.entries()) {
      saveStatus.textContent = `Uploading ${index + 1} of ${ids.length}...`
      const { uploads } = await post('/cms/gallery/uploads', { id })
      const { full, thumb } = pending.get(id)
      await Promise.all([uploadToBucket(uploads.full, full), uploadToBucket(uploads.thumb, thumb)])
      pending.delete(id)
    }
  }

  tiles.querySelectorAll('.cms-tile').forEach(renderTile)
}
