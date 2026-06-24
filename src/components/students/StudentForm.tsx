import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CLASS_LEVELS, CURRENT_TERM } from '@/lib/constants';
import { useStudents } from '@/hooks/useStudents';

export function StudentForm() {
  const router = useRouter();
  const { createStudent } = useStudents();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      classLevel: formData.get('classLevel') as string,
      parentEmail: formData.get('parentEmail') as string,
      parentPhone: formData.get('parentPhone') as string,
      expectedFee: Number(formData.get('expectedFee')),
      term: CURRENT_TERM,
    };

    try {
      const res = await createStudent(data);
      setSuccessData(res.student);
    } catch (err: any) {
      setError(err.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <Card className="p-8 max-w-lg mx-auto text-center animate-scale-in">
        <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          🎉
        </div>
        <h2 className="text-2xl font-bold mb-2">Student Created!</h2>
        <p className="text-muted-foreground mb-6">
          {successData.first_name} {successData.last_name} has been added successfully.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => setSuccessData(null)}>
            Add Another
          </Button>
          <Button onClick={() => router.push(`/dashboard/students/${successData.id}`)}>
            View Details
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Register New Student</h2>
        <p className="text-sm text-muted-foreground">Fill in the details to assign a virtual account.</p>
      </div>

      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="First Name" 
            name="firstName" 
            required 
            placeholder="John" 
          />
          <Input 
            label="Last Name" 
            name="lastName" 
            required 
            placeholder="Doe" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">Class Level</label>
            <select 
              name="classLevel" 
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">Select a class...</option>
              {CLASS_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <Input 
            label={`Expected Fee for ${CURRENT_TERM}`}
            name="expectedFee" 
            type="number"
            min="1"
            step="any"
            required 
            leadingIcon={<span className="text-muted-foreground font-medium">₦</span>}
            placeholder="50000" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Parent Email (Optional)" 
            name="parentEmail" 
            type="email"
            placeholder="parent@example.com" 
          />
          <Input 
            label="Parent Phone (Optional)" 
            name="parentPhone" 
            type="tel"
            placeholder="08012345678" 
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Student & Generate Account
          </Button>
        </div>
      </form>
    </Card>
  );
}
