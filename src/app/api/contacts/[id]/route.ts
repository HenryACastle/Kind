import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { contact } from "@/db/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').filter(Boolean).at(-2); // gets the [id] from /api/contacts/[id]/add-note
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const contacts = await db.select().from(contact).where(eq(contact.id, Number(id)));
  const c = contacts[0];
  if (!c) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  return NextResponse.json(c);
} 