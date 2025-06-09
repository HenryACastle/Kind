"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NoteForm from "./NoteForm";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

// Types for fetched data
type Note = {
  noteId: number;
  noteText: string;
  createdOn?: string;
  relatedDate?: string;
};

type Contact = {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  email?: string;
  phone?: string;
  nickname?: string;
  mnemonic?: string;
  birthDate?: string;
};

export default function ContactDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`/api/contacts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setContact(data.contact);
        setNotes(data.notes);
      }
      setLoading(false);
    }
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!contact) return <div className="p-8">Contact not found</div>;

  return (
    <div className="px-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center align-middle">
        <h1 className="text-2xl font-bold mb-4">
          {[contact.firstName, contact.middleName, contact.lastName, contact.suffix].filter(Boolean).join(" ")}
        </h1>
        <Link href={`/contacts/${id}/edit`}>
          <Button>
            <Pencil />
          </Button>
        </Link>
      </div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {contact.email || "-"}</div>
      <div className="mb-2"><span className="font-semibold">Phone:</span> {contact.phone || "-"}</div>
      <div className="mb-2"><span className="font-semibold">Nickname:</span> {contact.nickname || "-"}</div>
      <div className="mb-2"><span className="font-semibold">Mnemonic:</span> {contact.mnemonic || "-"}</div>
      <div className="mb-2"><span className="font-semibold">Birth Date:</span> {contact.birthDate ? new Date(contact.birthDate).toLocaleDateString() : "-"}</div>
      {/* Add more fields as needed */}
      <div className="mt-6">
        <NoteForm contactId={contact.id} />
        <h2 className="text-lg font-semibold mb-2 mt-6">Notes</h2>
        {notes.length === 0 ? (
          <div className="text-gray-500">No notes for this contact.</div>
        ) : (
          <ul className="list-disc pl-5">
            {notes.map((n) => (
              <li key={n.noteId} className="mb-2">
                <div className="font-medium">{n.noteText}</div>
                <div className="text-xs text-gray-500">
                  Created: {n.createdOn ? new Date(n.createdOn).toLocaleDateString() : "-"}
                  {n.relatedDate && (
                    <>
                      {" | Related: "}
                      {new Date(n.relatedDate).toLocaleDateString()}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 