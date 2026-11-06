"use client"

import gsap from "gsap"
import { useEffect, useRef } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// We'll dynamically import SplitText
let SplitText: any

export default function useTextAnimation2() {
  const elementsRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    // Make sure we're on the client
    if (typeof window === "undefined") return

    const setupAnimation = async () => {
      // Register ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      // Try to dynamically import SplitText
      try {
        const gsapAll = await import("gsap/all")
        SplitText = gsapAll.SplitText
        gsap.registerPlugin(SplitText)
      } catch (error) {
        console.warn("SplitText plugin not available. Falling back to simpler animation.")
      }

      // Select all elements with the class 'text-anime-style-2'
      const elements = document.querySelectorAll('.text-anime-style-2')
      elementsRef.current = Array.from(elements) as HTMLElement[]

      elementsRef.current.forEach((element) => {
        let chars: HTMLElement[] | null = null

        // Use SplitText if available, otherwise fallback to simple spans
        if (SplitText) {
          const split = new SplitText(element, {
            type: "chars",
            charsClass: "split-char",
          })
          chars = split.chars
        } else {
          // Simple fallback: wrap each character in a span
          const text = element.textContent || ""
          element.innerHTML = text.split('').map(char => `<span class="split-char">${char}</span>`).join('')
          chars = Array.from(element.querySelectorAll('.split-char'))
        }

        // Set initial styles
        gsap.set(element, { perspective: 400 })
        gsap.set(chars, {
          opacity: 0,
          x: "50",
        })

        // Create animation timeline
        gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
          }
        }).to(chars, {
          x: "0",
          y: "0",
          rotateX: "0",
          opacity: 1,
          duration: 1,
          ease: "back.out",
          stagger: 0.02,
        })
      })
    }

    setupAnimation()

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // This component doesn't render anything itself
  return null
}
