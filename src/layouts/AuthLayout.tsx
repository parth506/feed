/**
 * AuthLayout — minimal layout for login / register pages.
 * Centers content vertically and horizontally.
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-white tracking-tight">
            FeedbackIQ
          </span>
          <p className="text-brand-200 mt-1 text-sm">
            Intelligent Feedback Management
          </p>
        </div>
        <div className="glass-card rounded-xl p-8">{children}</div>
      </div>
    </div>
  );
}
