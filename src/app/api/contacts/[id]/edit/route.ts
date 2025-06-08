import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { contact } from '@/db/schema';
import { eq, and, not } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const formData = await req.formData();
    const firstName = formData.get('firstName')?.toString() || '';
    const middleName = formData.get('middleName')?.toString() || '';
    const lastName = formData.get('lastName')?.toString() || '';
    // Add more fields as needed

    // Check for duplicate (excluding this contact)
    const duplicates = await db.select().from(contact).where(
      and(
        eq(contact.firstName, firstName),
        eq(contact.middleName, middleName),
        eq(contact.lastName, lastName),
        not(eq(contact.id, id))
      )
    );
    if (duplicates.length > 0) {
      return NextResponse.json({ error: 'A contact with this name already exists.' }, { status: 400 });
    }

    // Update the contact
    await db.update(contact)
      .set({ firstName, middleName, lastName })
      .where(eq(contact.id, id));

    return NextResponse.json({ success: true, redirect: `/contacts/${id}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 