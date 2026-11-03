import express from 'express'
import { getGallery, setGallery } from '../../services/db.js'
import { reply } from '../../lib/reply.js'
import { createGalleryUploads, deleteGalleryObjects, galleryObjectsExist } from '../../services/storage.js'

const router = express.Router()

const isId = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value)

const toInt = (value, min, max) => {
  const number = Number(value)
  return Number.isInteger(number) && number >= min && number <= max ? number : null
}

const toText = (value, maxLength) => String(value ?? '').trim().slice(0, maxLength)

const toList = value => [value ?? []].flat()

router.post('/', async (req, res) => {
  const body = req.body ?? {}
  const version = toInt(body.version, 0, Number.MAX_SAFE_INTEGER)
  const ids = toList(body.id)
  const fields = [toList(body.name), toList(body.caption), toList(body.width), toList(body.height)]
  const photos = ids.map((id, index) => {
    const [name, caption, width, height] = fields.map(values => values[index])
    return {
      id,
      name: toText(name, 100),
      caption: toText(caption, 200),
      width: toInt(width, 1, 10000),
      height: toInt(height, 1, 10000)
    }
  })

  if (
    version === null ||
    fields.some(values => values.length !== ids.length) ||
    new Set(ids).size !== ids.length ||
    photos.some(photo => !isId(photo.id) || photo.width === null || photo.height === null)
  ) {
    return reply(res, 400, 'error', 'Invalid gallery.')
  }

  try {
    const gallery = await getGallery()
    const existing = new Set(gallery.photos.map(photo => photo.id))

    if (!(await galleryObjectsExist(ids.filter(id => !existing.has(id))))) {
      return reply(res, 400, 'error', 'A photo did not finish uploading. Please try again.')
    }

    await setGallery({ photos, version })
    const removed = [...existing].filter(id => !ids.includes(id))
    if (removed.length) {
      await deleteGalleryObjects(removed)
    }
    return reply(res, 200, 'success', 'Gallery saved.', { version: version + 1 })
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return reply(res, 409, 'error', 'The gallery changed since this page loaded. Reload and try again.')
    }
    console.error(err)
    return reply(res, 500, 'error', 'There was an error saving the gallery.')
  }
})

router.post('/uploads', async (req, res) => {
  const { id } = req.body ?? {}

  if (!isId(id)) {
    return reply(res, 400, 'error', 'Invalid photo.')
  }

  try {
    const gallery = await getGallery()
    if (gallery.photos.some(photo => photo.id === id)) {
      return reply(res, 400, 'error', 'Invalid photo.')
    }
    return reply(res, 200, 'success', 'Upload ready.', { uploads: await createGalleryUploads(id) })
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error preparing the upload.')
  }
})

export default router
