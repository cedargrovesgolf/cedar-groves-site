export const initLightbox = lightbox => {
  const items = [...document.querySelectorAll('.gallery-item[data-full]')]
  const figure = lightbox.querySelector('.lightbox-figure')
  const image = lightbox.querySelector('img')
  const caption = lightbox.querySelector('.lightbox-caption')
  const count = lightbox.querySelector('.lightbox-count')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let current = 0
  let step = 0
  let touchStart = null

  const wrap = index => (index + items.length) % items.length

  const preload = index => {
    new Image().src = items[wrap(index)].dataset.full
  }

  const show = index => {
    current = wrap(index)
    const { full, caption: text } = items[current].dataset
    const thumb = items[current].querySelector('img')
    image.style.setProperty('--ratio', thumb.getAttribute('width') / thumb.getAttribute('height'))
    image.src = full
    image.alt = text || 'Cedar Groves'
    caption.textContent = text
    count.textContent = `${current + 1} of ${items.length}`
    preload(current + 1)
    preload(current - 1)
  }

  const slide = async direction => {
    const id = ++step
    const offset = reducedMotion.matches ? 0 : 20
    await figure.animate(
      [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-direction * offset}px)` }],
      { duration: 70, easing: 'ease-in', fill: 'forwards' }
    ).finished
    if (id !== step) {
      return
    }
    show(current + direction)
    await image.decode().catch(() => {})
    if (id !== step) {
      return
    }
    figure.getAnimations().forEach(animation => animation.cancel())
    figure.animate(
      [{ opacity: 0, transform: `translateX(${direction * offset}px)` }, { opacity: 1, transform: 'translateX(0)' }],
      { duration: 100, easing: 'ease-out' }
    )
  }

  items.forEach((item, index) => item.addEventListener('click', () => {
    show(index)
    lightbox.showModal()
  }))

  lightbox.addEventListener('close', () => {
    step++
    figure.getAnimations().forEach(animation => animation.cancel())
  })

  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close())
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => slide(-1))
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => slide(1))

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      lightbox.close()
    }
  })

  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      slide(-1)
    } else if (event.key === 'ArrowRight') {
      slide(1)
    }
  })

  lightbox.addEventListener('touchstart', event => {
    touchStart = event.touches[0].clientX
  }, { passive: true })

  lightbox.addEventListener('touchend', event => {
    if (touchStart === null) {
      return
    }
    const distance = event.changedTouches[0].clientX - touchStart
    touchStart = null
    if (Math.abs(distance) > 50) {
      slide(distance < 0 ? 1 : -1)
    }
  })
}
