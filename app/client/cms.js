import Sortable from 'sortablejs'
import { showToast } from './toast.js'

const form = document.querySelector('form[data-cms-form]')
const saveBar = form.querySelector('.cms-save-bar')
const serialize = () => new URLSearchParams(new FormData(form)).toString()
let baseline = serialize()
let leaving = false

const isDirty = () => serialize() !== baseline
const updateSaveBar = () => { saveBar.hidden = !isDirty() }

form.addEventListener('input', updateSaveBar)
form.addEventListener('change', updateSaveBar)
form.addEventListener('saved', () => {
  baseline = serialize()
  updateSaveBar()
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

const post = async (url, data = {}) => {
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

const reloadUnlessDirty = action => async (...args) => {
  if (isDirty()) {
    showToast({ type: 'error', message: 'Save or discard your changes first.' })
    return
  }
  await action(...args)
  leaving = true
  window.location.reload()
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

const showError = err => showToast({ type: 'error', message: err.message || 'Something went wrong. Please try again.' })

const tiles = {
  shown: form.querySelector('[data-tiles="shown"]'),
  hidden: form.querySelector('[data-tiles="hidden"]')
}

if (tiles.shown) {
  const homeCount = form.elements.homeCount
  const homeCountText = form.querySelector('[data-home-count]')
  const deleteHiddenButton = form.querySelector('[data-delete-hidden]')
  const editor = form.querySelector('.cms-editor')
  const editorFields = {
    name: editor.querySelector('#edit-name'),
    caption: editor.querySelector('#edit-caption'),
    shown: editor.querySelector('#edit-shown')
  }
  let editing

  const field = (tile, key) => tile.querySelector(`input[name="${key}_${tile.dataset.id}"]`)
  const markChanged = () => form.dispatchEvent(new Event('input'))

  const refreshTiles = () => {
    const count = Number(homeCount.value) || 0
    homeCountText.textContent = count
    tiles.shown.querySelectorAll('.cms-tile').forEach((tile, index) => {
      tile.querySelector('.cms-tile-number').textContent = index + 1
      tile.classList.toggle('cms-tile-home', index < count)
    })
    tiles.hidden.querySelectorAll('.cms-tile').forEach(tile => {
      tile.querySelector('.cms-tile-number').textContent = ''
      tile.classList.remove('cms-tile-home')
    })
    form.querySelectorAll('.cms-tile').forEach(tile => {
      tile.querySelector('.cms-tile-name').textContent = field(tile, 'name').value || 'Untitled'
      tile.querySelector('.cms-tile-caption').textContent = field(tile, 'caption').value
    })
    deleteHiddenButton.hidden = !tiles.hidden.querySelector('.cms-tile')
  }

  const placeTile = (tile, shown) => {
    field(tile, 'shown').value = shown ? '1' : ''
    if ((tile.parentElement === tiles.shown) !== shown) {
      (shown ? tiles.shown : tiles.hidden).append(tile)
    }
  }

  Object.values(tiles).forEach(container => Sortable.create(container, {
    group: 'gallery',
    animation: 150,
    delay: 150,
    delayOnTouchOnly: true,
    onEnd: ({ item }) => {
      placeTile(item, item.parentElement === tiles.shown)
      refreshTiles()
      markChanged()
    }
  }))

  form.addEventListener('click', event => {
    const tile = event.target.closest('.cms-tile-image')?.parentElement
    if (!tile) {
      return
    }
    editing = tile
    const image = editor.querySelector('.cms-editor-image')
    image.width = tile.dataset.width
    image.height = tile.dataset.height
    image.src = tile.querySelector('img').src
    const full = new Image()
    full.addEventListener('load', () => {
      if (editing === tile) {
        image.src = full.src
      }
    })
    full.src = tile.dataset.full
    editorFields.name.value = field(tile, 'name').value
    editorFields.caption.value = field(tile, 'caption').value
    editorFields.shown.checked = field(tile, 'shown').value === '1'
    editor.showModal()
  })

  const applyEdit = () => {
    field(editing, 'name').value = editorFields.name.value.trim()
    field(editing, 'caption').value = editorFields.caption.value.trim()
    placeTile(editing, editorFields.shown.checked)
    editor.close()
    refreshTiles()
    markChanged()
  }

  editor.querySelector('[data-editor-done]').addEventListener('click', applyEdit)
  editor.querySelector('[data-editor-cancel]').addEventListener('click', () => editor.close())
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      applyEdit()
    }
  })

  const deletePhoto = reloadUnlessDirty(async id => {
    await post(`/cms/gallery/photos/${id}/delete`)
  })

  editor.querySelector('[data-editor-delete]').addEventListener('click', async () => {
    if (!window.confirm('Delete this photo? This cannot be undone.')) {
      return
    }
    editor.close()
    await deletePhoto(editing.dataset.id).catch(showError)
  })

  const deleteHidden = reloadUnlessDirty(async () => {
    await post('/cms/gallery/photos/delete-hidden')
  })

  deleteHiddenButton.addEventListener('click', async () => {
    const count = tiles.hidden.querySelectorAll('.cms-tile').length
    if (!window.confirm(`Delete all ${count} hidden photos? This cannot be undone.`)) {
      return
    }
    await deleteHidden().catch(showError)
  })

  homeCount.addEventListener('input', refreshTiles)
  refreshTiles()
}

const resize = (bitmap, maxSize) => {
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise(resolve => canvas.toBlob(blob => resolve({ blob, width: canvas.width, height: canvas.height }), 'image/jpeg', 0.85))
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

const uploadPhoto = async file => {
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(`${file.name} could not be read. Use a JPEG or PNG photo.`)
  }
  const [full, thumb] = await Promise.all([resize(bitmap, 2000), resize(bitmap, 600)])
  bitmap.close()

  const { id, uploads } = await post('/cms/gallery/uploads')
  await Promise.all([uploadToBucket(uploads.full, full.blob), uploadToBucket(uploads.thumb, thumb.blob)])
  await post('/cms/gallery/photos', {
    id,
    name: file.name.replace(/\.[^.]+$/, ''),
    width: full.width,
    height: full.height
  })
}

const uploadInput = form.querySelector('[data-upload]')

if (uploadInput) {
  const status = form.querySelector('[data-upload-status]')

  const uploadAll = reloadUnlessDirty(async files => {
    for (const [index, file] of files.entries()) {
      status.textContent = `Uploading ${index + 1} of ${files.length}...`
      await uploadPhoto(file)
    }
  })

  uploadInput.addEventListener('change', async () => {
    const files = [...uploadInput.files]
    uploadInput.value = ''
    if (!files.length) {
      return
    }
    uploadInput.disabled = true
    try {
      await uploadAll(files)
    } catch (err) {
      status.textContent = ''
      showError(err)
    } finally {
      uploadInput.disabled = false
    }
  })
}
