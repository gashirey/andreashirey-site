import { ProductsManager } from "@/components/admin/ProductsManager";
import { isInventoryConfigured } from "@/lib/inventory/queries";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  if (!isInventoryConfigured()) {
    return (
      <p className="text-sm text-stone">
        Configure Supabase env vars in Vercel (and locally in .env.local) to
        manage products.
      </p>
    );
  }

  return <ProductsManager />;
}
