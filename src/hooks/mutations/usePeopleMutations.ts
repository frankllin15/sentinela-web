import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { peopleService } from '@/services/people.service';
import { queryKeys } from '@/lib/query-keys';
import type { CreatePersonDto, UpdatePersonDto } from '@/types/person.types';

export function useCreatePerson() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreatePersonDto) => peopleService.create(data),
    onSuccess: (person) => {
      // Cachear nova pessoa para navegação instantânea
      queryClient.setQueryData(queryKeys.people.detail(person.id), person);
      // Invalidar listas para atualizar busca
      queryClient.invalidateQueries({ queryKey: queryKeys.people.lists() });
      toast.success('Cadastro realizado com sucesso!');
      navigate(`/app/people/${person.id}`);
    },
  });
}

export function useUpdatePerson(personId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdatePersonDto) => peopleService.update(personId, data),
    onSuccess: (updatedPerson) => {
      // Atualizar cache local
      queryClient.setQueryData(queryKeys.people.detail(personId), updatedPerson);
      // Invalidar listas para atualizar busca
      queryClient.invalidateQueries({ queryKey: queryKeys.people.lists() });
      toast.success('Cadastro atualizado com sucesso!');
      navigate(`/app/people/${personId}`);
    },
  });
}
