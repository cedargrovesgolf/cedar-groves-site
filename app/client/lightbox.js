export const initLightbox = lightbox => {
  const items = [...document.querySelectorAll('.gallery-item[data-full]')]
  const image = lightbox.querySelector('img')
  const caption = lightbox.querySelector('figcaption')
  let current = 0

  const show = index => {
    current = (index + items.length) % items.length
    const { full, caption: text } = items[current].dataset
    image.src = full
    image.alt = text || 'Cedar Groves'
    caption.textContent = text
    caption.hidden = !text
  }

  items.forEach((item, index) => item.addEventListener('click', () => {
    show(index)
    lightbox.showModal()
  }))

  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close())
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1))
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1))

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      lightbox.close()
    }
  })

  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      show(current - 1)
    } else if (event.key === 'ArrowRight') {
      show(current + 1)
    }
  })
}
