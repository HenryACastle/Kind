import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { contact, phone } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

export async function GET(req: NextRequest) {
  // Get all contacts
  const contacts = await db
    .select()
    .from(contact)
    .orderBy(contact.firstName, contact.middleName, contact.lastName, contact.suffix);

  // Get all phone numbers
  const allPhones = await db
    .select()
    .from(phone)
    .orderBy(phone.ordinal);

  // Group phones by contactId and get the first one for each contact
  const phoneMap = new Map();
  allPhones.forEach(phone => {
    if (!phoneMap.has(phone.contactId)) {
      phoneMap.set(phone.contactId, phone);
    }
  });

  // Combine contacts with their first phone number
  const contactsWithPhones = contacts.map(contact => {
    const firstPhone = phoneMap.get(contact.id);
    return {
      ...contact,
      phoneNumber: firstPhone?.phoneNumber || null,
      phoneLabel: firstPhone?.label || null,
      phoneOrdinal: firstPhone?.ordinal || null,
    };
  });

  return NextResponse.json({ contacts: contactsWithPhones });
} 