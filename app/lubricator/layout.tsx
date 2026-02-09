'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LubricatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (userData?.full_name) {
          setUserName(userData.full_name);
        }
      }
    };
    
    fetchUser();
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F1419' }}>
      <header
        className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between h-16 px-6"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <h1 className="text-2xl font-bold" style={{ color: '#D4740E' }}>
          BITACORA
        </h1>
        {userName && (
          <span className="text-lg text-white font-medium">
            {userName}
          </span>
        )}
      </header>

      <main className="flex-1 pt-16 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
