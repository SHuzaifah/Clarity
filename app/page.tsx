import { Button } from "@/components/ui/button";
import { Brain, Layers, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">Clarity</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="#features"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Features
              </Link>

            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
            </div>
            <nav className="flex items-center">
              <Link href="/login">
                <Button variant="ghost" className="h-8 text-xs">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
              Structure, intention, focus
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Learn without the noise.
            </h1>
            <p className="max-w-[42rem] leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
              Clarity is a focused video-learning platform that strips away algorithmic distraction and replaces it with intentional learning paths.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row space-x-0 sm:space-x-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 w-full sm:w-auto px-8 text-base">
                  Start Learning
                </Button>
              </Link>

            </div>
          </div>
        </section>

        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Designed for understanding.
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Existing platforms optimize for engagement. We optimize for clarity.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Brain className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Intent Gate</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose to Learn, Revise, or Explore before you play.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Layers className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Learning Maps</h3>
                  <p className="text-sm text-muted-foreground">
                    Directed graphs, not playlists. Clear start and end points.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Zap className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Focus Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Zero distractions. No comments, no sidebar recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Clarity Team.
          </p>
        </div>
      </footer>
    </div>
  );
}
