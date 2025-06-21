"use client"

import SyncWithGoogleButton from '@/components/SyncWithGoogleButton';
import Link from 'next/link';
import { Pencil, UserRoundPlus, Search, Filter, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from "react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      const res = await fetch("/api/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts);
      }
      setLoading(false);
    }
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(c => {
    const term = search.toLowerCase();
    return (
      c.firstName?.toLowerCase().includes(term) ||
      c.middleName?.toLowerCase().includes(term) ||
      c.lastName?.toLowerCase().includes(term) ||
      c.mnemonic?.toLowerCase().includes(term) ||
      c.nickname?.toLowerCase().includes(term)
    );
  });

  function getAvatar(name: string | null | undefined, idx: number) {
    const colors = [
      'bg-secondary',
    ];
    const initial = name?.[0]?.toUpperCase() || '?';
    return (
      <span
        className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg ${colors[idx % colors.length]}`}
      >
        {initial}
      </span>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Component */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''} in Kind
            </p>
          </div>
          <div className="flex gap-2">
            <SyncWithGoogleButton />
            <Link href="/app/new">
              <Button variant="secondary">
                <UserRoundPlus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contacts by name, nickname, or mnemonic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserRoundPlus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {search ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {search ? 'Try adjusting your search terms' : 'Start building your network by adding your first contact'}
          </p>
          {!search && (
            <Link href="/contacts/new">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <UserRoundPlus className="w-4 h-4 mr-2" />
                Add Your First Contact
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="">
          {filteredContacts.map((c, idx) => (
            <div
              key={c.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200 mb-2"
            >
              <Link href={`/app/${c.id}`} className="flex-1">
                <div className="flex  justify-between items-center ">
                  <div className="flex items-center gap-3">
                    {getAvatar(c.firstName, idx)}
                    <div className="flex-1 min-w-0 ">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {[c.firstName, c.middleName, c.lastName, c.suffix].filter(Boolean).join(' ')}
                      </h3>
                      {(c.nickname || c.mnemonic) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {c.nickname && <span className="italic">{c.nickname}</span>}
                          {c.nickname && c.mnemonic && <span> • </span>}
                          {c.mnemonic && <span className="font-mono">{c.mnemonic}</span>}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {c.phoneNumber && (
                      <>
                        <Link href={`tel:${c.phoneNumber}`}>
                          <Button variant="secondary"><Phone /></Button>
                        </Link>
                        <Link href={`sms:${c.phoneNumber}`}>
                          <Button variant="secondary"><MessageSquare /></Button>
                        </Link>
                      </>
                    )}

                    <Link href={`/app/${c.id}/edit`}>
                      <Button   >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Link>



            </div>
          ))}
        </div>
      )}
    </div>
  );
}
