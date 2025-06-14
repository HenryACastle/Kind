"use client";

import ContactForm from "@/components/ContactForm";
import LoadingAnimation from "@/components/LoadingAnimation";
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
                setInitialData({
                    ...data.contact,
                    phones: data.phones && Array.isArray(data.phones)
                        ? data.phones.map((p: unknown) => ({
                            phoneNumber: (p as { phoneNumber?: string }).phoneNumber || "",
                            label: (p as { label?: string }).label || "",
                            ordinal: (p as { ordinal?: number }).ordinal?.toString() || "",
                        }))
                        : [{ phoneNumber: "", label: "", ordinal: "" }],
                    emails: data.emails && Array.isArray(data.emails)
                        ? data.emails.map((e: unknown) => ({
                            email: (e as { email?: string }).email || "",
                            label: (e as { label?: string }).label || "",
                            ordinal: (e as { ordinal?: number }).ordinal?.toString() || "",
                        }))
                        : [{ email: "", label: "", ordinal: "" }],
                    addresses: data.addresses && Array.isArray(data.addresses)
                        ? data.addresses.map((a: unknown) => ({
                            address: (a as { addressText?: string }).addressText || "",
                            label: (a as { label?: string }).label || "",
                            ordinal: (a as { ordinal?: number }).ordinal?.toString() || "",
                        }))
                        : [{ address: "", label: "", ordinal: "" }],
                });
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
    if (loading) return <LoadingAnimation />
    if (!initialData) return <div>Contact not found</div>;

    return (
        <ContactForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Update"
        />
    );
} 