import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Plus, Home, Shield, Trash2, Ban, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { UserFormDialog } from '@/components/admin/UserFormDialog';
import { Pagination } from '@/components/search/Pagination';
import { useUserList } from '@/hooks/queries/useUserQueries';
import { useForceList } from '@/hooks/queries/useForceQueries';
import { useDeleteUser, useToggleUserStatus } from '@/hooks/mutations/useUserMutations';
import { UserRole } from '@/types/auth.types';
import type { UserSearchFilters } from '@/types/user.types';

const DEFAULT_LIMIT = 20;

const roleLabels = {
  [UserRole.ADMIN_GERAL]: 'Administrador Geral',
  [UserRole.PONTO_FOCAL]: 'Ponto Focal',
  [UserRole.GESTOR]: 'Gestor',
  [UserRole.USUARIO]: 'Usuário',
};

type ConfirmAction = {
  type: 'toggle' | 'delete';
  userId: number;
  userName: string;
  currentStatus?: boolean;
} | null;

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  // Read from URL params
  const page = Number(searchParams.get("page")) || 1;
  const forceId = searchParams.get("forceId");
  const isActiveParam = searchParams.get("isActive");

  // Build filters
  const filters: UserSearchFilters = {
    page,
    limit: DEFAULT_LIMIT,
    ...(forceId && { forceId: Number(forceId) }),
    ...(isActiveParam && { isActive: isActiveParam === 'true' }),
  };

  // Query with filters
  const { data, isLoading, error, refetch } = useUserList(filters);
  const { data: forces } = useForceList();
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  const users = data?.data || [];
  const totalItems = data?.total || 0;

  const handleForceFilter = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete('forceId');
    } else {
      newParams.set('forceId', value);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
    setTimeout(() => refetch(), 0);
  };

  const handleStatusFilter = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete('isActive');
    } else {
      newParams.set('isActive', value);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
    setTimeout(() => refetch(), 0);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'toggle' && confirmAction.currentStatus !== undefined) {
      toggleStatusMutation.mutate({
        userId: confirmAction.userId,
        isActive: !confirmAction.currentStatus
      });
    } else if (confirmAction.type === 'delete') {
      deleteUserMutation.mutate(confirmAction.userId);
    }

    setConfirmAction(null);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto pb-8">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="text-lg text-destructive mb-4">
            Erro ao carregar usuários. Por favor, tente novamente.
          </p>
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <PageHeader
        title="Gestão de Usuários"
        subtitle="Gerencie os usuários e permissões do sistema"
        icon={Users}
        breadcrumbs={[
          { label: 'Início', href: '/app/home', icon: Home },
          { label: 'Admin', icon: Shield },
          { label: 'Usuários' },
        ]}
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        }
      />

      {/* Filters Bar */}
      <div className="flex gap-4 mb-4">
        <div className="w-48">
          <Select value={forceId || 'all'} onValueChange={handleForceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as Forças" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Forças</SelectItem>
              {forces?.map((force) => (
                <SelectItem key={force.id} value={force.id.toString()}>
                  {force.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={isActiveParam || 'all'} onValueChange={handleStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Ativos</SelectItem>
              <SelectItem value="false">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Força Policial</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{roleLabels[user.role]}</Badge>
                    </TableCell>
                    <TableCell>{user.forceName || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmAction({
                            type: 'toggle',
                            userId: user.id,
                            userName: user.name || user.email,
                            currentStatus: user.isActive,
                          })}
                          disabled={toggleStatusMutation.isPending}
                          title={user.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {user.isActive ? (
                            <Ban className="h-4 w-4 text-orange-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmAction({
                            type: 'delete',
                            userId: user.id,
                            userName: user.name || user.email,
                          })}
                          disabled={deleteUserMutation.isPending}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={DEFAULT_LIMIT}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <UserFormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      {/* Confirmation Dialogs */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === 'toggle'
                ? `${confirmAction.currentStatus ? 'Desativar' : 'Ativar'} Usuário`
                : 'Excluir Usuário'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'toggle' ? (
                <>
                  Deseja {confirmAction.currentStatus ? 'desativar' : 'ativar'} o usuário{' '}
                  <span className="font-semibold">{confirmAction.userName}</span>?
                  {confirmAction.currentStatus && (
                    <span className="block mt-2 text-orange-600">
                      Um usuário desativado não poderá fazer login no sistema.
                    </span>
                  )}
                </>
              ) : (
                <>
                  Tem certeza que deseja excluir o usuário{' '}
                  <span className="font-semibold">{confirmAction?.userName}</span>?
                  <span className="block mt-2 text-destructive font-medium">
                    Esta ação não pode ser desfeita.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={confirmAction?.type === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {confirmAction?.type === 'toggle'
                ? (confirmAction.currentStatus ? 'Desativar' : 'Ativar')
                : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
