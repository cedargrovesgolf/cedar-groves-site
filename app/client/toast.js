import Toast from 'bootstrap/js/dist/toast'

const container = document.createElement('div')
container.className = 'toast-container position-fixed bottom-0 end-0 p-3'
document.body.append(container)

export const showToast = ({ type, message }) => {
  const success = type === 'success'
  const toast = document.createElement('div')
  toast.className = `toast border-0 ${success ? 'bg-acc text-white' : 'text-bg-danger'}`
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
  container.append(toast)
  Toast.getOrCreateInstance(toast).show()
}
