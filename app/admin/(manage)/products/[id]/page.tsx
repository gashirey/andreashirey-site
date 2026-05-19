import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { getProduct } from "@/lib/inventory/queries";
import { isInventoryConfigured } from "@/lib/inventory/queries";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  if (!isInventoryConfigured()) {
    notFound();
  }

  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl text-bark">Edit product</h1>
        <ProductForm product={product} />
      </div>
      <div>
        <h2 className="font-serif text-xl text-bark">Product photos</h2>
        <p className="mt-1 mb-4 text-sm text-stone">
          Default images used on listings unless a day-specific photo is set.
        </p>
        <PhotoManager productId={product.id} />
      </div>
    </div>
  );
}
