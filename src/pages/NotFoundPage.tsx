import { useNavigate } from "react-router-dom";

/**
 * NotFoundPage — 404 page with navigation back to home.
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
      <p className="text-8xl font-black gradient-text">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
      >
        ← Back to home
      </button>
    </div>
  );
}
