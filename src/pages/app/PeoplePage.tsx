import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, User, Image, MapPin, Home, Search, Shield, AlertTriangle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { PersonDataTab } from "@/components/people/PersonDataTab";
import { PersonGalleryTab } from "@/components/people/PersonGalleryTab";
import { PersonMapTab } from "@/components/people/PersonMapTab";
import { AuditInfo } from "@/components/people/AuditInfo";
import { usePersonWithMedia } from "@/hooks/queries/usePersonWithMedia";

type TabType = "dados" | "galeria" | "mapa";

export function PeoplePage() {
  const { id } = useParams<{ id: string }>();
  const personId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dados");

  // Fetch person and media data with TanStack Query
  const {
    person,
    media: medias,
    isLoading: loading,
    isError,
  } = usePersonWithMedia(personId);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (isError || !person || !medias) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Pessoa não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A pessoa solicitada não foi encontrada.
          </p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <PageHeader
        title={person.fullName}
        subtitle={person.nickname ? `Vulgo: ${person.nickname}` : undefined}
        breadcrumbs={[
          { label: "Início", href: "/app/home", icon: Home },
          { label: "Buscar", href: "/app/search", icon: Search },
          { label: person.fullName },
        ]}
        showBackButton
        backButtonText="Voltar"
        sticky
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/app/people/${person.id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        }
      >
        {/* Badges de status */}
        {(person.isConfidential || person.warrantStatus) && (
          <div className="flex gap-2 mt-3">
            {person.isConfidential && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Sigiloso
              </Badge>
            )}
            {person.warrantStatus && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Mandado de Prisão
              </Badge>
            )}
          </div>
        )}
      </PageHeader>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        <Button
          variant={activeTab === "dados" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("dados")}
          className="gap-2"
        >
          <User className="h-4 w-4" />
          Dados
        </Button>
        <Button
          variant={activeTab === "galeria" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("galeria")}
          className="gap-2"
        >
          <Image className="h-4 w-4" />
          Galeria
        </Button>
        <Button
          variant={activeTab === "mapa" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("mapa")}
          className="gap-2"
        >
          <MapPin className="h-4 w-4" />
          Mapa
        </Button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "dados" && (
          <PersonDataTab
            person={person}
            onViewMap={() => setActiveTab("mapa")}
          />
        )}
        {activeTab === "galeria" && <PersonGalleryTab medias={medias} />}
        {activeTab === "mapa" && <PersonMapTab person={person} />}
      </div>

      {/* Auditoria */}
      <AuditInfo person={person} />
    </div>
  );
}
