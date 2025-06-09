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

    return NextResponse.json({ success: true, redirect: `/contacts/${newContact.id}` });
  } catch (err: unknown) {
    console.error("Error creating contact:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
} 