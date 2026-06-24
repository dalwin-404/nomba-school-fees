'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStudents } from '@/hooks/useStudents';
import { StudentTable } from '@/components/students/StudentTable';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function StudentsPage() {
  const { students, loading, error, fetchStudents } = useStudents();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Students Directory</h2>
          <p className="text-sm text-muted-foreground">Manage students and virtual accounts</p>
        </div>
        <Link href="/dashboard/students/new">
          <Button>➕ Add Student</Button>
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <StudentTable students={students} loading={loading} />
    </div>
  );
}
