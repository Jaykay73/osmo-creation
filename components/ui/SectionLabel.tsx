import type { ReactNode } from "react";

export function SectionLabel({
  children,
  index,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  index?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={`eyebrow eyebrow--${tone} ${className}`.trim()}>
      {index ? <span className="eyebrow-index">{index}</span> : null}
      <span className="eyebrow-rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
