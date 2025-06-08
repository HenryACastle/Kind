import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { contact } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const firstName = formData.get("firstName")?.toString() || "";
    const middleName = formData.get("middleName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";

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
    }).returning();

    const newContact = result[0];
    if (!newContact) {
      return NextResponse.json({ error: "Failed to create contact." }, { status: 500 });
    }

    return NextResponse.json({ success: true, redirect: `/contacts/${newContact.id}` });
  } catch (err: any) {
    console.error("Error creating contact:", err);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
} 