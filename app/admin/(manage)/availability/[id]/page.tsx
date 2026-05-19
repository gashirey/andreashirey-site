import { notFound } from "next/navigation";
import { AvailabilityForm } from "@/components/admin/AvailabilityForm";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { getAvailability } from "@/lib/inventory/queries";
import { isInventoryConfigured } from "@/lib/inventory/queries";

type Props = { params: Promise<{ id: string }> };

export default async function EditAvailabilityPage({ params }: Props) {
  const { id } = await params;

  if (!isInventoryConfigured()) {
    notFound();
  }

  const availability = await getAvailability(id);
  if (!availability) notFound();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl text-bark">
          Edit listing — {availability.product?.name}
        </h1>
        <AvailabilityForm availability={availability} />
      </div>
      <div>
        <h2 className="font-serif text-xl text-bark">Day-specific photos</h2>
        <p className="mt-1 mb-4 text-sm text-stone">
          Optional — overrides product primary on the public card for this
          listing.
        </p>
        <PhotoManager
          productId={availability.product_id}
          availabilityId={availability.id}
        />
      </div>
    </div>
  );
}
