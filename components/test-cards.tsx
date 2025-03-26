"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import KeyboardTest from "./tests/keyboard-test"
import MouseTest from "./tests/mouse-test"
import MicrophoneTest from "./tests/microphone-test"
import CameraTest from "./tests/camera-test"
import SpeedTest from "./tests/speed-test"
import SystemInfo from "./tests/system-info"
import Footer from "./footer"
import { ArrowLeft, Keyboard, Mouse, Mic, Camera, Gauge, Cpu } from "lucide-react"

export default function TestCards() {
  const [activeTest, setActiveTest] = useState<string | null>(null)

  const tests = [
    { id: "keyboard", title: "Keyboard Test", component: <KeyboardTest />, icon: <Keyboard className="h-6 w-6" /> },
    { id: "mouse", title: "Mouse Test", component: <MouseTest />, icon: <Mouse className="h-6 w-6" /> },
    { id: "microphone", title: "Microphone Test", component: <MicrophoneTest />, icon: <Mic className="h-6 w-6" /> },
    { id: "camera", title: "Camera Test", component: <CameraTest />, icon: <Camera className="h-6 w-6" /> },
    { id: "speed", title: "Internet Speed Test", component: <SpeedTest />, icon: <Gauge className="h-6 w-6" /> },
    { id: "system", title: "System Information", component: <SystemInfo />, icon: <Cpu className="h-6 w-6" /> },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <section id="test-cards" className="container mx-auto px-4 py-16">
      <motion.h2
        className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        System Requirement Tests
      </motion.h2>

      {activeTest ? (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            onClick={() => setActiveTest(null)}
            className="mb-4 inline-flex items-center gap-2 rounded-md border border-input bg-background/50 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to all tests
          </motion.button>
          <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
            {tests.find((test) => test.id === activeTest)?.component}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tests.map((test) => (
            <motion.div key={test.id} variants={item}>
              <motion.button
                onClick={() => setActiveTest(test.id)}
                className="group relative w-full overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-6 text-left shadow-md transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20"></div>
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20">
                    {test.icon}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold group-hover:text-blue-500">{test.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Click to verify your {test.id === "system" ? "system specifications" : `${test.id} functionality`}
                    </p>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Footer />
    </section>
  )
}

