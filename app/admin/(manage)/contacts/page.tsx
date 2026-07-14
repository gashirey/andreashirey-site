import { ContactsList } from "@/components/admin/ContactsList";

export default function AdminContactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-bark">Contacts</h1>
        <p className="mt-1 text-sm text-stone">
          Everyone who submitted the contact or inquire form. Management tools
          can come later — this is the full list.
        </p>
      </div>
      <ContactsList />
    </div>
  );
}
