import {useEffect} from 'react'

const SCROLLER = '[data-testid="document-panel-scroller"]'

function clearMarkers(root: ParentNode) {
  root.querySelectorAll('[data-dotani-doc-sidebar]').forEach((el) => {
    el.removeAttribute('data-dotani-doc-sidebar')
  })
  root.querySelectorAll('[data-dotani-doc-shell]').forEach((el) => {
    el.removeAttribute('data-dotani-doc-shell')
  })
}

function findFormShell(fieldGroups: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = fieldGroups.parentElement

  while (node) {
    if (node.matches(SCROLLER)) break
    if (node.getAttribute('data-ui') === 'Stack') return node
    node = node.parentElement
  }

  return null
}

function markDocumentLayout() {
  const scroller = document.querySelector(SCROLLER)
  if (!scroller) return

  clearMarkers(scroller)

  const firstGroups = scroller.querySelector('[data-testid="field-groups"]')
  if (!(firstGroups instanceof HTMLElement)) return

  const shell = findFormShell(firstGroups)
  if (!shell) return

  firstGroups.setAttribute('data-dotani-doc-sidebar', 'true')
  shell.setAttribute('data-dotani-doc-shell', 'true')
}

export function DocumentLayoutMarker() {
  useEffect(() => {
    let frame = 0

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(markDocumentLayout)
    }

    schedule()

    const observer = new MutationObserver(schedule)
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-testid', 'data-ui', 'aria-selected'],
    })

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      const scroller = document.querySelector(SCROLLER)
      if (scroller) clearMarkers(scroller)
    }
  }, [])

  return null
}