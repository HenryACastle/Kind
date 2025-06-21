"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function NoteForm({ contactId, onSuccess }: { contactId: number; onSuccess?: () => void }) {
  const [noteText, setNoteText] = useState("");
  const [relatedDate, setRelatedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/contacts/${contactId}/add-note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteText, relatedDate }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save note");
      } else {
        setNoteText("");
        setRelatedDate(new Date().toISOString().split("T")[0]);
        setError(null);
        onSuccess?.();
      }
    }
    catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }

    finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="">
        <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
          <Label >Note</Label>
          <Textarea
            className="w-full border rounded p-2 text-sm"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            required
            rows={3}
            placeholder="Enter your note here..."
          />
        </div>
        <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
          <Label >Related Date</Label>
          <input
            type="date"
            className="w-full border rounded p-2 text-sm"
            value={relatedDate}
            onChange={e => setRelatedDate(e.target.value)}
            required
          />
        </div>


        <div className="flex gap-2 mt-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Saving..." : "Save Note"}
          </Button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  );
} 