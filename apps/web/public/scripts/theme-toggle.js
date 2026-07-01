(function () {
  var STORAGE_KEY = 'dotani-theme'
  var docEl = document.documentElement
  var btn = document.querySelector('[data-theme-toggle]')
  var darkIcon = btn?.querySelector('[data-theme-icon="dark"]')
  var lightIcon = btn?.querySelector('[data-theme-icon="light"]')

  function updateVisibility(theme) {
    var isDark = theme === 'dark'
    if (darkIcon) darkIcon.style.display = isDark ? '' : 'none'
    if (lightIcon) lightIcon.style.display = isDark ? 'none' : ''
    if (btn) btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode')
  }

  function setTheme(theme, save) {
    docEl.setAttribute('data-theme', theme)
    updateVisibility(theme)
    if (save !== false) {
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }

  try {
    var stored = localStorage.getItem(STORAGE_KEY)
    var theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    docEl.setAttribute('data-theme', theme)
    docEl.style.transition = 'none'
    updateVisibility(theme)
    void docEl.offsetHeight
    docEl.style.transition = ''
  } catch (_) {
    docEl.setAttribute('data-theme', 'light')
    updateVisibility('light')
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light', false)
      }
    })

  btn?.addEventListener('click', function () {
    var current = docEl.getAttribute('data-theme')
    setTheme(current === 'dark' ? 'light' : 'dark')
  })
})()
