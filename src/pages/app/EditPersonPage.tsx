import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
import { MediaType, type Media } from '@/types/media.types';
import type { Person } from '@/types/person.types';

export function EditPersonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [existingMedias, setExistingMedias] = useState<Media[]>([]);
  const [mediasToDelete, setMediasToDelete] = useState<number[]>([]);

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

  // Load person data and media
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        toast.error('ID da pessoa não encontrado');
        navigate('/app/home');
        return;
      }

      try {
        setIsLoading(true);
        const [personData, mediaData] = await Promise.all([
          peopleService.getById(Number(id)),
          mediaService.getByPersonId(Number(id)),
        ]);

        setPerson(personData);
        setExistingMedias(mediaData);

        // Pre-fill form with person data
        form.reset({
          facePhoto: null,
          fullBodyPhoto: null,
          tattoos: [],
          fullName: personData.fullName,
          nickname: personData.nickname || '',
          cpf: personData.cpf || '',
          rg: personData.rg || '',
          voterId: personData.voterId || '',
          motherName: personData.motherName || '',
          fatherName: personData.fatherName || '',
          addressPrimary: personData.addressPrimary,
          addressSecondary: personData.addressSecondary || '',
          latitude: personData.latitude,
          longitude: personData.longitude,
          hasWarrant: !!personData.warrantStatus,
          warrantStatus: personData.warrantStatus || '',
          warrantFile: null,
          isConfidential: personData.isConfidential,
          notes: personData.notes || '',
        });
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar dados da pessoa');
        navigate('/app/home');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate, form]);

  const onSubmit = async (data: RegisterPersonFormData) => {
    if (!person) return;

    try {
      setIsSaving(true);

      // Get existing media by type
      const existingFaceMedia = existingMedias.find(m => m.type === MediaType.FACE);
      const existingBodyMedia = existingMedias.find(m => m.type === MediaType.FULL_BODY);
      const existingTattoos = existingMedias.filter(m => m.type === MediaType.TATTOO);

      // 1. Upload new media files
      const uploadPromises: Promise<string>[] = [];
      let faceUrl = existingFaceMedia?.url;
      let bodyUrl = existingBodyMedia?.url;
      let warrantUrl = person.warrantFileUrl;

      // Track which media need to be uploaded
      const needFaceUpload = !!data.facePhoto;
      const needBodyUpload = !!data.fullBodyPhoto;
      const needWarrantUpload = !!data.warrantFile;

      if (needFaceUpload) {
        uploadPromises.push(uploadService.upload(data.facePhoto!));
      }

      if (needBodyUpload) {
        uploadPromises.push(uploadService.upload(data.fullBodyPhoto!));
      }

      uploadPromises.push(...data.tattoos.map(t => uploadService.upload(t.photo)));

      if (needWarrantUpload) {
        uploadPromises.push(uploadService.upload(data.warrantFile!));
      }

      const uploadedUrls = await Promise.all(uploadPromises);

      // Extract URLs from uploaded files
      let urlIndex = 0;
      if (needFaceUpload) {
        faceUrl = uploadedUrls[urlIndex++];
        // Mark old face photo for deletion
        if (existingFaceMedia) {
          setMediasToDelete(prev => [...prev, existingFaceMedia.id]);
        }
      }

      if (needBodyUpload) {
        bodyUrl = uploadedUrls[urlIndex++];
        // Mark old body photo for deletion
        if (existingBodyMedia) {
          setMediasToDelete(prev => [...prev, existingBodyMedia.id]);
        }
      }

      const tattooUrls = uploadedUrls.slice(urlIndex, urlIndex + data.tattoos.length);
      urlIndex += data.tattoos.length;

      if (needWarrantUpload) {
        warrantUrl = uploadedUrls[urlIndex];
      }

      // 2. Update person record
      await peopleService.update(person.id, {
        fullName: data.fullName,
        nickname: data.nickname || undefined,
        cpf: data.cpf ? cleanCPF(data.cpf) : undefined,
        rg: data.rg || undefined,
        voterId: data.voterId || undefined,
        addressPrimary: data.addressPrimary || undefined,
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

      // 3. Manage media changes
      const mediaPromises: Promise<unknown>[] = [];

      // Create new face photo if uploaded
      if (needFaceUpload && faceUrl) {
        mediaPromises.push(
          mediaService.create({
            type: MediaType.FACE,
            url: faceUrl,
            personId: person.id,
          })
        );
      }

      // Create new body photo if uploaded
      if (needBodyUpload && bodyUrl) {
        mediaPromises.push(
          mediaService.create({
            type: MediaType.FULL_BODY,
            url: bodyUrl,
            personId: person.id,
          })
        );
      }

      // Delete old tattoos (we're replacing all tattoos with the new set)
      existingTattoos.forEach(tattoo => {
        mediaPromises.push(mediaService.delete(tattoo.id));
      });

      // Create new tattoos
      mediaPromises.push(
        ...data.tattoos.map((tattoo, index) =>
          mediaService.create({
            type: MediaType.TATTOO,
            url: tattooUrls[index],
            label: tattoo.location,
            description: tattoo.description || undefined,
            personId: person.id,
          })
        )
      );

      // Delete marked media
      mediasToDelete.forEach(mediaId => {
        mediaPromises.push(mediaService.delete(mediaId));
      });

      await Promise.all(mediaPromises);

      // 4. Feedback and navigation
      toast.success('Cadastro atualizado com sucesso!');
      navigate(`/app/people/${person.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar cadastro. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!person) {
    return null;
  }

  const existingFaceMedia = existingMedias.find(m => m.type === MediaType.FACE);
  const existingBodyMedia = existingMedias.find(m => m.type === MediaType.FULL_BODY);

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <div className="sticky top-14 md:top-16 z-50 bg-background border-b border-border py-4 mb-6 -mx-4 px-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/app/people/${person.id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Editar Cadastro</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {person.fullName}
              </p>
            </div>
          </div>
          <Button
            type="submit"
            form="edit-form"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          id="edit-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <PersonalDataSection
            control={form.control}
            personId={person.id}
          />
          <Separator />
          <MediaSection
            control={form.control}
            existingFacePhoto={existingFaceMedia}
            existingBodyPhoto={existingBodyMedia}
          />
          <Separator />
          <LocationLegalSection control={form.control} setValue={form.setValue} />
        </form>
      </Form>
    </div>
  );
}
