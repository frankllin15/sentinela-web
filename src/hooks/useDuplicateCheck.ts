import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { peopleService } from '@/services/people.service';
import type { Person } from '@/types/person.types';

interface UseDuplicateCheckReturn {
  isDuplicate: boolean;
  duplicateData: Person | null;
  isChecking: boolean;
}

export function useDuplicateCheck(cpf: string): UseDuplicateCheckReturn {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateData, setDuplicateData] = useState<Person | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const debouncedCpf = useDebounce(cpf, 500);

  useEffect(() => {
    if (!debouncedCpf || debouncedCpf.length < 11) {
      setIsDuplicate(false);
      setDuplicateData(null);
      return;
    }

    const checkDuplicate = async () => {
      setIsChecking(true);
      try {
        const person = await peopleService.checkByCpf(debouncedCpf);
        if (person) {
          setIsDuplicate(true);
          setDuplicateData(person);
        } else {
          setIsDuplicate(false);
          setDuplicateData(null);
        }
      } catch {
        setIsDuplicate(false);
        setDuplicateData(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkDuplicate();
  }, [debouncedCpf]);

  return { isDuplicate, duplicateData, isChecking };
}
