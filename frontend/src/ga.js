export function initGA() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!id) return
  // inject gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(){window.dataLayer.push(arguments)}
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', id)
}

export function trackEvent(action, category, label, value) {
  if (!window.gtag) return
  window.gtag('event', action, { event_category: category, event_label: label, value })
}
