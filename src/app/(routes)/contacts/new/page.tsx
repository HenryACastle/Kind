"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function NewContactPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("middleName", middleName);
    formData.append("lastName", lastName);
    try {
      const res = await fetch("/api/contacts/new", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.redirect) {
        router.push(data.redirect);
      } else {
        setError(data.error || "Failed to create contact");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="p-8 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">New Contact</h1>
      <Input name="firstName"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        className="border rounded p-2 w-full"
        disabled={loading}>

      </Input>
      <label className="block mb-2">First Name
        <input
          name="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="border rounded p-2 w-full"
          disabled={loading}
        />
      </label>
      <label className="block mb-2">Middle Name
        <input
          name="middleName"
          value={middleName}
          onChange={e => setMiddleName(e.target.value)}
          className="border rounded p-2 w-full"
          disabled={loading}
        />
      </label>
      <label className="block mb-2">Last Name
        <input
          name="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="border rounded p-2 w-full"
          disabled={loading}
        />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Create"}
      </Button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}
