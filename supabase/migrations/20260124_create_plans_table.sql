-- Create technical_plans table
create table if not exists public.technical_plans (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  name text not null,
  description text,
  image_url text not null,
  svg_content text, -- Stores the vectorized SVG content directly for easy rendering
  tikz_code text,   -- Stores the source Latex/TikZ code
  related_asset_id uuid, -- Optional link to a machine or equipment
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.technical_plans enable row level security;

-- Create policies
create policy "Users can view plans from their tenant"
  on public.technical_plans for select
  using (auth.uid() in (
    select user_id from public.tenant_users where tenant_id = technical_plans.tenant_id
  ));

create policy "Admins can manage plans from their tenant"
  on public.technical_plans for all
  using (
    exists (
      select 1 from public.tenant_users
      where user_id = auth.uid()
      and tenant_id = technical_plans.tenant_id
      and role in ('admin', 'supervisor')
    )
  );

-- Add updated_at trigger
create trigger handle_updated_at before update on public.technical_plans
  for each row execute procedure moddatetime (updated_at);
