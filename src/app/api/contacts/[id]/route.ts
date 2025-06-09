import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { contact, noteMapping, note } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').filter(Boolean).at(2); 
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const contacts = await db.select().from(contact).where(eq(contact.id, Number(id)));
  const c = contacts[0];
  if (!c) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  // Fetch notes for this contact
  const mappings = await db.select().from(noteMapping).where(eq(noteMapping.contactId, Number(id)));
  const noteIds = mappings.map(m => m.noteId);
  let notes: typeof note.$inferSelect[] = [];
  const filteredNoteIds = noteIds.filter((id): id is number => typeof id === 'number');
  if (filteredNoteIds.length > 0) {
    notes = await db.select().from(note).where(inArray(note.noteId, filteredNoteIds));
  }

  return NextResponse.json({ contact: c, notes });
} 