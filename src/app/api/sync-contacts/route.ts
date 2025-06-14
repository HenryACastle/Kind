import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { contact, phone } from '@/db/schema';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);
async function getGoogleToken() {
    const { userId } = await auth()

    const client = await clerkClient()
    const token = await client.users.getUserOauthAccessToken(userId || '', 'oauth_google')

    return {
        token: token.data[0].token,
    }
}

export async function POST() {
    const { userId } = await auth();
    console.log("userId", userId);
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const token = await getGoogleToken();
    if (!token) return NextResponse.json({ error: 'No Google token', debugToken: token }, { status: 401 });

    // Fetch contacts from your DB
    const contacts = await db.select().from(contact);

    const updatedContacts = [];

    // For each contact, create in Google People API
    for (const c of contacts) {
        // Fetch phone numbers for the contact
        const phones = await db.select().from(phone).where(eq(phone.contactId, c.id));

        // Check for existing contact in Google People API
        let existingContacts;
        try {
            const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token.token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to fetch contacts:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText
                });
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            if (!text) {
                throw new Error('Empty response received');
            }
            existingContacts = JSON.parse(text);
            console.log('Existing contacts:', JSON.stringify(existingContacts, null, 2));
        } catch (error) {
            console.error('Error fetching existing contacts:', error);
            continue;
        }

        // Log the current contact being processed
        console.log('Processing contact:', {
            firstName: c.firstName,
            lastName: c.lastName,
            phones: phones
        });

        const isDuplicate = existingContacts.connections.some((conn: { names?: { givenName?: string; familyName?: string; }[]; resourceName?: string }) => 
            conn.names && conn.names.some((name: { givenName?: string; familyName?: string; }) => {
                // If both first and last names match exactly
                if (name.givenName === c.firstName && name.familyName === c.lastName) {
                    return true;
                }
                // If only first name matches and both have no last name
                if (name.givenName === c.firstName && !name.familyName && !c.lastName) {
                    return true;
                }
                return false;
            })
        );

        console.log('Is duplicate:', isDuplicate);

        if (isDuplicate) {
            const existingContact = existingContacts.connections.find((conn: { names?: { givenName?: string; familyName?: string; }[]; resourceName?: string }) => 
                conn.names && conn.names.some((name: { givenName?: string; familyName?: string; }) => {
                    // If both first and last names match exactly
                    if (name.givenName === c.firstName && name.familyName === c.lastName) {
                        return true;
                    }
                    // If only first name matches and both have no last name
                    if (name.givenName === c.firstName && !name.familyName && !c.lastName) {
                        return true;
                    }
                    return false;
                })
            );

            console.log('Found existing contact:', existingContact);

            if (existingContact && existingContact.resourceName) {
                const updateBody = {
                    names: [
                        {
                            givenName: c.firstName || '',
                            middleName: c.middleName || undefined,
                            familyName: c.lastName || '',
                        },
                    ],
                    phoneNumbers: phones.map(p => ({ value: p.phoneNumber })),
                };
                console.log('Update request body:', JSON.stringify(updateBody, null, 2));

                const updateResponse = await fetch(`https://people.googleapis.com/v1/${existingContact.resourceName}:updateContact`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateBody),
                });
                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    console.error('Failed to update contact:', {
                        contact: `${c.firstName} ${c.lastName}`,
                        status: updateResponse.status,
                        statusText: updateResponse.statusText,
                        error: errorText
                    });
                } else {
                    updatedContacts.push(`${c.firstName} ${c.middleName || ''} ${c.lastName} ${c.suffix || ''}`);
                    console.log(`Updated existing contact: ${c.firstName} ${c.lastName}`);
                }
                continue;
            }
        }

        const createBody = {
            names: [
                {
                    givenName: c.firstName || '',
                    middleName: c.middleName || undefined,
                    familyName: c.lastName || '',
                },
            ],
            phoneNumbers: phones.map(p => ({ value: p.phoneNumber })),
        };
        console.log('Create request body:', JSON.stringify(createBody, null, 2));

        const createResponse = await fetch('https://people.googleapis.com/v1/people:createContact', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createBody),
        });
        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('Failed to create contact:', {
                contact: `${c.firstName} ${c.lastName}`,
                status: createResponse.status,
                statusText: createResponse.statusText,
                error: errorText
            });
        } else {
            updatedContacts.push(`${c.firstName} ${c.middleName || ''} ${c.lastName} ${c.suffix || ''}`);
            console.log(`Created new contact: ${c.firstName} ${c.lastName}`);
        }
    }

    return NextResponse.json({ success: true, updatedContacts });
} 