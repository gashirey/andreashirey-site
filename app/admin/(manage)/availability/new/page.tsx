import { AvailabilityForm } from "@/components/admin/AvailabilityForm";

export default function NewAvailabilityPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bark">Add listing</h1>
      <p className="mt-1 mb-6 text-sm text-stone">
        Create today&apos;s availability for a product.
      </p>
      <AvailabilityForm />
    </div>
  );
}
