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

const homeCount = form.elements.homeCount

if (homeCount) {
  const text = form.querySelector('[data-home-count]')
  homeCount.addEventListener('input', () => { text.textContent = homeCount.value || 0 })
}

const list = form.querySelector('[data-sortable]')

if (list) {
  Sortable.create(list, {
    handle: '.cms-handle',
    animation: 150,
    onEnd: updateSaveBar
  })
}

const deletePhoto = reloadUnlessDirty(async id => {
  await post(`/cms/gallery/photos/${id}/delete`)
})

form.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => {
  if (!window.confirm('Delete this photo? This cannot be undone.')) {
    return
  }
  try {
    await deletePhoto(button.dataset.delete)
  } catch (err) {
    showToast({ type: 'error', message: err.message || 'Something went wrong. Please try again.' })
  }
}))

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
  await post('/cms/gallery/photos', { id, width: full.width, height: full.height })
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
      showToast({ type: 'error', message: err.message || 'Something went wrong. Please try again.' })
    } finally {
      uploadInput.disabled = false
    }
  })
}
