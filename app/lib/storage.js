import { DeleteObjectsCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import config from '../config.js'

const client = new S3Client()

const maxUploadBytes = 5 * 1024 * 1024

export const galleryUrls = id => ({
  full: `/assets/gallery/${id}.jpg`,
  thumb: `/assets/gallery/${id}-thumb.jpg`
})

export const withGalleryUrls = photo => ({ ...photo, ...galleryUrls(photo.id) })

export const shownPhotos = gallery => gallery.photos.filter(photo => photo.shown).map(withGalleryUrls)

const galleryKeys = id => Object.values(galleryUrls(id)).map(url => url.slice(1))

const createUpload = Key => createPresignedPost(client, {
  Bucket: config.assetsBucket,
  Key,
  Conditions: [
    ['content-length-range', 1, maxUploadBytes],
    ['eq', '$Content-Type', 'image/jpeg']
  ],
  Fields: { 'Content-Type': 'image/jpeg' },
  Expires: 300
})

export const createGalleryUploads = async id => {
  const [full, thumb] = await Promise.all(galleryKeys(id).map(createUpload))
  return { full, thumb }
}

export const galleryObjectsExist = async id => {
  try {
    await Promise.all(galleryKeys(id).map(Key =>
      client.send(new HeadObjectCommand({ Bucket: config.assetsBucket, Key }))))
    return true
  } catch (err) {
    if (err.name === 'NotFound') {
      return false
    }
    throw err
  }
}

export const deleteGalleryObjects = async ids => {
  await client.send(new DeleteObjectsCommand({
    Bucket: config.assetsBucket,
    Delete: { Objects: ids.flatMap(galleryKeys).map(Key => ({ Key })) }
  }))
}
