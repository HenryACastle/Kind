import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { contact } from "@/db/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const contacts = await db.select().from(contact).where(eq(contact.id, id));
  const c = contacts[0];
  if (!c) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  return NextResponse.json(c);
} 