export const toastEvents = new EventTarget()

export const toast = {
  show(message, type = 'success', duration = 3000) {
    const event = new CustomEvent('toast', {
      detail: { message, type, duration }
    })
    toastEvents.dispatchEvent(event)
  },
  success(message, duration) {
    this.show(message, 'success', duration)
  },
  error(message, duration) {
    this.show(message, 'error', duration)
  },
  info(message, duration) {
    this.show(message, 'info', duration)
  }
}
