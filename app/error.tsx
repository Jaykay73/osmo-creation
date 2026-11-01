"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight } from "@/components/ui/Icons";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("OSMO site error:", error);
  }, [error]);

  return (
    <main id="main" style={{ minHeight: "100svh" }}>
      <section className="state-page shell">
        <span className="state-code">Something interrupted</span>
        <h1>
          The room went
          <br />
          <em>dark</em> for a moment.
        </h1>
        <p>
          An unexpected error stopped this page from loading. Try again — if it persists,
          the studio can be reached directly by email.
        </p>
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginTop: 30 }}>
          <button type="button" className="cta" onClick={reset}>
            Try again
            <ArrowRight />
          </button>
          <Link href="/" className="text-link">
            Return home
          </Link>
          <a href="mailto:salakoolashubomi@gmail.com" className="text-link">
            Email the studio
          </a>
        </div>
      </section>
    </main>
  );
}
