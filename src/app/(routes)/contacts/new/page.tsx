"use client";

import ContactForm from "@/components/ContactForm";
import { useRouter } from "next/navigation";

export default function NewContactPage() {
  const router = useRouter();

  const handleSubmit = async (data: unknown) => {
    const res = await fetch("/api/contacts/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error("Failed to create contact");
    }
    
    const result = await res.json();
    if (result.id) {
      router.push(`/contacts/${result.id}`);
    } else {
      router.push("/contacts");
    }
  };

  return <ContactForm onSubmit={handleSubmit} />;
}
