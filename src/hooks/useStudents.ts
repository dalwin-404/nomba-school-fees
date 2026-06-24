import { useState, useCallback } from 'react';

export function useStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = async (studentData: any) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create student');
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  return { students, loading, error, fetchStudents, createStudent };
}
