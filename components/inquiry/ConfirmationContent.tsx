import Link from "next/link";
import { Button } from "@/components/Button";
import { inquiryCopy } from "@/lib/inquiry/copy";

export function ConfirmationContent() {
  const { confirmation } = inquiryCopy;

  return (
    <div className="max-w-lg">
      <h1 className="type-page-title leading-tight md:text-4xl">
        {confirmation.title}
      </h1>
      <div className="mt-8 space-y-5">
        {confirmation.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="type-page-body leading-relaxed text-stone"
          >
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-10">
        <Button href={confirmation.ctaHref} variant="primary">
          {confirmation.ctaLabel}
        </Button>
      </div>
      <p className="mt-8 text-sm text-stone">
        Questions?{" "}
        <Link
          href="/contact"
          className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
        >
          Send a note
        </Link>
      </p>
    </div>
  );
}
