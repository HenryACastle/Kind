"use client";
import { Button } from "@/components/ui/button";
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
    } catch (err: unknown) {
      setStatus(`Sync failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <Button
        onClick={handleSync}
        disabled={loading}
      
      >
        {loading ? "Syncing..." : "Sync with Google"}
      </Button>
      {status && (
        <span className="mt-1 text-sm text-gray-600">{status}</span>
      )}
    </div>
  );
} 