import { useEffect, useState } from "react";
import { healthApi } from "@/api/health";
import type { HealthStatus } from "@/types/api";

/**
 * HomePage — landing page for FeedbackIQ.
 * Shows system status and an introduction to the platform.
 */
export function HomePage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    healthApi
      .check()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      {/* Hero */}
      <section className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-medium mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          Foundation Release v0.1.0
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="gradient-text">FeedbackIQ</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Intelligent feedback management platform. Collect, analyse, and act on
          customer insights — all in one place.
        </p>
      </section>

      {/* Status Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          label="API"
          status={loading ? "loading" : health ? "online" : "offline"}
          detail={health?.version ?? "—"}
        />
        <StatusCard
          label="MongoDB"
          status={loading ? "loading" : health?.mongo === "connected" ? "online" : "offline"}
          detail={health?.mongo ?? "—"}
        />
        <StatusCard
          label="Redis"
          status={loading ? "loading" : health?.redis === "connected" ? "online" : "offline"}
          detail={health?.redis ?? "—"}
        />
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LinkCard
          title="API Documentation"
          description="Explore REST endpoints via Swagger UI"
          href="http://localhost:8000/docs"
          external
        />
        <LinkCard
          title="ReDoc Reference"
          description="Beautifully rendered API reference"
          href="http://localhost:8000/redoc"
          external
        />
      </section>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────────────── */

type StatusValue = "online" | "offline" | "loading";

function StatusCard({
  label,
  status,
  detail,
}: {
  label: string;
  status: StatusValue;
  detail: string;
}) {
  const colors: Record<StatusValue, string> = {
    online: "text-emerald-500",
    offline: "text-rose-500",
    loading: "text-amber-500",
  };
  const dots: Record<StatusValue, string> = {
    online: "bg-emerald-500",
    offline: "bg-rose-500",
    loading: "bg-amber-500 animate-pulse",
  };

  return (
    <div className="glass-card rounded-xl p-5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`h-2 w-2 rounded-full ${dots[status]}`} />
      </div>
      <p className={`text-lg font-semibold capitalize ${colors[status]}`}>
        {status === "loading" ? "Checking…" : status}
      </p>
      <p className="text-xs text-muted-foreground truncate">{detail}</p>
    </div>
  );
}

function LinkCard({
  title,
  description,
  href,
  external,
}: {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="glass-card rounded-xl p-5 group flex items-start gap-4 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200"
    >
      <div className="flex-1 space-y-1">
        <p className="font-medium group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
        →
      </span>
    </a>
  );
}
