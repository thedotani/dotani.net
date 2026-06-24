/**
 * Site motion — minimal, performant.
 * - Scroll reveal: [data-reveal] elements animate in with fadeUp
 * - Card spotlight: [data-card-spotlight] cursor-tracking gradient
 * - Back to top: scroll button visibility + smooth scroll
 */

let backToTopAbort: AbortController | null = null

function initScrollReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!elements.length) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => el.classList.add('revealed'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const delay = el.dataset.revealDelay
        if (delay) {
          setTimeout(() => el.classList.add('revealed'), parseInt(delay, 10))
        } else {
          el.classList.add('revealed')
        }
        observer.unobserve(el)
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  )

  elements.forEach((el) => observer.observe(el))
}

function initCardSpotlight(): void {
  const cards = document.querySelectorAll<HTMLElement>('[data-card-spotlight]')
  if (!cards.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!window.matchMedia('(hover: hover)').matches) return

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      card.style.setProperty('--card-spotlight-x', `${x}%`)
      card.style.setProperty('--card-spotlight-y', `${y}%`)
    })

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--card-spotlight-x', '50%')
      card.style.setProperty('--card-spotlight-y', '50%')
    })
  })
}

function smoothScrollToTop(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, 0)
    return
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function bindBackToTop(): void {
  backToTopAbort?.abort()
  backToTopAbort = new AbortController()
  const { signal } = backToTopAbort

  const button = document.querySelector<HTMLButtonElement>('[data-back-to-top]')
  if (!button) return

  const updateVisibility = () => {
    button.classList.toggle('back-to-top--visible', window.scrollY > 360)
  }

  button.addEventListener('click', () => smoothScrollToTop(), { signal })
  window.addEventListener('scroll', () => updateVisibility(), { passive: true, signal })
  updateVisibility()
}

function initDataMotion(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const singles = document.querySelectorAll<HTMLElement>('[data-motion]')
  const staggers = document.querySelectorAll<HTMLElement>('[data-motion-stagger]')

  if (reduced) {
    singles.forEach((el) => el.classList.add('motion-in'))
    staggers.forEach((el) => el.classList.add('motion-in'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('motion-in')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )

  singles.forEach((el) => observer.observe(el))
  staggers.forEach((el) => observer.observe(el))
}

function boot(): void {
  initScrollReveal()
  initDataMotion()
  initCardSpotlight()
  bindBackToTop()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true })
} else {
  boot()
}

document.addEventListener('astro:page-load', boot)
