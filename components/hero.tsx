"use client"

import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background"></div>
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-20 left-1/4 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container relative z-10 mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">
            Ensure You&apos;re Interview-Ready!
          </h1>
          <p className="mx-auto mb-8 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Verify all your system requirements before your online placement interview. Quick checks for your hardware,
            software, and connectivity.
          </p>
          <div className="flex justify-center">
            <motion.a
              href="#test-cards"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Testing
              <ArrowDown className="h-4 w-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 flex justify-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        <ArrowDown className="h-8 w-8 text-muted-foreground" />
      </motion.div>
    </section>
  )
}

