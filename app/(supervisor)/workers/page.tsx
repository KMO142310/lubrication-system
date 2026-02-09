'use client';

import { useState } from 'react';
import { Pencil, UserX, UserCheck, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '@/hooks/useUsers';
import { UserForm } from '@/components/supervisor/UserForm';
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
import type { User } from '@/types/user';

const getRoleBadge = (role: User['role']) => {
  const roleLabels = {
    admin: 'Admin',
    supervisor: 'Supervisor',
    lubricator: 'Lubricador',
  };

  const roleColors = {
    admin: 'destructive',
    supervisor: 'default',
    lubricator: 'warning',
  } as const;

  return (
    <Badge variant={roleColors[role]}>
      {roleLabels[role]}
    </Badge>
  );
};

export default function WorkersPage() {
  const { users, loading, error, createUser, updateUser, deactivateUser, activateUser } = useUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeactivate = async (user: User) => {
    if (!confirm(`¿Estás seguro de desactivar a ${user.full_name}?`)) {
      return;
    }

    try {
      await deactivateUser(user.id);
      toast.success('Usuario desactivado correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al desactivar usuario');
    }
  };

  const handleActivate = async (user: User) => {
    try {
      await activateUser(user.id);
      toast.success('Usuario activado correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al activar usuario');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      if (selectedUser) {
        const updateData = {
          full_name: data.full_name,
          role: data.role,
          rut: data.rut || null,
          phone: data.phone || null,
        };
        await updateUser(selectedUser.id, updateData);
        toast.success('Trabajador actualizado correctamente');
      } else {
        await createUser({
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          role: data.role,
          rut: data.rut,
          phone: data.phone,
        });
        toast.success('Trabajador creado correctamente');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar trabajador');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Cargando personal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-alert-red">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Personal</h1>
          <p className="text-fog mt-1">
            Gestiona los usuarios y trabajadores de tu planta
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Trabajador
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-12 text-center">
          <p className="text-fog text-lg mb-4">No hay trabajadores registrados</p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Crear primer trabajador
          </Button>
        </div>
      ) : (
        <div className="rounded-sm border border-slate-panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>RUT</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(45, 55, 72, 0.3)' : 'transparent',
                  }}
                >
                  <TableCell className="font-medium text-white">
                    {user.full_name}
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className="text-fog font-mono">
                    {user.rut || '—'}
                  </TableCell>
                  <TableCell className="text-fog">
                    {user.phone || '—'}
                  </TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="destructive">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        className="hover:bg-machinery/10 hover:text-machinery"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {user.is_active ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeactivate(user)}
                          className="hover:bg-alert-red/10 hover:text-alert-red"
                          title="Desactivar"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleActivate(user)}
                          className="hover:bg-operational/10 hover:text-operational"
                          title="Activar"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        user={selectedUser}
      />
    </div>
  );
}
