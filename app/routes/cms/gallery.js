import crypto from 'node:crypto'
import express from 'express'
import { getGallery, setGallery } from '../../lib/db.js'
import { reply } from '../../lib/reply.js'
import { createGalleryUploads, deleteGalleryObjects, galleryObjectsExist } from '../../lib/storage.js'

const router = express.Router()

const isId = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value)

const toInt = (value, min, max) => {
  const number = Number(value)
  return Number.isInteger(number) && number >= min && number <= max ? number : null
}

router.post('/', async (req, res) => {
  const body = req.body ?? {}
  const order = [body.order ?? []].flat()
  const homeCount = toInt(body.homeCount, 0, 24)

  if (homeCount === null) {
    return reply(res, 400, 'error', 'Homepage photos must be a number from 0 to 24.')
  }

  try {
    const gallery = await getGallery()
    const existing = new Map(gallery.photos.map(photo => [photo.id, photo]))
    if (order.length !== existing.size || new Set(order).size !== order.length || !order.every(id => existing.has(id))) {
      return reply(res, 409, 'error', 'The gallery changed since this page loaded. Reload and try again.')
    }

    const photos = order.map(id => ({
      ...existing.get(id),
      caption: String(body[`caption_${id}`] ?? '').trim().slice(0, 200),
      shown: Boolean(body[`shown_${id}`]),
      isNew: false
    }))

    await setGallery({ homeCount, photos })
    return reply(res, 200, 'success', 'Gallery saved.')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error saving the gallery.')
  }
})

router.post('/uploads', async (req, res) => {
  try {
    const id = crypto.randomUUID()
    return reply(res, 200, 'success', 'Upload ready.', { id, uploads: await createGalleryUploads(id) })
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error preparing the upload.')
  }
})

router.post('/photos', async (req, res) => {
  const { id } = req.body ?? {}
  const width = toInt(req.body?.width, 1, 10000)
  const height = toInt(req.body?.height, 1, 10000)

  if (!isId(id) || width === null || height === null) {
    return reply(res, 400, 'error', 'Invalid photo.')
  }

  try {
    if (!(await galleryObjectsExist(id))) {
      return reply(res, 400, 'error', 'The photo did not finish uploading. Please try again.')
    }
    const gallery = await getGallery()
    if (!gallery.photos.some(photo => photo.id === id)) {
      gallery.photos.push({ id, caption: '', shown: false, isNew: true, width, height })
      await setGallery(gallery)
    }
    return reply(res, 200, 'success', 'Photo uploaded.')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error saving the photo.')
  }
})

router.post('/photos/:id/delete', async (req, res) => {
  const { id } = req.params

  if (!isId(id)) {
    return reply(res, 400, 'error', 'Invalid photo.')
  }

  try {
    const gallery = await getGallery()
    await setGallery({ ...gallery, photos: gallery.photos.filter(photo => photo.id !== id) })
    await deleteGalleryObjects(id)
    return reply(res, 200, 'success', 'Photo deleted.')
  } catch (err) {
    console.error(err)
    return reply(res, 500, 'error', 'There was an error deleting the photo.')
  }
})

export default router
