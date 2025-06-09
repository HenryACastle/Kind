"use client";

import ContactForm from "@/components/ContactForm";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [initialData, setInitialData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContact() {
      const res = await fetch(`/api/contacts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInitialData(data.contact);
      }
      setLoading(false);
    }
    fetchContact();
  }, [id]);

  const handleSubmit = async (data: unknown) => {
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error("Failed to update contact");
    }
    
    router.push(`/contacts/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!initialData) return <div>Contact not found</div>;

  return (
    <ContactForm 
      initialData={initialData} 
      onSubmit={handleSubmit}
      submitLabel="Update"
    />
  );
} 