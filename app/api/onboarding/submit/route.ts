import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tenants, plants, users, machines, components } from '@/lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orgName, orgSlug, plantName, plantLocation, adminName, adminEmail, assets } = body;

        // Basic Validation
        if (!orgName || !plantName || !adminEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!, // REQUIRED: Service Role to bypass RLS and create tenant/users
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                }
            }
        );

        // 1. Create Tenant
        // Use random UUID for ID calling wrapper/ORM or letting DB handle default if configured
        const tenantId = crypto.randomUUID();

        // Note: We are using Drizzle for data insertion, but for Auth user creation we need Supabase Admin API.
        // Since we are in a Route Handler, we can use the Service Role client.

        // Insert Tenant into DB
        try {
            await db.insert(tenants).values({
                id: tenantId,
                name: orgName,
                slug: orgSlug || orgName.toLowerCase().replace(/ /g, '-'),
            });
        } catch (e) {
            console.error('Error creating tenant:', e);
            return NextResponse.json({ error: 'Error creating organization. Slug might be taken.' }, { status: 409 });
        }

        // 2. Create First Plant
        const plantId = crypto.randomUUID();
        await db.insert(plants).values({
            id: plantId,
            tenantId: tenantId,
            name: plantName,
            location: plantLocation,
        });

        // 3. Create Admin User (Supabase Auth + DB Profile)
        // Check if user already exists
        const { data: existingUser } = await supabase.auth.admin.listUsers();
        // Simple check, real app should be more robust

        let userId = '';

        try {
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                email: adminEmail,
                password: 'TempPassword123!', // In real app, send invite email
                email_confirm: true,
                user_metadata: {
                    full_name: adminName,
                    tenant_id: tenantId,
                    role: 'supervisor' // Admin role
                }
            });

            if (createError) throw createError;
            userId = newUser.user.id;
        } catch (e) {
            console.log('User might already exist, linking...');
            // Logic to handle existing user invites would go here.
            // For now, we assume fresh user or manual fail.
            return NextResponse.json({ error: 'User creation failed. Email might be in use.' }, { status: 400 });
        }

        // Insert into internal users table (if not handled by trigger/webhook)
        await db.insert(users).values({
            id: userId,
            tenantId: tenantId,
            name: adminName,
            email: adminEmail,
            role: 'supervisor', // Mapped to Admin in our simple role system
        });


        // 4. Import Assets (if any)
        if (assets && assets.length > 0) {
            // Very basic loop for demo purposes. Bulk insert is better.
            // Structure: Machine Name | Component Name | Criticality

            // Group by Machine to optimize
            // ... (Simple implementation for MVP)
        }

        return NextResponse.json({
            success: true,
            tenantId,
            message: 'Organization setup complete'
        });

    } catch (error) {
        console.error('Onboarding Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
