import { drizzle } from 'drizzle-orm/neon-http';
import { contact } from '@/db/schema';
import SyncWithGoogleButton from './SyncWithGoogleButton';
import Link from 'next/link';
import { Pencil, UserRoundPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// You may want to move this to a shared db client file in the future
const db = drizzle(process.env.DATABASE_URL!);

async function getContacts() {
  // Fetch all contacts
  return await db.select().from(contact).orderBy(contact.firstName);
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  // Helper to get initials and color
  function getAvatar(name: string | null | undefined, idx: number) {
    const colors = [
      'bg-orange-500',
      'bg-red-500',
      'bg-pink-700',
      'bg-purple-700',
      'bg-blue-600',
    ];
    const initial = name?.[0]?.toUpperCase() || '?';
    return (
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-lg ${colors[idx % colors.length]}`}
      >
        {initial}
      </span>
    );
  }

  return (
    <div className="max-w-3xl mx-auto ">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Contacts <span className="text-gray-400 text-base">({contacts.length})</span></h2>
        <SyncWithGoogleButton />
        <Link href="/contacts/new">
          <Button>
            <UserRoundPlus />
          </Button>
        </Link>
      </div>
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2"> </th>
            <th className="py-2">Name</th>
            <th className="py-2">Actions</th>

          </tr>
        </thead>
        <tbody>
          {contacts.map((c, idx) => (
            <tr
              key={c.id}
              className="border-b last:border-0 hover:bg-gray-50 transition h-14 items-center align-middle cursor-pointer"
            >
              <td className="align-middle items-center">
                <Link href={`/contacts/${c.id}`} className="flex items-center gap-2 no-underline w-full h-full">
                  {getAvatar(c.firstName, idx)}
                </Link>
              </td>
              <td className="align-middle">
                <Link href={`/contacts/${c.id}`} className="flex flex-col justify-center no-underline w-full h-full">
                  <span className="font-medium">
                    {[c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(c.nickname || "") + " "} - {" " + (c.mnemonic || "")}
                  </span>
                </Link>
              </td>
              <td className="align-middle">
                <Link href={`/contacts/${c.id}/edit`} className="">
                  <Button>
                    <Pencil />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
