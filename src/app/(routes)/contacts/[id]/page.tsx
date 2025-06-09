import { drizzle } from 'drizzle-orm/neon-http';
import { eq, inArray } from 'drizzle-orm';
import { contact, noteMapping, note } from '@/db/schema';
import NoteForm from './NoteForm';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

const db = drizzle(process.env.DATABASE_URL!);

export default async function ContactDetailPage() {
  const id = 1;
  const contacts = await db.select().from(contact).where(eq(contact.id, id));
  const c = contacts[0];

  if (!c) return <div className="p-8">Contact not found</div>;

  const mappings = await db.select().from(noteMapping).where(eq(noteMapping.contactId, id));
  const noteIds = mappings.map(m => m.noteId);
  let notes: typeof note.$inferSelect[] = [];
  const filteredNoteIds = noteIds.filter((id): id is number => typeof id === 'number');
  if (filteredNoteIds.length > 0) {
    notes = await db.select().from(note).where(inArray(note.noteId, filteredNoteIds));
  }

  return (
    <div className="px-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center align-middle">
        <h1 className="text-2xl font-bold mb-4">
          {[c.firstName, c.middleName, c.lastName, c.suffix].filter(Boolean).join(' ')}
        </h1>
        <Link href={`/contacts/${id}/edit`}>
          <Button>
            <Pencil />
          </Button>
        </Link>
      </div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {c.email || '-'}</div>
      <div className="mb-2"><span className="font-semibold">Phone:</span> {c.phone || '-'}</div>
      <div className="mb-2"><span className="font-semibold">Nickname:</span> {c.nickname || '-'}</div>
      <div className="mb-2"><span className="font-semibold">Mnemonic:</span> {c.mnemonic || '-'}</div>
      <div className="mb-2"><span className="font-semibold">Birth Date:</span> {c.birthDate ? new Date(c.birthDate).toLocaleDateString() : '-'}</div>
      {/* Add more fields as needed */}
      <div className="mt-6">
        <NoteForm contactId={id} />
        <h2 className="text-lg font-semibold mb-2 mt-6">Notes</h2>
        {notes.length === 0 ? (
          <div className="text-gray-500">No notes for this contact.</div>
        ) : (
          <ul className="list-disc pl-5">
            {notes.map(n => (
              <li key={n.noteId} className="mb-2">
                <div className="font-medium">{n.note}</div>
                <div className="text-xs text-gray-500">
                  Created: {n.createdOn ? new Date(n.createdOn).toLocaleDateString() : '-'}
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