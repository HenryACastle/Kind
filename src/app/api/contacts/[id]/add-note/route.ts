import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { note, noteMapping } from '@/db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contactId = Number(params.id);
    const { note: noteText, relatedDate } = await req.json();
    const today = new Date();
    // Insert note
    const inserted = await db.insert(note).values({
      note: noteText,
      createdOn: today,
      relatedDate: relatedDate ? new Date(relatedDate) : today,
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