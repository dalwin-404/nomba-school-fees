import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, session, loading, signOut: baseSignOut } = useSupabase();
  const router = useRouter();

  const signOut = async () => {
    await baseSignOut();
    router.push('/login');
  };

  return { user, session, loading, signOut };
}
