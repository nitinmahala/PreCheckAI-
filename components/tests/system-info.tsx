"use client"

import { useEffect, useState } from "react"
import { Check, Cpu, X, Monitor, HardDrive, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface SystemInfo {
  browser: string
  browserVersion: string
  os: string
  screenResolution: string
  deviceType: string
  userAgent: string
  cookiesEnabled: boolean
  language: string
}

export default function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [testPassed, setTestPassed] = useState<boolean | null>(null)

  const detectSystemInfo = () => {
    const userAgent = navigator.userAgent

    // Detect browser and version
    let browser = "Unknown"
    let browserVersion = "Unknown"

    if (userAgent.indexOf("Firefox") > -1) {
      browser = "Firefox"
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1) {
      browser = "Chrome"
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
      browser = "Safari"
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (userAgent.indexOf("Edg") > -1) {
      browser = "Edge"
      browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown"
    }

    // Detect OS
    let os = "Unknown"
    if (userAgent.indexOf("Win") > -1) os = "Windows"
    else if (userAgent.indexOf("Mac") > -1) os = "MacOS"
    else if (userAgent.indexOf("Linux") > -1) os = "Linux"
    else if (userAgent.indexOf("Android") > -1) os = "Android"
    else if (userAgent.indexOf("iOS") > -1 || userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1)
      os = "iOS"

    // Detect device type
    let deviceType = "Desktop"
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      deviceType = "Mobile"
    } else if (/Tablet|iPad/i.test(userAgent)) {
      deviceType = "Tablet"
    }

    const info: SystemInfo = {
      browser,
      browserVersion,
      os,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      deviceType,
      userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      language: navigator.language,
    }

    setSystemInfo(info)

    // Check if system meets requirements
    // For this example, we'll consider Chrome/Firefox/Edge with version > 90 as passing
    const modernBrowser =
      (browser === "Chrome" || browser === "Firefox" || browser === "Edge") && Number.parseFloat(browserVersion) > 90

    // Screen resolution should be at least HD
    const adequateResolution = window.screen.width >= 1280 && window.screen.height >= 720

    setTestPassed(modernBrowser && adequateResolution)
  }

  useEffect(() => {
    detectSystemInfo()
  }, [])

  const resetTest = () => {
    setSystemInfo(null)
    setTestPassed(null)
    detectSystemInfo()
  }

  if (!systemInfo) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="mb-6 text-2xl font-bold">System Information</h3>
        <p className="text-muted-foreground">Loading system information...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-6 text-2xl font-bold">System Information</h3>

      <div className="mb-8 w-full max-w-md">
        <div className="overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm">
          {/* System visualization */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-400/5 p-6">
            <div className="flex items-center justify-center">
              <motion.div
                className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                }}
              >
                {systemInfo.deviceType === "Desktop" ? (
                  <Monitor className="h-12 w-12" />
                ) : systemInfo.deviceType === "Mobile" ? (
                  <Laptop className="h-12 w-12" />
                ) : (
                  <HardDrive className="h-12 w-12" />
                )}
              </motion.div>
            </div>
            <div className="mt-4 text-center">
              <h4 className="text-lg font-semibold">{systemInfo.os}</h4>
              <p className="text-sm text-muted-foreground">
                {systemInfo.browser} {systemInfo.browserVersion}
              </p>
            </div>
          </div>

          {/* System details */}
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="space-y-1 rounded-lg border bg-card/80 p-3">
              <p className="text-xs text-muted-foreground">Browser</p>
              <p className="font-medium">{systemInfo.browser}</p>
            </div>
            <div className="space-y-1 rounded-lg border bg-card/80 p-3">
              <p className="text-xs text-muted-foreground">Version</p>
              <p className="font-medium">{systemInfo.browserVersion}</p>
            </div>
            <div className="space-y-1 rounded-lg border bg-card/80 p-3">
              <p className="text-xs text-muted-foreground">Operating System</p>
              <p className="font-medium">{systemInfo.os}</p>
            </div>
            <div className="space-y-1 rounded-lg border bg-card/80 p-3">
              <p className="text-xs text-muted-foreground">Screen Resolution</p>
              <p className="font-medium">{systemInfo.screenResolution}</p>
            </div>
            <div className="space-y-1 rounded-lg border bg-card/80 p-3">
              <p className="text-xs text-muted-foreground">Device Type</p>
              <p className="font-medium">{systemInfo.deviceType}</p>
            </div>
            <div className="space-y-1 rounded-lg border bg-card/80 p-3">
              <p className="text-xs text-muted-foreground">Language</p>
              <p className="font-medium">{systemInfo.language}</p>
            </div>
          </div>

          <div className="border-t p-6">
            <p className="mb-4 text-sm font-medium">System Requirements</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border bg-card/80 p-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${systemInfo.browser === "Chrome" || systemInfo.browser === "Firefox" || systemInfo.browser === "Edge" ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm">Modern Browser</span>
                </div>
                <span
                  className={
                    systemInfo.browser === "Chrome" || systemInfo.browser === "Firefox" || systemInfo.browser === "Edge"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {systemInfo.browser === "Chrome" || systemInfo.browser === "Firefox" || systemInfo.browser === "Edge"
                    ? "✓"
                    : "✗"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-card/80 p-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${window.screen.width >= 1280 && window.screen.height >= 720 ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm">HD Resolution or higher</span>
                </div>
                <span
                  className={
                    window.screen.width >= 1280 && window.screen.height >= 720 ? "text-green-500" : "text-red-500"
                  }
                >
                  {window.screen.width >= 1280 && window.screen.height >= 720 ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-card/80 p-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${systemInfo.cookiesEnabled ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm">Cookies Enabled</span>
                </div>
                <span className={systemInfo.cookiesEnabled ? "text-green-500" : "text-red-500"}>
                  {systemInfo.cookiesEnabled ? "✓" : "✗"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium">Test Status:</span>
        {testPassed === null ? (
          <span className="text-sm text-muted-foreground">Checking...</span>
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
        <Cpu className="mr-2 h-4 w-4" />
        Refresh System Info
      </Button>
    </div>
  )
}

