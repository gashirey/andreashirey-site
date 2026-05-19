import { QuickAvailabilityBoard } from "@/components/admin/QuickAvailabilityBoard";

export default function AdminAvailabilityPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bark">Availability</h1>
      <p className="mt-1 mb-6 text-sm text-stone">
        Quick updates for what shows on Available Now.
      </p>
      <QuickAvailabilityBoard />
    </div>
  );
}
