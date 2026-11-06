"use client"
import { useState, useCallback, useEffect, useRef } from "react"
import { useSharedIntersectionObserver } from "./useSharedIntersectionObserver"

interface UseOdometerCounterProps {
  className?: string
  dataCount: number
  duration?: number
}

export const useOdometerCounter = ({
  className = "odometer",
  dataCount,
  duration = 2000
}: UseOdometerCounterProps) => {
  const [isCounted, setIsCounted] = useState(false)
  const [currentValue, setCurrentValue] = useState(0)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const { ref, isIntersecting } = useSharedIntersectionObserver({
    threshold: 0.5
  })

  const animateCounter = useCallback(() => {
    if (isCounted || animationRef.current) return

    setIsCounted(true)
    let startValue = 0
    const endValue = dataCount
    const stepTime = 50
    const steps = Math.ceil(duration / stepTime)
    const increment = Math.ceil(endValue / steps)

    animationRef.current = setInterval(() => {
      startValue += increment
      if (startValue >= endValue) {
        if (animationRef.current) {
          clearInterval(animationRef.current)
          animationRef.current = null
        }
        setCurrentValue(endValue)
      } else {
        setCurrentValue(startValue)
      }
    }, stepTime)
  }, [dataCount, duration, isCounted])

  // Trigger animation when element becomes visible
  useEffect(() => {
    if (isIntersecting && !isCounted) {
      animateCounter()
    }
  }, [isIntersecting, isCounted, animateCounter])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
        animationRef.current = null
      }
    }
  }, [])

  return { ref, currentValue, isCounted }
}
