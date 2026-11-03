import 'bootstrap/js/dist/offcanvas'
import './form-control.js'
import { initLightbox } from './lightbox.js'
import { showToast } from './toast.js'

const lightbox = document.querySelector('.lightbox')

if (lightbox) {
  initLightbox(lightbox)
}

document.querySelectorAll('[data-toast]').forEach(element => {
  showToast({ type: 'error', message: element.dataset.toast })
})
