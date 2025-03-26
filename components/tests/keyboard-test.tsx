"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function KeyboardTest() {
  const [pressedKeys, setPressedKeys] = useState<string[]>([])
  const [testPassed, setTestPassed] = useState<boolean | null>(null)

  // Define keyboard layout - more realistic
  const keyboardRows = [
    [
      { key: "Esc", width: "w-12" },
      { key: "F1", width: "w-12" },
      { key: "F2", width: "w-12" },
      { key: "F3", width: "w-12" },
      { key: "F4", width: "w-12" },
      { key: "F5", width: "w-12" },
      { key: "F6", width: "w-12" },
      { key: "F7", width: "w-12" },
      { key: "F8", width: "w-12" },
      { key: "F9", width: "w-12" },
      { key: "F10", width: "w-12" },
      { key: "F11", width: "w-12" },
      { key: "F12", width: "w-12" },
    ],
    [
      { key: "`", width: "w-12" },
      { key: "1", width: "w-12" },
      { key: "2", width: "w-12" },
      { key: "3", width: "w-12" },
      { key: "4", width: "w-12" },
      { key: "5", width: "w-12" },
      { key: "6", width: "w-12" },
      { key: "7", width: "w-12" },
      { key: "8", width: "w-12" },
      { key: "9", width: "w-12" },
      { key: "0", width: "w-12" },
      { key: "-", width: "w-12" },
      { key: "=", width: "w-12" },
      { key: "Backspace", width: "w-20" },
    ],
    [
      { key: "Tab", width: "w-16" },
      { key: "q", width: "w-12" },
      { key: "w", width: "w-12" },
      { key: "e", width: "w-12" },
      { key: "r", width: "w-12" },
      { key: "t", width: "w-12" },
      { key: "y", width: "w-12" },
      { key: "u", width: "w-12" },
      { key: "i", width: "w-12" },
      { key: "o", width: "w-12" },
      { key: "p", width: "w-12" },
      { key: "[", width: "w-12" },
      { key: "]", width: "w-12" },
      { key: "\\", width: "w-16" },
    ],
    [
      { key: "CapsLock", width: "w-20" },
      { key: "a", width: "w-12" },
      { key: "s", width: "w-12" },
      { key: "d", width: "w-12" },
      { key: "f", width: "w-12" },
      { key: "g", width: "w-12" },
      { key: "h", width: "w-12" },
      { key: "j", width: "w-12" },
      { key: "k", width: "w-12" },
      { key: "l", width: "w-12" },
      { key: ";", width: "w-12" },
      { key: "'", width: "w-12" },
      { key: "Enter", width: "w-20" },
    ],
    [
      { key: "Shift", width: "w-24" },
      { key: "z", width: "w-12" },
      { key: "x", width: "w-12" },
      { key: "c", width: "w-12" },
      { key: "v", width: "w-12" },
      { key: "b", width: "w-12" },
      { key: "n", width: "w-12" },
      { key: "m", width: "w-12" },
      { key: ",", width: "w-12" },
      { key: ".", width: "w-12" },
      { key: "/", width: "w-12" },
      { key: "Shift", width: "w-24" },
    ],
    [
      { key: "Ctrl", width: "w-16" },
      { key: "Win", width: "w-16" },
      { key: "Alt", width: "w-16" },
      { key: "Space", width: "w-64" },
      { key: "Alt", width: "w-16" },
      { key: "Fn", width: "w-16" },
      { key: "Ctrl", width: "w-16" },
    ],
  ]

  // Arrow keys
  const arrowKeys = [
    { key: "↑", x: 1, y: 0 },
    { key: "←", x: 0, y: 1 },
    { key: "↓", x: 1, y: 1 },
    { key: "→", x: 2, y: 1 },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()

      let keyName = e.key
      if (keyName === " ") keyName = "Space"
      if (keyName === "Control") keyName = "Ctrl"
      if (keyName === "Meta") keyName = "Win"
      if (keyName === "ArrowUp") keyName = "↑"
      if (keyName === "ArrowDown") keyName = "↓"
      if (keyName === "ArrowLeft") keyName = "←"
      if (keyName === "ArrowRight") keyName = "→"
      if (keyName === "Escape") keyName = "Esc"

      if (!pressedKeys.includes(keyName)) {
        setPressedKeys((prev) => [...prev, keyName])
      }

      if (pressedKeys.length >= 4) {
        setTestPassed(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [pressedKeys])

  const resetTest = () => {
    setPressedKeys([])
    setTestPassed(null)
  }

  // Function to determine if a key is pressed
  const isKeyPressed = (key: string) => {
    return pressedKeys.includes(key)
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-6 text-2xl font-bold">Keyboard Test</h3>

      <div className="mb-8 w-full max-w-4xl">
        <p className="mb-4 text-center text-muted-foreground">Press at least 5 different keys on your keyboard</p>

        {/* Virtual keyboard */}
        <div className="mx-auto w-full max-w-4xl rounded-xl border bg-black/10 p-4 backdrop-blur-sm dark:bg-white/5">
          {/* Main keyboard */}
          <div className="mb-4">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="mb-1 flex flex-wrap justify-center gap-1">
                {row.map((keyObj) => (
                  <motion.div
                    key={keyObj.key}
                    className={`${keyObj.width} flex h-10 items-center justify-center rounded-md border ${
                      isKeyPressed(keyObj.key)
                        ? "border-blue-500 bg-blue-500/20 text-blue-500 shadow-lg shadow-blue-500/20"
                        : "border-gray-200/20 bg-white/5 text-gray-400"
                    } text-sm font-medium transition-all`}
                    animate={
                      isKeyPressed(keyObj.key) ? { scale: [1, 1.1, 1], borderColor: ["#3b82f6", "#3b82f6"] } : {}
                    }
                  >
                    {keyObj.key}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          {/* Arrow keys */}
          <div className="mt-2 flex justify-center">
            <div className="grid grid-cols-3 gap-1">
              {arrowKeys.map((keyObj) => (
                <motion.div
                  key={keyObj.key}
                  style={{ gridColumn: keyObj.x + 1, gridRow: keyObj.y + 1 }}
                  className={`flex h-10 w-12 items-center justify-center rounded-md border ${
                    isKeyPressed(keyObj.key)
                      ? "border-blue-500 bg-blue-500/20 text-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-gray-200/20 bg-white/5 text-gray-400"
                  } text-sm font-medium transition-all`}
                  animate={isKeyPressed(keyObj.key) ? { scale: [1, 1.1, 1], borderColor: ["#3b82f6", "#3b82f6"] } : {}}
                >
                  {keyObj.key}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-2 text-center text-sm font-medium">Keys Pressed</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {pressedKeys.length > 0 ? (
              pressedKeys.map((key, index) => (
                <motion.div
                  key={`${key}-${index}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-8 min-w-8 items-center justify-center rounded-md border border-blue-500/50 bg-blue-500/10 px-2 font-mono text-sm text-blue-500"
                >
                  {key}
                </motion.div>
              ))
            ) : (
              <div className="text-muted-foreground">No keys pressed yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium">Test Status:</span>
        {testPassed === null ? (
          <span className="text-sm text-muted-foreground">Waiting for input...</span>
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

