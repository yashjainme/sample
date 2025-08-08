// server/context.ts

import { getSession } from '@auth0/nextjs-auth0';
import { type inferAsyncReturnType } from '@trpc/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export async function createContext() {
  const session = await getSession();

  // Create a new Supabase client for each request, authenticated with the user's Auth0 access token
  let supabase: SupabaseClient | null = null;
  if (session?.accessToken) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            // Pass the Auth0 access token to Supabase for authentication
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      }
    );
  }

  return {
    user: session?.user,
    supabase, // Pass the request-scoped client through the context
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;