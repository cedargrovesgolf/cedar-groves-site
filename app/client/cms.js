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
  saveBar.classList.add('cms-saving')
  saveStatus.textContent = 'Saving...'
  await prepareSave?.()
  saveStatus.textContent = 'Saving...'
})

form.addEventListener('settled', () => {
  saveBar.classList.remove('cms-saving')
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

const googleList = form.querySelector('[data-google-reviews]')

if (googleList) {
  const selectedList = form.querySelector('[data-selected-reviews]')
  const selectedCount = form.querySelector('[data-selected-count]')
  const filters = form.querySelector('[data-review-filters]')
  const pagination = form.querySelector('[data-review-pages]')
  const selectedTemplate = form.querySelector('[data-selected-template]')
  const googleTemplate = form.querySelector('[data-google-template]')
  const dateFormat = new Intl.DateTimeFormat('en-CA', { month: 'short', year: 'numeric' })
  const pageSize = 10
  let reviews = []
  let stars = 0
  let page = 0

  const selectedIds = () => new Set([...selectedList.querySelectorAll('input[name="id"]')].map(input => input.value))

  const fillRow = (row, review) => {
    row.querySelector('.stars').replaceChildren(...Array.from({ length: 5 }, (_, index) =>
      Object.assign(document.createElement('i'), { className: `bi ${index < review.stars ? 'bi-star-fill' : 'bi-star'}` })
    ))
    row.querySelector('.cms-review-author').textContent = review.author
    row.querySelector('.cms-review-date').textContent = dateFormat.format(new Date(review.createTime))
    row.querySelector('.cms-review-text').textContent = review.text
  }

  const availableReviews = () => {
    const selected = selectedIds()
    return reviews.filter(review => !selected.has(review.id))
  }

  const renderFilters = available => {
    const options = [[0, 'All', available.length]]
    for (const value of [5, 4, 3, 2, 1]) {
      const count = available.filter(review => review.stars === value).length
      if (count) {
        options.push([value, `${value} ${value === 1 ? 'star' : 'stars'}`, count])
      }
    }
    if (!options.some(([value]) => value === stars)) {
      stars = 0
    }
    filters.replaceChildren(...options.map(([value, label, count]) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'cms-option'
      button.dataset.stars = value
      button.textContent = `${label} (${count})`
      button.setAttribute('aria-pressed', String(value === stars))
      return button
    }))
  }

  const pageButton = (target, label, { icon, disabled = false } = {}) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'cms-page-button'
    button.dataset.page = target
    button.disabled = disabled
    if (icon) {
      button.setAttribute('aria-label', label)
      button.append(Object.assign(document.createElement('i'), { className: `bi bi-${icon}` }))
    } else {
      button.textContent = label
      if (target === page) {
        button.setAttribute('aria-current', 'page')
      }
    }
    return button
  }

  const renderGoogleList = () => {
    const available = availableReviews()
    renderFilters(available)
    const visible = available.filter(review => !stars || review.stars === stars)
    const pageCount = Math.max(1, Math.ceil(visible.length / pageSize))
    page = Math.min(page, pageCount - 1)
    googleList.replaceChildren(...visible.slice(page * pageSize, (page + 1) * pageSize).map(review => {
      const row = googleTemplate.content.firstElementChild.cloneNode(true)
      fillRow(row, review)
      row.querySelector('[data-add-review]').dataset.addReview = review.id
      return row
    }))
    pagination.hidden = pageCount < 2
    pagination.replaceChildren(
      pageButton(page - 1, 'Previous page', { icon: 'chevron-left', disabled: page === 0 }),
      ...Array.from({ length: pageCount }, (_, index) => pageButton(index, String(index + 1))),
      pageButton(page + 1, 'Next page', { icon: 'chevron-right', disabled: page === pageCount - 1 })
    )
  }

  const selectionChanged = () => {
    selectedCount.textContent = selectedList.children.length
    renderGoogleList()
    form.dispatchEvent(new Event('input'))
  }

  const addReview = id => {
    const row = selectedTemplate.content.firstElementChild.cloneNode(true)
    row.querySelector('input[name="id"]').value = id
    fillRow(row, reviews.find(review => review.id === id))
    selectedList.append(row)
    selectionChanged()
  }

  Sortable.create(selectedList, {
    animation: 150,
    delay: 150,
    delayOnTouchOnly: true,
    filter: '[data-remove-review]',
    preventOnFilter: false,
    onEnd: () => form.dispatchEvent(new Event('input'))
  })

  form.addEventListener('click', event => {
    const add = event.target.closest('[data-add-review]')
    const remove = event.target.closest('[data-remove-review]')
    const filter = event.target.closest('[data-stars]')
    const pageTarget = event.target.closest('[data-page]')
    if (add) {
      addReview(add.dataset.addReview)
    } else if (remove) {
      remove.closest('.cms-review-row').remove()
      selectionChanged()
    } else if (filter) {
      stars = Number(filter.dataset.stars)
      page = 0
      renderGoogleList()
    } else if (pageTarget) {
      page = Number(pageTarget.dataset.page)
      renderGoogleList()
      googleList.closest('section').scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      })
    } else {
      event.target.closest('.cms-review-row')?.querySelector('.cms-review-text').classList.toggle('expanded')
    }
  })

  fetch('/cms/reviews/google', { headers: { Accept: 'application/json' } })
    .then(async response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      reviews = (await response.json()).reviews
      googleList.dataset.empty = 'Every review with text is on the homepage.'
      renderGoogleList()
    })
    .catch(() => {
      googleList.dataset.empty = "Google reviews couldn't be loaded. Please try again later."
    })
}
