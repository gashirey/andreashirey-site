import Link from "next/link";
import { listProducts } from "@/lib/inventory/queries";
import { isInventoryConfigured } from "@/lib/inventory/queries";

export default async function AdminProductsPage() {
  if (!isInventoryConfigured()) {
    return (
      <p className="text-sm text-stone">
        Configure Supabase env vars to manage products.
      </p>
    );
  }

  const products = await listProducts();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-bark">Products</h1>
        <Link href="/admin/products/new" className="btn border-bark text-bark">
          Add product
        </Link>
      </div>

      <ul className="divide-y divide-parchment border border-parchment bg-white">
        {products.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div>
              <p className="font-medium text-bark">{p.name}</p>
              <p className="text-xs text-stone">
                {p.category} · {p.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <Link
              href={`/admin/products/${p.id}`}
              className="text-sm text-salmon-dark underline"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
