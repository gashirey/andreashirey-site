import { redirect } from "next/navigation";

export default function EventsPage() {
  redirect("/contact?subject=event");
}
