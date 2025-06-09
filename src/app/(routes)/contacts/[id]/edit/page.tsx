"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use, useState, useEffect } from "react";

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contact data on mount
  useEffect(() => {
    async function fetchContact() {
      setLoading(true);
      try {
        const res = await fetch(`/api/contacts/${id}`);
        const data = await res.json();
        setFirstName(data.firstName || "");
        setMiddleName(data.middleName || "");
        setLastName(data.lastName || "");
      } catch {
        setError("Failed to load contact data");
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("middleName", middleName);
    formData.append("lastName", lastName);
    try {
      const res = await fetch(`/api/contacts/${id}/edit`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.redirect) {
        window.location.href = data.redirect;
      } else {
        setError(data.error || "Failed to update contact");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <form className="p-8 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Edit Contact</h1>
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
      {/* Add more fields as needed */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
      <Link href={`/contacts/${id}`}>
        <Button>
          Cancel
        </Button>
      </Link>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}
