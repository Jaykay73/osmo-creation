import Link from "next/link";
import { categoryCounts, categories } from "@/content/projects";

const shownCategories = categories.filter((category) => category.id !== "all");

export function IndexStrip() {
  return (
    <div className="index-strip">
      <div className="shell index-strip-inner">
        <span className="index-strip-label">Inside the archive</span>
        <div className="index-strip-links">
          {shownCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/work?category=${category.id}`}
              className="index-strip-link"
            >
              <span className="index-strip-number">0{index + 1}</span>
              <span>{category.shortLabel}</span>
              <span className="index-strip-count">{categoryCounts[category.id]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
