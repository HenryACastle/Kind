"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    <div className="w-80">  
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="font-semibold text-sm">Note</label>
          <textarea
            className="w-full border rounded p-2 text-sm"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            required
            rows={3}
            placeholder="Enter your note here..."
          />
        </div>
        <div>
          <label className="font-semibold text-sm">Related Date</label>
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