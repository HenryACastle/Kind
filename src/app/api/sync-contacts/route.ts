import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { contact } from '@/db/schema';

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

    // For each contact, create in Google People API
    for (const c of contacts) {
        // Only send the name to Google People API
        const body = {
            names: [
                {
                    givenName: c.firstName || '',
                    middleName: c.middleName || undefined,
                    familyName: c.lastName || '',
                },
            ],
        };
        await fetch('https://people.googleapis.com/v1/people:createContact', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    return NextResponse.json({ success: true });
} 