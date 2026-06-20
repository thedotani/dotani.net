import Lenis from 'lenis'

let lenis: Lenis | null = null
let backToTopAbort: AbortController | null = null

const SCROLL_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
const SCROLL_TO_TOP_DURATION_S = 1.2
const SCROLL_TO_TOP_DURATION_MS = SCROLL_TO_TOP_DURATION_S * 1000

export function getLenis(): Lenis | null {
  return lenis
}

export function initSiteMotion(): void {
  initScrollAnimations()
  initLenisSmoothScroll()
  initParallax()
  bindBackToTop()
}

function initLenisSmoothScroll(): void {
  if (lenis) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  try {
    lenis = new Lenis({
      autoRaf: true,
      duration: 1.4,
      easing: SCROLL_EASING,
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
      infinite: false,
    })

    document.documentElement.classList.add('lenis', 'lenis-smooth')

    let ticking = false
    lenis.on('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.dispatchEvent(
            new CustomEvent('site-scroll', {
              detail: { scrollY: lenis?.scroll ?? window.scrollY },
            }),
          )
          ticking = false
        })
        ticking = true
      }
    })
  } catch (error) {
    console.warn('[site-motion] Lenis failed to initialize', error)
  }
}

function initScrollAnimations(): void {
  const singles = document.querySelectorAll<HTMLElement>('[data-motion]')
  const staggers = document.querySelectorAll<HTMLElement>('[data-motion-stagger]')
  if (!singles.length && !staggers.length) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    singles.forEach((el) => el.classList.add('motion-active'))
    staggers.forEach((el) => el.classList.add('motion-active'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('motion-active')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  )

  singles.forEach((el) => observer.observe(el))
  staggers.forEach((el) => observer.observe(el))
}

function initParallax(): void {
  const layers = document.querySelectorAll<HTMLElement>('[data-parallax]')
  if (!layers.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Cache rect calculations for better performance
  const layerData = new Map<HTMLElement, { speed: number; height: number }>()

  layers.forEach((el) => {
    layerData.set(el, {
      speed: Number(el.dataset.parallax || '0.1'),
      height: el.offsetHeight,
    })
  })

  let ticking = false
  const update = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        layers.forEach((el) => {
          const data = layerData.get(el)
          if (!data) return
          const rect = el.getBoundingClientRect()
          const offset = (rect.top + rect.height * 0.5 - window.innerHeight * 0.5) * data.speed
          el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
        })
        ticking = false
      })
      ticking = true
    }
  }

  document.addEventListener('site-scroll', update)
  window.addEventListener('scroll', update, { passive: true })
}

function getScrollY(): number {
  return lenis?.scroll ?? window.scrollY
}

function animateNativeScrollTo(top: number): void {
  const startY = getScrollY()
  const distance = top - startY
  if (Math.abs(distance) < 1) return

  const startTime = performance.now()

  const tick = (now: number) => {
    const progress = Math.min((now - startTime) / SCROLL_TO_TOP_DURATION_MS, 1)
    const nextY = startY + distance * SCROLL_EASING(progress)
    window.scrollTo(0, nextY)
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

export function scrollToTop(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, programmatic: true })
    } else {
      window.scrollTo(0, 0)
    }
    return
  }

  if (lenis) {
    lenis.scrollTo(0, {
      duration: SCROLL_TO_TOP_DURATION_S,
      easing: SCROLL_EASING,
      programmatic: true,
      force: true,
    })
    return
  }

  animateNativeScrollTo(0)
}

function bindBackToTop(): void {
  backToTopAbort?.abort()
  backToTopAbort = new AbortController()
  const { signal } = backToTopAbort

  const button = document.querySelector<HTMLButtonElement>('[data-back-to-top]')
  if (!button) return

  const updateVisibility = (scrollY = getScrollY()) => {
    button.classList.toggle('back-to-top-visible', scrollY > 360)
  }

  button.addEventListener('click', () => scrollToTop(), { signal })

  document.addEventListener(
    'site-scroll',
    (event) => {
      const detail = (event as CustomEvent<{ scrollY: number }>).detail
      updateVisibility(detail?.scrollY ?? getScrollY())
    },
    { signal },
  )
  window.addEventListener('scroll', () => updateVisibility(), { passive: true, signal })
  updateVisibility()
}

function initScrollProgress(): void {
  // Create progress indicator if it doesn't exist
  if (!document.querySelector('[data-scroll-progress]')) {
    const indicator = document.createElement('div')
    indicator.setAttribute('data-scroll-progress', '')
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      transform-origin: left;
      z-index: 100;
      transition: width 100ms ease-out;
      box-shadow: 0 0 8px var(--color-primary);
    `
    document.body.appendChild(indicator)
  }

  const updateProgress = (scrollY: number) => {
    const indicator = document.querySelector<HTMLElement>('[data-scroll-progress]')
    if (!indicator) return
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0
    indicator.style.width = `${Math.min(100, progress)}%`
  }

  lenis?.on('scroll', () => {
    updateProgress(lenis?.scroll ?? window.scrollY)
  })
  window.addEventListener('scroll', () => updateProgress(window.scrollY), { passive: true })
}

function initHeaderVisibility(): void {
  const header = document.querySelector<HTMLElement>('.site-header')
  if (!header || !lenis) return

  let lastScrollY = 0
  let ticking = false

  const updateHeader = () => {
    const scrollY = lenis?.scroll ?? window.scrollY
    const scrolled = scrollY > 50

    header.classList.toggle('header-scrolled', scrolled)

    // Only hide on mobile when scrolling down significantly
    if (window.innerWidth < 768) {
      if (scrollY > lastScrollY && scrollY > 400) {
        header.style.transform = 'translateY(-100%)'
      } else {
        header.style.transform = 'translateY(0)'
      }
    }

    lastScrollY = scrollY
    ticking = false
  }

  lenis.on('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader)
      ticking = true
    }
  })
}

function boot(): void {
  document.documentElement.classList.add('motion-ready')
  initSiteMotion()
  initScrollProgress()
  initHeaderVisibility()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true })
} else {
  boot()
}

document.addEventListener('astro:page-load', boot)