'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-3xl mix-blend-multiply animate-pulse-subtle"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-info/20 blur-3xl mix-blend-multiply animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>

      <Card className="w-full max-w-md p-8 relative z-10 glass-card animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 text-2xl">
            ⚡
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your school fees</p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email Address" 
            name="email" 
            type="email" 
            autoComplete="email" 
            required 
            placeholder="admin@school.com" 
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            autoComplete="current-password" 
            required 
            placeholder="••••••••" 
          />
          
          <div className="pt-2">
            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
            Register your school
          </Link>
        </div>
      </Card>
    </div>
  );
}
