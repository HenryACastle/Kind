import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { note, noteMapping } from '@/db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    // Extract id from the URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').filter(Boolean).at(-2); // gets the [id] from /api/contacts/[id]/add-note
    const contactId = Number(id);

    const today = new Date();

    const { noteText, relatedDate: reqRelatedDate } = await req.json();
    // Insert note



    const inserted = await db.insert(note).values({
      noteText: noteText,
      createdOn: today.toISOString(),
      relatedDate: reqRelatedDate,
    }).returning();
    const newNote = inserted[0];
    // Insert mapping
    await db.insert(noteMapping).values({
      noteId: newNote.noteId,
      contactId,
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "An unknown error occurred" }, { status: 500 });
  }
} 