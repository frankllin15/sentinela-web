import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Home, Search, Save } from "lucide-react";
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
import { usePersonWithMedia } from "@/hooks/queries/usePersonWithMedia";
import { useUpdatePerson } from "@/hooks/mutations/usePeopleMutations";
import { useBulkMediaOperations } from "@/hooks/mutations/useMediaMutations";
import { uploadService } from "@/services/upload.service";
import { cleanCPF } from "@/lib/cpf.utils";
import { MediaType } from "@/types/media.types";
import { UploadCategory } from "@/types/upload-category";
import { PageHeader } from "@/components/layout/PageHeader";

export function EditPersonPage() {
  const { id } = useParams<{ id: string }>();
  const personId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [mediasToDelete, setMediasToDelete] = useState<number[]>([]);

  // Fetch person and media data with TanStack Query
  const {
    person,
    media: existingMedias,
    isLoading,
    isError,
  } = usePersonWithMedia(personId);

  // Mutations
  const updatePersonMutation = useUpdatePerson(person?.id ?? 0);
  const mediaOperations = useBulkMediaOperations(person?.id ?? 0);

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

  // Initialize form with person data (stable dependencies)
  useEffect(() => {
    if (!person || !existingMedias) return;

    const existingTattooMedias = existingMedias.filter(
      (m) => m.type === MediaType.TATTOO
    );

    // Pre-fill form with person data
    form.reset({
      facePhoto: null,
      fullBodyPhoto: null,
      tattoos: existingTattooMedias.map((m) => ({
        photo: m.url,
        location: m.label || "",
        description: m.description || "",
      })),
      fullName: person.fullName,
      nickname: person.nickname || "",
      cpf: person.cpf || "",
      rg: person.rg || "",
      voterId: person.voterId || "",
      motherName: person.motherName || "",
      fatherName: person.fatherName || "",
      addressPrimary: person.addressPrimary || "",
      addressSecondary: person.addressSecondary || "",
      latitude: person.latitude,
      longitude: person.longitude,
      hasWarrant: !!person.warrantStatus,
      warrantStatus: person.warrantStatus || "",
      warrantFile: null,
      isConfidential: person.isConfidential,
      notes: person.notes || "",
    });
  }, [person, existingMedias, form]);

  const onSubmit = async (data: RegisterPersonFormData) => {
    if (!person || !existingMedias) return;

    try {
      setIsSaving(true);

      // Get existing media by type
      const existingFaceMedia = existingMedias.find(
        (m) => m.type === MediaType.FACE
      );
      const existingBodyMedia = existingMedias.find(
        (m) => m.type === MediaType.FULL_BODY
      );
      const existingTattoos = existingMedias.filter(
        (m) => m.type === MediaType.TATTOO
      );

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
        uploadPromises.push(
          uploadService.upload(data.facePhoto!, UploadCategory.FACE)
        );
      }

      if (needBodyUpload) {
        uploadPromises.push(
          uploadService.upload(data.fullBodyPhoto!, UploadCategory.FULL_BODY)
        );
      }

      uploadPromises.push(
        ...data.tattoos
          .filter((t) => t.photo instanceof File)
          .map((t) =>
            uploadService.upload(t.photo as File, UploadCategory.TATTOO)
          )
      );

      if (needWarrantUpload) {
        console.info("Uploading new warrant file...", data.warrantFile);
        uploadPromises.push(
          uploadService.upload(data.warrantFile!, UploadCategory.WARRANT)
        );
      }

      const uploadedUrls = await Promise.all(uploadPromises);

      // Extract URLs from uploaded files
      let urlIndex = 0;
      if (needFaceUpload) {
        faceUrl = uploadedUrls[urlIndex++];
        // Mark old face photo for deletion
        if (existingFaceMedia) {
          setMediasToDelete((prev) => [...prev, existingFaceMedia.id]);
        }
      }

      if (needBodyUpload) {
        bodyUrl = uploadedUrls[urlIndex++];
        // Mark old body photo for deletion
        if (existingBodyMedia) {
          setMediasToDelete((prev) => [...prev, existingBodyMedia.id]);
        }
      }

      const tattooUrls = uploadedUrls.slice(
        urlIndex,
        urlIndex + data.tattoos.length
      );
      urlIndex += data.tattoos.length;

      if (needWarrantUpload) {
        warrantUrl = uploadedUrls[urlIndex];
      }

      // 2. Update person record via mutation
      await updatePersonMutation.mutateAsync({
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

      // 3. Manage media changes via bulk operations
      const mediaToCreate = [];
      const mediaToDelete = [];

      // Create new face photo if uploaded
      if (needFaceUpload && faceUrl) {
        mediaToCreate.push({
          type: MediaType.FACE,
          url: faceUrl,
          personId: person.id,
        });
      }

      // Create new body photo if uploaded
      if (needBodyUpload && bodyUrl) {
        mediaToCreate.push({
          type: MediaType.FULL_BODY,
          url: bodyUrl,
          personId: person.id,
        });
      }

      // Delete old tattoos (we're replacing all tattoos with the new set)
      mediaToDelete.push(...existingTattoos.map((t) => t.id));

      // Create new tattoos
      mediaToCreate.push(
        ...data.tattoos.map((tattoo, index) => ({
          type: MediaType.TATTOO,
          url: tattooUrls[index],
          label: tattoo.location,
          description: tattoo.description || undefined,
          personId: person.id,
        }))
      );

      // Delete marked media
      mediaToDelete.push(...mediasToDelete);

      await mediaOperations.mutateAsync({
        create: mediaToCreate,
        delete: mediaToDelete,
      });

      // Navigation and toast handled by mutation's onSuccess
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar cadastro. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle error state
  if (isError) {
    toast.error("Erro ao carregar dados da pessoa");
    navigate("/app/home");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!person || !existingMedias) {
    return null;
  }

  const existingFaceMedia = existingMedias.find(
    (m) => m.type === MediaType.FACE
  );
  const existingBodyMedia = existingMedias.find(
    (m) => m.type === MediaType.FULL_BODY
  );

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <PageHeader
        title="Editar Cadastro"
        subtitle={person.fullName}
        breadcrumbs={[
          { label: "Início", href: "/app/home", icon: Home },
          { label: "Buscar", href: "/app/search", icon: Search },
          { label: person.fullName, href: `/app/people/${person.id}` },
          { label: "Editar" },
        ]}
        showBackButton
        sticky
        actions={
          <Button type="submit" form="edit-form" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
              <Save className="h-4 w-4" />
              Salvar
              </>
            )}
          </Button>
        }
      />

      <Form {...form}>
        <form
          id="edit-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <PersonalDataSection control={form.control} personId={person.id} />
          <Separator />
          <MediaSection
            control={form.control}
            existingFacePhoto={existingFaceMedia}
            existingBodyPhoto={existingBodyMedia}
          />
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
