import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { todayFarmDate } from "./date";
import { resolveProductImage } from "./images";
import type {
  AvailableNowItem,
  AvailabilityWithProduct,
  FarmProduct,
  FarmProductAvailability,
  FarmProductPhoto,
} from "./types";

export function isInventoryConfigured(): boolean {
  return isSupabaseConfigured();
}

export async function getAvailableNow(
  date?: string,
): Promise<{ date: string; items: AvailableNowItem[] }> {
  const availableDate = date ?? todayFarmDate();
  if (!isInventoryConfigured()) {
    return { date: availableDate, items: [] };
  }

  const supabase = createServiceClient();

  const { data: rows, error } = await supabase
    .from("farm_product_availability")
    .select(
      `
      *,
      product:farm_products!inner (*)
    `,
    )
    .eq("available_date", availableDate)
    .eq("show_on_website", true)
    .in("status", ["available", "limited"])
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[getAvailableNow]", error);
    return { date: availableDate, items: [] };
  }

  const availabilities = (
    (rows ?? []) as (FarmProductAvailability & {
      product: FarmProduct;
    })[]
  ).filter((row) => row.product?.is_active);

  if (!availabilities.length) {
    return { date: availableDate, items: [] };
  }

  const productIds = [...new Set(availabilities.map((a) => a.product_id))];
  const availabilityIds = availabilities.map((a) => a.id);

  const { data: photos } = await supabase
    .from("farm_product_photos")
    .select("*")
    .in("product_id", productIds);

  const photoList = (photos ?? []) as FarmProductPhoto[];

  const items: AvailableNowItem[] = availabilities
    .map((row) => {
      const { imageUrl, imageAlt } = resolveProductImage(
        row.product_id,
        row.id,
        row.product.name,
        photoList,
      );

      return {
        availabilityId: row.id,
        productId: row.product_id,
        name: row.product.name,
        slug: row.product.slug,
        category: row.product.category,
        description: row.product.description,
        variety: row.product.variety,
        color: row.product.color,
        status: row.status,
        bunchPrice: Number(row.bunch_price),
        stemsPerBunch: row.stems_per_bunch,
        bunchesAvailable: row.bunches_available,
        harvestDate: row.harvest_date,
        notes: row.notes,
        displayOrder: row.display_order,
        imageUrl,
        imageAlt,
      };
    })
    .sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.name.localeCompare(b.name);
    });

  return { date: availableDate, items };
}

export async function listProducts(): Promise<FarmProduct[]> {
  if (!isInventoryConfigured()) return [];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_products")
    .select("*")
    .order("name");

  if (error) {
    console.error("[listProducts]", error);
    return [];
  }
  return (data ?? []) as FarmProduct[];
}

/** Active catalog items — for listings, dropdowns, and public inventory */
export async function listActiveProducts(): Promise<FarmProduct[]> {
  const all = await listProducts();
  return all.filter((p) => p.is_active);
}

export async function getProduct(id: string): Promise<FarmProduct | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as FarmProduct | null;
}

export async function listAvailabilityForDate(
  date: string,
): Promise<AvailabilityWithProduct[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_product_availability")
    .select(`*, product:farm_products (*)`)
    .eq("available_date", date)
    .order("display_order");

  if (error) throw error;
  return (data ?? []) as AvailabilityWithProduct[];
}

export async function listPhotosForProduct(
  productId: string,
): Promise<FarmProductPhoto[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_product_photos")
    .select("*")
    .eq("product_id", productId)
    .order("display_order");

  if (error) throw error;
  return (data ?? []) as FarmProductPhoto[];
}

export async function getAvailability(
  id: string,
): Promise<AvailabilityWithProduct | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_product_availability")
    .select(`*, product:farm_products (*)`)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as AvailabilityWithProduct | null;
}
