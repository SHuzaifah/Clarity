import { Button } from "@/components/ui/button";
import { Brain, Edit, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
  title: "Clarity | Master what you watch",
  description: "Clarity is a focused video-learning platform that strips away distraction and replaces it with intentional learning paths and smart note-taking.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">Clarity</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              href="#features"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#philosophy"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Philosophy
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />

            <Link href="/dashboard">
              <Button size="sm" className="rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 lg:pb-40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background -z-10" />
          <div className="container flex flex-col items-center gap-8 text-center">
            <div className="animate-fade-in flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-1.5 text-sm font-medium text-secondary-foreground backdrop-blur-sm border border-secondary">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Focus is the new superpower
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Master what you watch.
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Stop passively consuming. Start actively understanding. Clarity transforms video learning with distraction-free viewing, smart note-taking, and intent-based workflows.
            </p>

            <div className="flex flex-col gap-4 min-[400px]:flex-row pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 rounded-full px-8 text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Start Learning Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-14 rounded-full px-8 text-lg bg-background/50 backdrop-blur-sm hover:bg-background/80">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-b from-card to-card/50 p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Intent Gate</h3>
              <p className="text-muted-foreground leading-relaxed">
                Define your goal before you hit play. Whether you're here to deeply learn, quickly revise, or casually explore, Clarity adapts the interface to match your mindset.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-b from-card to-card/50 p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <Edit className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Smart Notebook</h3>
              <p className="text-muted-foreground leading-relaxed">
                Capture thoughts without breaking flow. Sketch diagrams, write summaries, and jot down insights right alongside your video content. Your knowledge, organized.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-b from-card to-card/50 p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Deep Focus Mode</h3>
              <p className="text-muted-foreground leading-relaxed">
                Zero distractions. No algorithmic recommendations, no comment wars, no sidebar clutter. Just you and the content you want to master.
              </p>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section id="philosophy" className="container py-24 border-t">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Designed for <br />
                <span className="text-primary">clarity of thought.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most platforms are optimized for engagement and retention. They want you clicking, not thinking. Clarity is different. We optimize for understanding.
              </p>
              <ul className="space-y-4">
                {[
                  "No algorithmic rabbit holes",
                  "Tools for active recall and synthesis",
                  "Clean, minimalist interface",
                  "Track your actual learning progress"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden border shadow-2xl bg-muted/50">
              <img
                src="/ui-preview.png"
                alt="Clarity UI Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Clarity</span>
            <span className="text-sm text-muted-foreground">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
