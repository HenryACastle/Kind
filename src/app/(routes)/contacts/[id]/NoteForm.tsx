"use client";
import { useState } from "react";

export default function NoteForm({ contactId }: { contactId: number }) {
  const [open, setOpen] = useState(false);
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
        setOpen(false);
        setNoteText("");
        setRelatedDate(new Date().toISOString().split("T")[0]);
        window.location.reload();
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
    <div className="mb-4">
      {!open ? (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setOpen(true)}
        >
          + Add Note
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow mt-2 flex flex-col gap-2">
          <label className="font-semibold">Note</label>
          <textarea
            className="border rounded p-2"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            required
            rows={3}
          />
          <label className="font-semibold">Related Date</label>
          <input
            type="date"
            className="border rounded p-2"
            value={relatedDate}
            onChange={e => setRelatedDate(e.target.value)}
            required
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </form>
      )}
    </div>
  );
} 