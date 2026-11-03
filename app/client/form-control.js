import { showToast } from './toast.js'

const beforeSubmitHandlers = new WeakMap()

export const beforeSubmit = (form, handler) => beforeSubmitHandlers.set(form, handler)

const getRecaptchaToken = siteKey => new Promise(resolve => {
  grecaptcha.ready(() => grecaptcha.execute(siteKey, { action: 'submit' }).then(resolve))
})

const updateEmailFeedback = form => {
  form.querySelectorAll('input[type="email"]').forEach(input => {
    const feedback = input.nextElementSibling
    if (feedback?.matches('.invalid-feedback')) {
      feedback.textContent = input.value ? 'Email address is invalid.' : 'Email address is required.'
    }
  })
}

document.querySelectorAll('form[data-async]').forEach(form => {
  const button = form.querySelector('button[type="submit"]')

  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (!form.checkValidity()) {
      updateEmailFeedback(form)
      form.classList.add('was-validated')
      return
    }

    button.disabled = true
    try {
      if (form.dataset.recaptcha) {
        form.elements.recaptchaResponse.value = await getRecaptchaToken(form.dataset.recaptcha)
      }
      await beforeSubmitHandlers.get(form)?.()
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(new FormData(form))
      })
      const result = await response.json()
      if (result.redirect) {
        window.location.assign(result.redirect)
        return
      }
      showToast(result)
      if (result.type === 'success') {
        form.classList.remove('was-validated')
        if ('reset' in form.dataset) {
          form.reset()
        }
        form.dispatchEvent(new CustomEvent('saved', { detail: result }))
      }
    } catch {
      showToast({ type: 'error', message: 'Something went wrong. Please try again.' })
    } finally {
      button.disabled = false
      form.dispatchEvent(new Event('settled'))
    }
  })
})
