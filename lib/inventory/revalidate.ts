import { revalidatePath } from "next/cache";

export function revalidateInventoryPaths(): void {
  revalidatePath("/");
  revalidatePath("/available-now");
}
