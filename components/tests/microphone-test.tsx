"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Mic, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MicrophoneTest() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(30).fill(0))
  const [testPassed, setTestPassed] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  const startRecording = async () => {
    try {
      setErrorMessage(null)

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      dataArrayRef.current = dataArray

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      sourceRef.current = source

      setIsRecording(true)

      const updateAudioLevel = () => {
        if (!analyserRef.current || !dataArrayRef.current) return

        analyserRef.current.getByteFrequencyData(dataArrayRef.current)

        // Calculate average volume level
        const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length
        const normalizedLevel = Math.min(100, average * 2) / 100

        setAudioLevel((prev) => {
          const newLevels = [...prev.slice(1), normalizedLevel]

          // Check if we've detected sound
          const hasSound = newLevels.some((level) => level > 0.1)
          if (hasSound) {
            setTestPassed(true)
          }

          return newLevels
        })

        animationRef.current = requestAnimationFrame(updateAudioLevel)
      }

      animationRef.current = requestAnimationFrame(updateAudioLevel)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setErrorMessage("Could not access microphone. Please check permissions.")
      setTestPassed(false)
    }
  }

  const stopRecording = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setIsRecording(false)
  }

  const resetTest = () => {
    stopRecording()
    setAudioLevel(Array(30).fill(0))
    setTestPassed(null)
    setErrorMessage(null)
  }

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-6 text-2xl font-bold">Microphone Test</h3>

      <div className="mb-8 w-full max-w-md">
        {errorMessage ? (
          <div className="mb-4 rounded-md bg-red-500/10 p-4 text-sm text-red-500">{errorMessage}</div>
        ) : (
          <>
            <div className="mb-4 flex h-32 items-end justify-center gap-1 rounded-md border bg-muted/50 p-4">
              {audioLevel.map((level, index) => (
                <motion.div
                  key={index}
                  className="w-1.5 rounded-t bg-blue-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${level * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {isRecording
                ? "Speak into your microphone to see the audio levels"
                : "Click Start to test your microphone"}
            </p>
          </>
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
        {!isRecording ? (
          <Button onClick={startRecording} disabled={isRecording} className="rounded-full">
            <Mic className="mr-2 h-4 w-4" />
            Start Test
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive" className="rounded-full">
            Stop Test
          </Button>
        )}
        <Button onClick={resetTest} variant="outline" className="rounded-full">
          Reset Test
        </Button>
      </div>
    </div>
  )
}

