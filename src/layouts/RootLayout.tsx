import { Outlet } from "react-router-dom";

/**
 * RootLayout — wraps all main application pages.
 * Provides the shell: header, sidebar, main content area, footer.
 */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <span className="gradient-text text-xl font-bold tracking-tight">
              FeedbackIQ
            </span>
          </a>
          <nav className="flex items-center gap-1 ml-auto text-sm">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              API Docs
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FeedbackIQ. All rights reserved.
      </footer>
    </div>
  );
}
