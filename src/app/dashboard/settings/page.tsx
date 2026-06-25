'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { createClient } from '@/lib/supabase/client';
import { Building, LogOut, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const supabase = createClient();
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.schoolName) {
      setSchoolName(user.user_metadata.schoolName);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { schoolName }
      });

      if (error) throw error;
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your school profile and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card padding="md">
            <CardHeader>
              <CardTitle>School Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <Alert variant="error" className="mb-4">{error}</Alert>}
              {success && (
                <div className="mb-4 p-3 bg-success-bg text-success border border-success/20 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  Profile updated successfully!
                </div>
              )}
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input 
                  label="School Name" 
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  leadingIcon={<Building size={18} />}
                  required
                />
                
                <Input 
                  label="Administrator Email" 
                  value={user?.email || ''}
                  disabled
                  hint="Contact support to change your primary email address."
                />

                <div className="pt-2 flex justify-end">
                  <Button type="submit" loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <div className="space-y-6">
          <Card padding="md">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You are currently signed in as an administrator.
              </p>
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => signOut()}
                className="text-error border-error/20 hover:bg-error-bg hover:border-error"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
