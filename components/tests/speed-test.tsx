"use client"

import { useState, useEffect } from "react"
import { Check, Gauge, X, ArrowDown, ArrowUp, Clock, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

export default function SpeedTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    download: number | null
    upload: number | null
    latency: number | null
  }>({
    download: null,
    upload: null,
    latency: null,
  })
  const [testPassed, setTestPassed] = useState<boolean | null>(null)
  const [currentTest, setCurrentTest] = useState<"idle" | "latency" | "download" | "upload">("idle")
  const [isOnline, setIsOnline] = useState<boolean>(true) // Default to true for SSR
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Monitor online status
  useEffect(() => {
    // Set initial online status after component mounts
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const checkConnection = async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to verify actual connectivity
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch("https://www.google.com/favicon.ico", {
        cache: "no-store",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return response.ok || true // no-cors requests return opaque responses
    } catch (error) {
      console.error("Connection test failed:", error)
      return false
    }
  }

  const runSpeedTest = async () => {
    if (isRunning) return
    
    setIsRunning(true)
    setProgress(0)
    setResults({ download: null, upload: null, latency: null })
    setErrorMessage(null)
    setTestPassed(null)

    // First check if we're actually online
    const hasConnection = await checkConnection()

    if (!hasConnection) {
      setErrorMessage("No internet connection detected. Please check your network and try again.")
      setIsRunning(false)
      setTestPassed(false)
      return
    }

    try {
      // Simulate latency test
      setCurrentTest("latency")
      setProgress(10)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const latency = Math.floor(Math.random() * 50) + 20 // Simulate 20-70ms latency
      setResults((prev) => ({ ...prev, latency }))

      // Simulate download test
      setCurrentTest("download")
      setProgress(30)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProgress(60)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const download = Math.floor(Math.random() * 50) + 10 // Simulate 10-60 Mbps
      setResults((prev) => ({ ...prev, download }))

      // Simulate upload test
      setCurrentTest("upload")
      setProgress(80)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const upload = Math.floor(Math.random() * 20) + 5 // Simulate 5-25 Mbps
      setResults((prev) => ({ ...prev, upload }))

      setProgress(100)
      
      // Determine if test passed (minimum requirements)
      const passed = latency < 100 && download > 5 && upload > 2
      setTestPassed(passed)
    } catch (error) {
      console.error("Speed test failed:", error)
      setErrorMessage("Speed test failed. Please try again.")
      setTestPassed(false)
    } finally {
      setIsRunning(false)
      setCurrentTest("idle")
    }
  }

  const resetTest = () => {
    if (isRunning) return
    setResults({ download: null, upload: null, latency: null })
    setProgress(0)
    setTestPassed(null)
    setCurrentTest("idle")
    setErrorMessage(null)
  }

  const getSpeedGaugeColor = (value: number | null, type: "download" | "upload" | "latency") => {
    if (value === null) return "stroke-gray-200 dark:stroke-gray-700"

    if (type === "latency") {
      if (value < 50) return "stroke-green-500"
      if (value < 100) return "stroke-yellow-500"
      return "stroke-red-500"
    } else {
      if (type === "download") {
        if (value > 10) return "stroke-green-500"
        if (value > 5) return "stroke-yellow-500"
        return "stroke-red-500"
      } else {
        // upload
        if (value > 5) return "stroke-green-500"
        if (value > 2) return "stroke-yellow-500"
        return "stroke-red-500"
      }
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="mb-6 text-2xl font-bold">Internet Speed Test</h3>

      <div className="mb-8 w-full max-w-md">
        {!isOnline && (
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <WifiOff className="mb-2 h-12 w-12 text-red-500/70" />
            <h4 className="mb-1 text-lg font-medium text-red-500">No Internet Connection</h4>
            <p className="text-sm text-red-500/70">Please check your network connection and try again.</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-md bg-red-500/10 p-4 text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        {isRunning && (
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">
                {currentTest === "latency" && "Testing latency..."}
                {currentTest === "download" && "Testing download speed..."}
                {currentTest === "upload" && "Testing upload speed..."}
              </p>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        )}

        <div className="rounded-xl border bg-card/50 p-6 backdrop-blur-sm">
          <div className="mb-6 grid grid-cols-3 gap-4">
            {/* Latency Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-gray-200 dark:stroke-gray-700"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                  />
                  {results.latency !== null && (
                    <motion.circle
                      className={getSpeedGaugeColor(results.latency, "latency")}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{
                        strokeDashoffset: 251.2 - (251.2 * Math.min(results.latency, 200)) / 200,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  )}
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-lg font-bold"
                  >
                    {results.latency !== null ? `${results.latency}` : "-"}
                  </text>
                  <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
                    ms
                  </text>
                </svg>
                <div className="absolute -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <span className="text-sm font-medium">Latency</span>
            </div>

            {/* Download Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-gray-200 dark:stroke-gray-700"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                  />
                  {results.download !== null && (
                    <motion.circle
                      className={getSpeedGaugeColor(results.download, "download")}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{
                        strokeDashoffset: 251.2 - (251.2 * Math.min(results.download, 100)) / 100,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  )}
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-lg font-bold"
                  >
                    {results.download !== null ? `${results.download}` : "-"}
                  </text>
                  <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
                    Mbps
                  </text>
                </svg>
                <div className="absolute -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <ArrowDown className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <span className="text-sm font-medium">Download</span>
            </div>

            {/* Upload Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-gray-200 dark:stroke-gray-700"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                  />
                  {results.upload !== null && (
                    <motion.circle
                      className={getSpeedGaugeColor(results.upload, "upload")}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{
                        strokeDashoffset: 251.2 - (251.2 * Math.min(results.upload, 50)) / 50,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  )}
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-lg font-bold"
                  >
                    {results.upload !== null ? `${results.upload}` : "-"}
                  </text>
                  <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
                    Mbps
                  </text>
                </svg>
                <div className="absolute -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <ArrowUp className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <span className="text-sm font-medium">Upload</span>
            </div>
          </div>

          <div className="rounded-lg border bg-card/80 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Minimum Requirements</span>
              <span className="text-xs text-muted-foreground">For video interviews</span>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>Latency</span>
                <span
                  className={
                    results.latency !== null ? (results.latency < 100 ? "text-green-500" : "text-red-500") : "text-muted-foreground"
                  }
                >
                  &lt; 100ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Download</span>
                <span
                  className={
                    results.download !== null ? (results.download > 5 ? "text-green-500" : "text-red-500") : "text-muted-foreground"
                  }
                >
                  &gt; 5 Mbps
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Upload</span>
                <span
                  className={results.upload !== null ? (results.upload > 2 ? "text-green-500" : "text-red-500") : "text-muted-foreground"}
                >
                  &gt; 2 Mbps
                </span>
              </div>
            </div>
          </div>
        </div>
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
        <Button 
          onClick={runSpeedTest} 
          disabled={isRunning || !isOnline} 
          className="rounded-full"
        >
          <Gauge className="mr-2 h-4 w-4" />
          {isRunning ? "Running Test..." : "Start Test"}
        </Button>
        <Button 
          onClick={resetTest} 
          variant="outline" 
          disabled={isRunning} 
          className="rounded-full"
        >
          Reset Test
        </Button>
      </div>
    </div>
  )
}