"use client";
import { useState } from "react";

export default function SyncWithGoogleButton() {
  const [status, setStatus] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    setStatus("Syncing...");
    try {
      const res = await fetch("/api/sync-contacts", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("Sync complete!");
      } else {
        setStatus(`Sync failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setStatus(`Sync failed: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleSync}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Syncing..." : "Sync with Google"}
      </button>
      {status && (
        <span className="mt-1 text-sm text-gray-600">{status}</span>
      )}
    </div>
  );
} 