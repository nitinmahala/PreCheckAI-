"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [testPassed, setTestPassed] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      setErrorMessage(null)

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) videoRef.current.play()
          setIsActive(true)
          setTestPassed(true)
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setErrorMessage("Could not access camera. Please check permissions.")
      setTestPassed(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsActive(false)
  }

  const resetTest = () => {
    stopCamera()
    setTestPassed(null)
    setErrorMessage(null)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-6 text-2xl font-bold">Camera Test</h3>

      <div className="mb-8 w-full max-w-md">
        {errorMessage ? (
          <div className="mb-4 rounded-md bg-red-500/10 p-4 text-sm text-red-500">{errorMessage}</div>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/50">
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <Camera className="mb-2 h-8 w-8" />
                <span>Camera preview will appear here</span>
              </div>
            )}
            <video
              ref={videoRef}
              className={`h-full w-full object-cover ${!isActive ? "hidden" : ""}`}
              muted
              playsInline
            />
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium">Test Status:</span>
        {testPassed === null ? (
          <span className="text-sm text-muted-foreground">Not started</span>
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

      <div className="flex gap-2">
        {!isActive ? (
          <Button onClick={startCamera} disabled={isActive}>
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <Button onClick={stopCamera} variant="destructive">
            Stop Camera
          </Button>
        )}
        <Button onClick={resetTest} variant="outline">
          Reset Test
        </Button>
      </div>
    </div>
  )
}

