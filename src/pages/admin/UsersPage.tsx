import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Plus, Home, Shield, Ban, CheckCircle, Loader2, MoreVertical, Filter, Pencil } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { UserFilterSheet } from '@/components/admin/UserFilterSheet';
import { Pagination } from '@/components/search/Pagination';
import { useUserList } from '@/hooks/queries/useUserQueries';
import { useDeleteUser, useToggleUserStatus } from '@/hooks/mutations/useUserMutations';
import { UserRole } from '@/types/auth.types';
import type { UserSearchFilters } from '@/types/user.types';
import type { UserFilterFormValues } from '@/components/admin/UserFilters';
import { ErrorAlert } from '@/components/ui/error-alert';

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
  const [editingUserId, setEditingUserId] = useState<number | undefined>(undefined);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  // Read from URL params
  const page = Number(searchParams.get("page")) || 1;
  const filterValues: UserFilterFormValues = {
    forceId: searchParams.get("forceId") || '',
    isActive: searchParams.get("isActive") || '',
  };

  // Build filters for query
  const filters: UserSearchFilters = {
    page,
    limit: DEFAULT_LIMIT,
    ...(filterValues.forceId && { forceId: Number(filterValues.forceId) }),
    ...(filterValues.isActive && { isActive: filterValues.isActive === 'true' }),
  };

  // Query with filters
  const { data, isLoading, error, refetch } = useUserList(filters);
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  const users = data?.data || [];
  const totalItems = data?.total || 0;

  // Count active filters
  const activeFilterCount = Object.values(filterValues).filter(
    (value) => value && value.trim() !== ""
  ).length;

  const handleApplyFilters = (filters: UserFilterFormValues) => {
    const newParams = new URLSearchParams();

    // Add filters to URL (only non-empty values)
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        newParams.set(key, value);
      }
    });

    // Reset to page 1
    newParams.set("page", "1");

    setSearchParams(newParams);

    // Force refetch
    setTimeout(() => refetch(), 0);
  };

  const handleClearFilters = () => {
    setSearchParams({ page: "1" });
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
      <div className="max-w-7xl mx-auto p-4">
        <ErrorAlert
          error={error}
          title="Erro ao carregar usuários"
          onRetry={() => refetch()}
        />
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFilterSheetOpen(true)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        }
      />

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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={toggleStatusMutation.isPending || deleteUserMutation.isPending}
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingUserId(user.id)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setConfirmAction({
                              type: 'toggle',
                              userId: user.id,
                              userName: user.name || user.email,
                              currentStatus: user.isActive,
                            })}
                          >
                            {user.isActive ? (
                              <>
                                <Ban className="h-4 w-4 text-warning" />
                                <span>Desativar</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-success" />
                                <span>Ativar</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {/* <DropdownMenuItem
                            onClick={() => setConfirmAction({
                              type: 'delete',
                              userId: user.id,
                              userName: user.name || user.email,
                            })}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      
      <UserFormDialog
        open={!!editingUserId}
        onOpenChange={(open) => !open && setEditingUserId(undefined)}
        userId={editingUserId}
      />

      <UserFilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialValues={filterValues}
      />

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
                    <span className="block mt-2 text-warning">
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
