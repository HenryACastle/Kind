import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { contact, noteMapping, note } from "@/db/schema";
import { eq, inArray, not, and } from "drizzle-orm";

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

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').filter(Boolean).at(-1);

    const data = await req.json();
    const {
      firstName = "",
      middleName = "",
      lastName = "",
      suffix = "",
      nickname = "",
      mnemonic = "",
      summary = "",
      introducedBy = "",
      website = "",
      linkedin = "",
      instagram = "",
      twitter = "",
      jobTitle = "",
      company = "",
      mainNationality = "",
      secondaryNationality = "",
    } = data;

    // Check for duplicate (excluding this contact)
    const duplicates = await db.select().from(contact).where(
      and(
        eq(contact.firstName, firstName),
        eq(contact.middleName, middleName),
        eq(contact.lastName, lastName),
        not(eq(contact.id, Number(id)))
      )
    );
    if (duplicates.length > 0) {
      return NextResponse.json({ error: 'A contact with this name already exists.' }, { status: 400 });
    }

    // Update the contact
    await db.update(contact)
      .set({
        firstName,
        middleName,
        lastName,
        suffix,
        nickname,
        mnemonic,
        summary,
        introducedBy,
        website,
        linkedin,
        instagram,
        twitter,
        jobTitle,
        company,
        mainNationality,
        secondaryNationality,
      })
      .where(eq(contact.id, Number(id)));

    return NextResponse.json({ success: true, redirect: `/contacts/${id}` });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "An unknown error occurred" }, { status: 500 });
  }
} 