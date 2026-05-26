import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ConfirmationContent } from "@/components/inquiry/ConfirmationContent";
import { inquiryCopy } from "@/lib/inquiry/copy";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Inquiry received",
  description: inquiryCopy.metaDescription,
  path: "/inquire/confirmation",
});

export default function InquireConfirmationPage() {
  return (
    <Section density="compact" className="pt-20 md:pt-28">
      <ConfirmationContent />
    </Section>
  );
}
