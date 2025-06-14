"use client";

import ContactForm from "@/components/ContactForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewContactPage() {
  const router = useRouter();

  const handleSubmit = async (data: unknown) => {
    try {
      console.log('Submitting new contact data:', data);
      const res = await fetch("/api/contacts/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        console.error('API Error:', result);
        throw new Error(result.error || "Failed to create contact");
      }
      
      if (result.id) {
        toast.success("Contact created successfully!");
        router.push(`/contacts/${result.id}`);
      } else {
        toast.error("Contact created but no ID returned");
        router.push("/contacts");
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create contact");
      throw error; // Re-throw to let the form handle the error state
    }
  };

  return <ContactForm onSubmit={handleSubmit} />;
}
