'use client'

import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number    // ms
  y?: number        // px translateY distance
}

export default function Reveal({ children, className = '', delay = 0, y = 22 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.style.opacity = '0'
    el.style.transform = `translateY(${y}px)`
    el.style.transition = `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms`

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [delay, y])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
