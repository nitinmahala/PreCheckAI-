import Hero from "@/components/hero"
import TestCards from "@/components/test-cards"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <main className="min-h-screen bg-background">
        <Hero />
        <TestCards />
      </main>
    </ThemeProvider>
  )
}

