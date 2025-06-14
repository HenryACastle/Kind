"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

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
        toast.success("Sync complete!", {
          description: data.updatedContacts.length > 0 ? `Updated contacts: ${data.updatedContacts.join(', ')}` : 'No contacts were updated.',
        });
      } else {
        toast.error(`Sync failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: unknown) {
      toast.error(`Sync failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
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
      
    </div>
  );
} 