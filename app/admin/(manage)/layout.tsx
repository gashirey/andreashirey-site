import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default function AdminManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
