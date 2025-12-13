import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MediaSection } from '@/components/register/MediaSection';
import { PersonalDataSection } from '@/components/register/PersonalDataSection';
import { LocationLegalSection } from '@/components/register/LocationLegalSection';
import { registerPersonSchema, type RegisterPersonFormData } from '@/schemas/person.schema';
import { peopleService } from '@/services/people.service';
import { mediaService } from '@/services/media.service';
import { uploadService } from '@/services/upload.service';
import { cleanCPF } from '@/lib/cpf.utils';
import { MediaType } from '@/types/media.types';
import { Loader2 } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<RegisterPersonFormData>({
    resolver: zodResolver(registerPersonSchema),
    defaultValues: {
      facePhoto: null,
      fullBodyPhoto: null,
      tattoos: [],
      fullName: '',
      nickname: '',
      cpf: '',
      rg: '',
      voterId: '',
      motherName: '',
      fatherName: '',
      addressPrimary: '',
      addressSecondary: '',
      latitude: 0,
      longitude: 0,
      hasWarrant: false,
      warrantStatus: '',
      warrantFile: null,
      isConfidential: false,
      notes: '',
    },
  });

  const onSubmit = async (data: RegisterPersonFormData) => {
    try {
      setIsSaving(true);

      // 1. Upload de todas as mídias em paralelo
      const uploadPromises = [
        uploadService.upload(data.facePhoto!),
        uploadService.upload(data.fullBodyPhoto!),
        ...data.tattoos.map(t => uploadService.upload(t.photo)),
      ];

      if (data.warrantFile) {
        uploadPromises.push(uploadService.upload(data.warrantFile));
      }

      const uploadedUrls = await Promise.all(uploadPromises);

      const faceUrl = uploadedUrls[0];
      const bodyUrl = uploadedUrls[1];
      const tattooUrls = uploadedUrls.slice(2, 2 + data.tattoos.length);
      const warrantUrl = data.warrantFile ? uploadedUrls[uploadedUrls.length - 1] : undefined;

      // 2. Criar registro de pessoa
      const person = await peopleService.create({
        fullName: data.fullName,
        nickname: data.nickname || undefined,
        cpf: data.cpf ? cleanCPF(data.cpf) : undefined,
        rg: data.rg || undefined,
        voterId: data.voterId || undefined,
        addressPrimary: data.addressPrimary,
        addressSecondary: data.addressSecondary || undefined,
        latitude: data.latitude,
        longitude: data.longitude,
        motherName: data.motherName || undefined,
        fatherName: data.fatherName || undefined,
        warrantStatus: data.hasWarrant ? data.warrantStatus : undefined,
        warrantFileUrl: warrantUrl,
        notes: data.notes || undefined,
        isConfidential: data.isConfidential,
      });

      // 3. Criar registros de mídia
      const mediaPromises = [
        mediaService.create({
          type: MediaType.FACE,
          url: faceUrl,
          personId: person.id,
        }),
        mediaService.create({
          type: MediaType.FULL_BODY,
          url: bodyUrl,
          personId: person.id,
        }),
        ...data.tattoos.map((tattoo, index) =>
          mediaService.create({
            type: MediaType.TATTOO,
            url: tattooUrls[index],
            label: tattoo.location,
            description: tattoo.description || undefined,
            personId: person.id,
          })
        ),
      ];

      await Promise.all(mediaPromises);

      // 4. Feedback e redirecionamento
      toast.success('Cadastro realizado com sucesso!');
      navigate(`/app/people/${person.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar cadastro. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <div className="sticky top-14 md:top-16 z-50 bg-background border-b border-border py-4 mb-6 -mx-4 px-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">Novo Cadastro</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Preencha todos os campos obrigatórios
            </p>
          </div>
          <Button
            type="submit"
            form="register-form"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Cadastro'
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          id="register-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <MediaSection control={form.control} />
          <Separator />
          <PersonalDataSection control={form.control} />
          <Separator />
          <LocationLegalSection control={form.control} setValue={form.setValue} />
        </form>
      </Form>
    </div>
  );
}
