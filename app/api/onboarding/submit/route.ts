import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orgName, orgSlug, plantName, plantLocation, adminName, adminEmail } = body;

        // Basic Validation
        if (!orgName || !plantName || !adminEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                }
            }
        );

        // 1. Create Tenant in Supabase
        const tenantId = crypto.randomUUID();
        const slug = orgSlug || orgName.toLowerCase().replace(/ /g, '-');

        const { error: tenantError } = await supabase
            .from('tenants')
            .insert({
                id: tenantId,
                name: orgName,
                slug: slug,
            });

        if (tenantError) {
            console.error('Error creating tenant:', tenantError);
            return NextResponse.json({ error: 'Error creating organization. Slug might be taken.' }, { status: 409 });
        }

        // 2. Create First Plant in Supabase
        const plantId = crypto.randomUUID();
        const { error: plantError } = await supabase
            .from('plants')
            .insert({
                id: plantId,
                tenant_id: tenantId,
                name: plantName,
                location: plantLocation,
            });

        if (plantError) {
            console.error('Error creating plant:', plantError);
        }

        // 3. Create Admin User (if service role key available)
        let userId = '';

        if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
            try {
                const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                    email: adminEmail,
                    password: 'TempPassword123!', // In production, send invite email
                    email_confirm: true,
                    user_metadata: {
                        full_name: adminName,
                        tenant_id: tenantId,
                        role: 'supervisor'
                    }
                });

                if (createError) throw createError;
                userId = newUser.user.id;

                // Insert profile
                await supabase.from('profiles').insert({
                    id: userId,
                    tenant_id: tenantId,
                    full_name: adminName,
                    email: adminEmail,
                    role: 'supervisor',
                });

            } catch (e) {
                console.log('User creation failed:', e);
                return NextResponse.json({ error: 'User creation failed. Email might be in use.' }, { status: 400 });
            }
        } else {
            console.log('No service role key, skipping user creation');
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
