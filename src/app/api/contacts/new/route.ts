import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { contact } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
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

    // Check for duplicate
    const existing = await db.select().from(contact).where(
      and(
        eq(contact.firstName, firstName),
        eq(contact.middleName, middleName),
        eq(contact.lastName, lastName)
      )
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: "A contact with this name already exists." }, { status: 400 });
    }

    // Insert new contact
    const result = await db.insert(contact).values({
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
    }).returning();

    const newContact = result[0];
    if (!newContact) {
      return NextResponse.json({ error: "Failed to create contact." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: newContact.id });
  } catch (err: unknown) {
    console.error("Error creating contact:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
} 