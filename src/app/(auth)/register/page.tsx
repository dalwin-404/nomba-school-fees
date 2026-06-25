'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Mail, EyeOff, Eye, GraduationCap, Building } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-slide-up border dark:border-slate-800">
        
        {/* Left Side: Illustration */}
        <div className="w-full md:w-1/2 relative bg-slate-900 hidden md:flex flex-col justify-between p-8 overflow-hidden">
          <div className="flex items-center gap-2 z-10 drop-shadow-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-sm">
              <GraduationCap className="text-[#6d28d9]" size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              SchoolPay.
            </h1>
          </div>
          
          <div className="absolute inset-0 z-0">
            <Image 
              src="/fintech-auth-illustration.png" 
              alt="Fintech Payment Flow" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Sign Up</h2>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input 
                label="School Name" 
                name="schoolName" 
                required 
                placeholder="Greenwood High School" 
                leadingIcon={<Building size={18} />}
                className="focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>

            <div>
              <Input 
                label="Admin Email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                placeholder="admin@school.com" 
                leadingIcon={<Mail size={18} />}
                className="focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="Password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                autoComplete="new-password" 
                required 
                placeholder="••••••••" 
                leadingIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-slate-700 dark:hover:text-slate-300">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                }
                className="focus:border-amber-400 focus:ring-amber-400/20"
              />
              <Input 
                label="Confirm Password" 
                name="confirmPassword" 
                type={showPassword ? "text" : "password"} 
                autoComplete="new-password" 
                required 
                placeholder="••••••••" 
                leadingIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-slate-700 dark:hover:text-slate-300">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                }
                className="focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                fullWidth 
                loading={loading}
                className="bg-[#f87171] hover:bg-[#ef4444] text-white py-6 rounded-xl text-lg font-semibold shadow-md shadow-red-500/20"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
            <Link href="/login" className="text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors">
              Log in here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
