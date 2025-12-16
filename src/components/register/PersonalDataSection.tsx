import { type Control, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DuplicateWarning } from './DuplicateWarning';
import { useDuplicateCheck } from '@/hooks/useDuplicateCheck';
import { formatCPF, cleanCPF } from '@/lib/cpf.utils';
import type { RegisterPersonFormData } from '@/schemas/person.schema';
import { Loader2 } from 'lucide-react';

interface PersonalDataSectionProps {
  control: Control<RegisterPersonFormData>;
  personId?: number;
}

export function PersonalDataSection({ control, personId }: PersonalDataSectionProps) {
  const cpf = useWatch({ control, name: 'cpf' });
  const cleanedCpf = cpf ? cleanCPF(cpf) : '';
  const { isDuplicate, duplicateData, isChecking } = useDuplicateCheck(cleanedCpf, personId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">
          Seção B: Dados Pessoais
        </h2>
        <p className="text-sm text-muted-foreground">
          Informações de identificação do indivíduo
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome completo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vulgo/Apelido</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o vulgo ou apelido"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
                {isChecking && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Verificando...
                  </div>
                )}
                {isDuplicate && duplicateData && (
                  <DuplicateWarning
                    message={`CPF já cadastrado: ${duplicateData.fullName}`}
                  />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o RG"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="voterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título de Eleitor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o título"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="motherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Mãe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome da mãe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Pai</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome do pai"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
