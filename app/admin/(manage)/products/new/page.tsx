import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bark">New product</h1>
      <p className="mt-1 mb-6 text-sm text-stone">
        Reusable catalog item — add daily availability separately.
      </p>
      <ProductForm />
    </div>
  );
}
