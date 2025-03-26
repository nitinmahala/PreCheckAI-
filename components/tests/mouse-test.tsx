"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, MousePointer, MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MouseTest() {
  const deviceRef = useRef<HTMLDivElement>(null)
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([])
  const [hasMoved, setHasMoved] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [testPassed, setTestPassed] = useState<boolean | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isInside, setIsInside] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(true)
      checkTestStatus()
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    checkTestStatus()
  }, [clicks, hasMoved, hasScrolled])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasMoved) {
      setHasMoved(true)
    }

    if (deviceRef.current) {
      const rect = deviceRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Keep cursor within bounds
      const boundedX = Math.max(0, Math.min(rect.width, x))
      const boundedY = Math.max(0, Math.min(rect.height, y))

      setMousePosition({ x: boundedX, y: boundedY })
    }
  }

  const handleMouseEnter = () => {
    setIsInside(true)
  }

  const handleMouseLeave = () => {
    setIsInside(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (deviceRef.current) {
      const rect = deviceRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setClicks((prev) => [...prev, { x, y }])
    }
  }

  const checkTestStatus = () => {
    if (clicks.length >= 3 && hasMoved) {
      setTestPassed(true)
    }
  }

  const resetTest = () => {
    setClicks([])
    setHasMoved(false)
    setHasScrolled(false)
    setTestPassed(null)
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-6 text-2xl font-bold">Mouse Test</h3>

      <div className="mb-8 w-full max-w-md">
        {/* Device mockup */}
        <div className="mx-auto w-full max-w-xs">
          <div className="relative mx-auto rounded-[2.5rem] border-[14px] border-gray-800 bg-gray-800">
            <div className="absolute -top-[14px] left-1/2 h-6 w-24 -translate-x-1/2 rounded-b-3xl bg-gray-800"></div>
            <div
              ref={deviceRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              className="relative h-[420px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
            >
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                Move and click your mouse in this area
              </div>

              {/* Mouse cursor */}
              {isInside && (
                <motion.div
                  className="absolute z-20 text-blue-500"
                  style={{ left: mousePosition.x, top: mousePosition.y }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <MousePointer className="h-6 w-6 -translate-x-3 -translate-y-3" />
                </motion.div>
              )}

              {/* Click indicators */}
              {clicks.map((click, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.7] }}
                  transition={{ duration: 0.5 }}
                  className="absolute z-10 text-blue-500"
                  style={{ left: click.x, top: click.y }}
                >
                  <MousePointerClick className="h-6 w-6 -translate-x-3 -translate-y-3" />
                </motion.div>
              ))}

              {/* App icons */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm dark:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="h-6 w-6 rounded-md bg-blue-500/50"></div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-[14px] left-1/2 h-6 w-32 -translate-x-1/2 rounded-t-3xl bg-gray-800"></div>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${hasMoved ? "bg-green-500" : "bg-muted"}`}></div>
            <span className="text-sm">Mouse movement: {hasMoved ? "Detected" : "Not detected"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${clicks.length > 0 ? "bg-green-500" : "bg-muted"}`}></div>
            <span className="text-sm">
              Mouse clicks: {clicks.length > 0 ? `${clicks.length}/3 detected` : "Not detected"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${hasScrolled ? "bg-green-500" : "bg-muted"}`}></div>
            <span className="text-sm">Scrolling: {hasScrolled ? "Detected" : "Not detected"}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium">Test Status:</span>
        {testPassed === null ? (
          <span className="text-sm text-muted-foreground">Complete all tasks...</span>
        ) : testPassed ? (
          <span className="flex items-center gap-1 text-sm font-medium text-green-500">
            <Check className="h-4 w-4" /> Passed
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm font-medium text-red-500">
            <X className="h-4 w-4" /> Failed
          </span>
        )}
      </div>

      <Button onClick={resetTest} variant="outline" className="rounded-full">
        Reset Test
      </Button>
    </div>
  )
}

