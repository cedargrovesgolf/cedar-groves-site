import 'bootstrap/js/dist/offcanvas'
import './form-control.js'
import { initLightbox } from './lightbox.js'

const lightbox = document.querySelector('.lightbox')

if (lightbox) {
  initLightbox(lightbox)
}
