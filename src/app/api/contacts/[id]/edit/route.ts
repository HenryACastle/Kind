import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { contact } from '@/db/schema';
import { eq, and, not } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const id = url.pathname.split('/').filter(Boolean).at(-2); // gets the [id] from /api/contacts/[id]/add-note
    const formData = await req.json();
    const firstName = formData.firstName || '';
    const middleName = formData.middleName || '';
    const lastName = formData.lastName || '';
    const suffix = formData.get("suffix")?.toString() || "";
    const nickname = formData.get("nickname")?.toString() || "";
    const mnemonic = formData.get("mnemonic")?.toString() || "";
    const summary = formData.get("summary")?.toString() || "";
    const introducedBy = formData.get("introducedBy")?.toString() || "";
    const website = formData.get("website")?.toString() || "";
    const linkedin = formData.get("linkedin")?.toString() || "";
    const instagram = formData.get("instagram")?.toString() || "";
    const twitter = formData.get("twitter")?.toString() || "";
    const jobTitle = formData.get("jobTitle")?.toString() || "";
    const company = formData.get("company")?.toString() || "";
    const mainNationality = formData.get("mainNationality")?.toString() || "";
    const secondaryNationality = formData.get("secondaryNationality")?.toString() || "";
    


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
      .set({ firstName,
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
        secondaryNationality, })
      .where(eq(contact.id, Number(id)));

    return NextResponse.json({ success: true, redirect: `/contacts/${id}` });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "An unknown error occurred" }, { status: 500 });
  }
} 