import { Github } from "lucide-react"
import Link from "next/link"
import ThemeToggle from "./theme-toggle"

export default function Footer() {
  return (
    <footer className="mt-16 border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground">© 2025 PreCheckAI | Built by Nitin Mahala</p>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="https://github.com/nitinmahala"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

