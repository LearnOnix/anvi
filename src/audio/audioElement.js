// A single real <audio> element for the whole app. It never needs to be
// mounted in the DOM tree — the browser is happy to play it as a detached
// object — so no ref-drilling through components is required at all.
export const audioEl = new Audio()
audioEl.preload = 'metadata'
