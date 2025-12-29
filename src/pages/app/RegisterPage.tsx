import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toasts } from "@/lib/toast.utils";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MediaSection } from "@/components/register/MediaSection";
import { PersonalDataSection } from "@/components/register/PersonalDataSection";
import { LocationLegalSection } from "@/components/register/LocationLegalSection";
import {
  registerPersonSchema,
  type RegisterPersonFormData,
} from "@/schemas/person.schema";
import { useCreatePerson } from "@/hooks/mutations/usePeopleMutations";
import { mediaService } from "@/services/media.service";
import { uploadService } from "@/services/upload.service";
import { cleanCPF } from "@/lib/cpf.utils";
import { MediaType } from "@/types/media.types";
import { Loader2, Home, Plus } from "lucide-react";
import { UploadCategory } from "@/types/upload-category";
import { PageHeader } from "@/components/layout/PageHeader";

export function RegisterPage() {
  const [isSaving, setIsSaving] = useState(false);
  const createPersonMutation = useCreatePerson();

  const form = useForm<RegisterPersonFormData>({
    resolver: zodResolver(registerPersonSchema),
    defaultValues: {
      facePhoto: null,
      fullBodyPhoto: null,
      tattoos: [],
      fullName: "",
      nickname: "",
      cpf: "",
      rg: "",
      voterId: "",
      motherName: "",
      fatherName: "",
      addressPrimary: "",
      addressSecondary: "",
      latitude: 0,
      longitude: 0,
      hasWarrant: false,
      warrantStatus: "",
      warrantFile: null,
      isConfidential: false,
      notes: "",
    },
  });

  const onSubmit = async (data: RegisterPersonFormData) => {
    try {
      setIsSaving(true);

      // 1. Upload de todas as mídias em paralelo (apenas as que existem)
      const uploadPromises: Promise<string>[] = [];

      // Foto de Rosto -> Pasta 'faces'
      if (data.facePhoto) {
        uploadPromises.push(
          uploadService.upload(data.facePhoto, UploadCategory.FACE)
        );
      }

      // Foto de Corpo -> Pasta 'bodies'
      if (data.fullBodyPhoto) {
        uploadPromises.push(
          uploadService.upload(data.fullBodyPhoto, UploadCategory.FULL_BODY)
        );
      }

      // Tatuagens -> Pasta 'tattoos'
      if (data.tattoos.length > 0) {
        // Mapeia todas as tattoos enviando a categoria correta (apenas Files, não URLs)
        const tattooUploads = data.tattoos
          .filter((t) => t.photo instanceof File)
          .map((t) => uploadService.upload(t.photo as File, UploadCategory.TATTOO));
        uploadPromises.push(...tattooUploads);
      }

      // Mandado -> Pasta 'documents'
      if (data.warrantFile) {
        uploadPromises.push(
          uploadService.upload(data.warrantFile, UploadCategory.WARRANT)
        );
      }

      const uploadedUrls = await Promise.all(uploadPromises);

      // Extrair URLs de forma dinâmica
      let urlIndex = 0;
      const faceUrl = data.facePhoto ? uploadedUrls[urlIndex++] : undefined;
      const bodyUrl = data.fullBodyPhoto ? uploadedUrls[urlIndex++] : undefined;
      const tattooUrls = uploadedUrls.slice(
        urlIndex,
        urlIndex + data.tattoos.length
      );
      urlIndex += data.tattoos.length;
      const warrantUrl = data.warrantFile ? uploadedUrls[urlIndex] : undefined;

      // 2. Criar registro de pessoa via mutation
      const person = await createPersonMutation.mutateAsync({
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

      // 3. Criar registros de mídia (apenas as que existem)
      const mediaPromises: Promise<unknown>[] = [];

      if (faceUrl) {
        mediaPromises.push(
          mediaService.create({
            type: MediaType.FACE,
            url: faceUrl,
            personId: person.id,
          })
        );
      }

      if (bodyUrl) {
        mediaPromises.push(
          mediaService.create({
            type: MediaType.FULL_BODY,
            url: bodyUrl,
            personId: person.id,
          })
        );
      }

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

      await Promise.all(mediaPromises);

      // Navigation and toast handled by mutation's onSuccess
    } catch (error) {
      console.error(error);
      toasts.error("Erro ao salvar cadastro. Tente novamente");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <PageHeader
        title="Novo Cadastro"
        subtitle="Preencha todos os campos obrigatórios"
        breadcrumbs={[
          { label: "Início", href: "/app/home", icon: Home },
          { label: "Novo Cadastro" },
        ]}
        sticky
        actions={
          <Button type="submit" form="register-form" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
              Salvar Cadastro
              </>
            )}
          </Button>
        }
      />

      <Form {...form}>
        <form
          id="register-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <PersonalDataSection control={form.control} />
          <Separator />
          <MediaSection control={form.control} />
          <Separator />
          <LocationLegalSection
            control={form.control}
            setValue={form.setValue}
          />
        </form>
      </Form>
    </div>
  );
}
