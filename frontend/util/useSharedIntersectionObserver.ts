"use client"

import { useEffect, useRef, useCallback, useMemo, useState } from 'react'

interface IntersectionObserverOptions {
    threshold?: number | number[]
    root?: Element | null
    rootMargin?: string
}

interface UseIntersectionObserverReturn {
    ref: React.RefObject<HTMLElement | null>
    isIntersecting: boolean
    entry: IntersectionObserverEntry | null
}

// Shared observer instance
let sharedObserver: IntersectionObserver | null = null
let observerCallbacks = new Map<Element, Set<(entry: IntersectionObserverEntry) => void>>()

// Create shared observer
const createSharedObserver = (options: IntersectionObserverOptions = {}) => {
    if (sharedObserver) return sharedObserver

    sharedObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const callbacks = observerCallbacks.get(entry.target)
            if (callbacks) {
                callbacks.forEach((callback) => callback(entry))
            }
        })
    }, options)

    return sharedObserver
}

// Cleanup function
const cleanupSharedObserver = () => {
    if (sharedObserver) {
        sharedObserver.disconnect()
        sharedObserver = null
        observerCallbacks.clear()
    }
}

export function useSharedIntersectionObserver(
    options: IntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
    const ref = useRef<HTMLElement>(null)
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

    const observer = useMemo(() => createSharedObserver(options), [options])

    const callback = useCallback((entry: IntersectionObserverEntry) => {
        setIsIntersecting(entry.isIntersecting)
        setEntry(entry)
    }, [])

    useEffect(() => {
        const element = ref.current
        if (!element || !observer) return

        // Add callback to shared map
        if (!observerCallbacks.has(element)) {
            observerCallbacks.set(element, new Set())
        }
        observerCallbacks.get(element)!.add(callback)

        // Start observing
        observer.observe(element)

        return () => {
            // Remove callback from shared map
            const callbacks = observerCallbacks.get(element)
            if (callbacks) {
                callbacks.delete(callback)
                if (callbacks.size === 0) {
                    observerCallbacks.delete(element)
                    observer.unobserve(element)
                }
            }
        }
    }, [observer, callback])

    return { ref, isIntersecting, entry }
}

// Cleanup function for component unmount
export { cleanupSharedObserver }
