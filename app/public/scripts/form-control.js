const getRecaptchaToken = siteKey => new Promise(resolve => {
  grecaptcha.ready(() => grecaptcha.execute(siteKey, { action: 'submit' }).then(resolve))
})

const toastContainer = document.createElement('div')
toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3'
document.body.append(toastContainer)

const showToast = ({ type, message }) => {
  const success = type === 'success'
  const toast = document.createElement('div')
  toast.className = `toast border-0 text-bg-${success ? 'success' : 'danger'}`
  toast.setAttribute('role', success ? 'status' : 'alert')
  toast.setAttribute('aria-live', success ? 'polite' : 'assertive')
  toast.setAttribute('aria-atomic', 'true')
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body"></div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`
  toast.querySelector('.toast-body').textContent = message
  toast.addEventListener('hidden.bs.toast', () => toast.remove())
  toastContainer.append(toast)
  bootstrap.Toast.getOrCreateInstance(toast).show()
}

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
      if (result.type === 'success' && 'reset' in form.dataset) {
        form.reset()
        form.classList.remove('was-validated')
      }
    } catch {
      showToast({ type: 'error', message: 'Something went wrong. Please try again.' })
    } finally {
      button.disabled = false
    }
  })
})
