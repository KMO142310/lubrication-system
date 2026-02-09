'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User } from '@/types/user';

const createUserSchema = z.object({
  full_name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['supervisor', 'lubricator']),
  rut: z.string().optional(),
  phone: z.string().optional(),
});

const updateUserSchema = z.object({
  full_name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(['supervisor', 'lubricator']),
  rut: z.string().optional(),
  phone: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UserFormData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserFormData | UserFormData) => Promise<void>;
  user?: User | null;
}

export function UserForm({ open, onOpenChange, onSubmit, user }: UserFormProps) {
  const isEditing = !!user;
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: isEditing ? {
      full_name: '',
      role: 'lubricator',
      rut: '',
      phone: '',
    } : {
      full_name: '',
      email: '',
      password: '',
      role: 'lubricator',
      rut: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        role: user.role === 'admin' ? 'supervisor' : user.role,
        rut: user.rut || '',
        phone: user.phone || '',
      });
    } else {
      reset({
        full_name: '',
        email: '',
        password: '',
        role: 'lubricator',
        rut: '',
        phone: '',
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error en formulario:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Trabajador' : 'Nuevo Trabajador'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nombre Completo *</Label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="Juan Pérez González"
            />
            {errors.full_name && (
              <p className="text-sm text-alert-red">{errors.full_name.message}</p>
            )}
          </div>

          {!isEditing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="usuario@empresa.cl"
                />
                {errors.email && (
                  <p className="text-sm text-alert-red">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña Temporal *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <p className="text-sm text-alert-red">{errors.password.message}</p>
                )}
                <p className="text-xs text-fog">
                  El usuario deberá cambiar esta contraseña en su primer inicio de sesión
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="lubricator">Lubricador</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input
                id="rut"
                {...register('rut')}
                placeholder="12.345.678-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
