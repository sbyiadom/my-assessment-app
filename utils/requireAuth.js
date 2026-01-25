import { supabase } from '../supabase/client';

export async function requireAuth(requiredRole) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const role = session.user.user_metadata.role;

  if (requiredRole && role !== requiredRole) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  return { props: { user: session.user } };
}
