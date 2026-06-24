'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const schoolName = formData.get('schoolName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, schoolName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      // Registration successful, now log them in
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signInWithPassword({ email, password });

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-tr from-background via-background to-muted">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-3xl mix-blend-multiply animate-pulse-subtle"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-3xl mix-blend-multiply animate-pulse-subtle" style={{ animationDelay: '1.5s' }}></div>

      <Card className="w-full max-w-md p-8 relative z-10 glass-card animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Register School</h1>
          <p className="text-sm text-muted-foreground mt-1">Get started with automated fee tracking</p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="School Name" 
            name="schoolName" 
            required 
            placeholder="Greenwood High School" 
          />
          <Input 
            label="Admin Email Address" 
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
            autoComplete="new-password" 
            required 
            placeholder="••••••••" 
          />
          <Input 
            label="Confirm Password" 
            name="confirmPassword" 
            type="password" 
            autoComplete="new-password" 
            required 
            placeholder="••••••••" 
          />
          
          <div className="pt-2">
            <Button type="submit" fullWidth loading={loading}>
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
