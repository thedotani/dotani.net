import {useEffect} from 'react'

const LIST_MIN = 180
const ICON_RAIL_WIDTH = 56
const FORM_CONTENT_MAX_PX = 800

function getPaneLayout() {
  return document.querySelector('[data-ui="PaneLayout"]')
}

function documentPaneIsOpen(root: ParentNode) {
  return Boolean(root.querySelector('[data-testid="document-pane"]'))
}

function clearPaneOverrides(el: HTMLElement) {
  delete el.dataset.dotaniMode
  delete el.dataset.dotaniPatched
  el.style.minWidth = ''
  el.style.maxWidth = ''
  el.style.width = ''
  el.style.flex = ''
  el.style.overflow = ''
}

function collapsePaneButton(pane: HTMLElement) {
  const header = pane.querySelector('[data-ui="PaneHeader"]')
  if (!header) return

  const buttons = header.querySelectorAll('button[aria-label]')
  for (const button of buttons) {
    const label = button.getAttribute('aria-label') || ''
    if (label.toLowerCase().includes('collapse') && !pane.dataset.paneCollapsed) {
      button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
      break
    }
  }
}

function patchPane(el: HTMLElement, hasDocument: boolean) {
  const ui = el.dataset.ui
  const index = el.dataset.paneIndex
  const isListPane = ui === 'ListPane' || ui === 'DocumentListPane'
  const isDocumentPane = Boolean(el.querySelector('[data-testid="document-pane"]'))

  if (!hasDocument || isDocumentPane) {
    if (el.dataset.dotaniPatched) clearPaneOverrides(el)
    return
  }

  el.dataset.dotaniPatched = 'true'

  if (ui === 'ListPane' && index === '0') {
    el.dataset.dotaniMode = 'icon-rail'
    el.style.minWidth = `${ICON_RAIL_WIDTH}px`
    el.style.maxWidth = `${ICON_RAIL_WIDTH}px`
    el.style.width = `${ICON_RAIL_WIDTH}px`
    el.style.flex = `0 0 ${ICON_RAIL_WIDTH}px`
    return
  }

  if (ui === 'DocumentListPane' || (ui === 'ListPane' && index === '1')) {
    el.dataset.dotaniMode = 'collapsed-list'

    if (el.dataset.paneCollapsed !== 'true') {
      collapsePaneButton(el)
    }

    el.style.minWidth = `${LIST_MIN}px`
    el.style.maxWidth = `${LIST_MIN}px`
    el.style.width = `${LIST_MIN}px`
    el.style.flex = `0 0 ${LIST_MIN}px`
    el.style.overflow = 'hidden'
  }
}

function syncFormContentWidth() {
  const scroller = document.querySelector('[data-testid="document-panel-scroller"]')
  if (!scroller) return

  const form = scroller.querySelector('[data-testid="form-view"]')
  if (!form) return

  let target: HTMLElement | null = form.parentElement
  while (target && target !== scroller) {
    const maxWidth = getComputedStyle(target).maxWidth
    if (maxWidth !== 'none' && maxWidth !== '0px') {
      break
    }
    target = target.parentElement
  }

  if (!target || target === scroller) {
    target = scroller.firstElementChild instanceof HTMLElement ? scroller.firstElementChild : null
  }

  if (!target) return

  const gutterSize = getComputedStyle(target).getPropertyValue('--formGutterSize').trim() || '0px'
  const gutterGap = getComputedStyle(target).getPropertyValue('--formGutterGap').trim() || '0px'
  const nextMaxWidth = `calc(${FORM_CONTENT_MAX_PX}px + (${gutterSize} * 2) + (${gutterGap} * 2))`

  if (target.style.getPropertyValue('max-width') !== nextMaxWidth) {
    target.style.setProperty('max-width', nextMaxWidth, 'important')
  }
}

function syncPanes() {
  const layout = getPaneLayout()
  if (!layout) return

  const hasDocument = documentPaneIsOpen(layout)
  layout.querySelectorAll<HTMLElement>('[data-ui="Pane"]').forEach((pane) => {
    patchPane(pane, hasDocument)
  })

  if (hasDocument) {
    syncFormContentWidth()
  }
}

export function PaneResizeManager() {
  useEffect(() => {
    syncPanes()

    const observer = new MutationObserver(() => {
      syncPanes()
    })

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'data-pane-index', 'data-ui', 'data-testid', 'data-pane-collapsed'],
    })

    return () => observer.disconnect()
  }, [])

  return null
}