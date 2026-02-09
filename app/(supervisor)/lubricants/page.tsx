'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useLubricantTypes } from '@/hooks/useLubricantTypes';
import { LubricantTypeForm } from '@/components/supervisor/LubricantTypeForm';
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
import type { LubricantType } from '@/types/lubricant-type';

const getCategoryBadge = (category: LubricantType['category']) => {
  if (!category) return <Badge variant="secondary">Sin categoría</Badge>;
  
  const categoryLabels = {
    grease: 'Grasa',
    oil: 'Aceite',
    spray: 'Spray',
    paste: 'Pasta',
    other: 'Otro',
  };

  const categoryColors = {
    grease: 'default',
    oil: 'secondary',
    spray: 'outline',
    paste: 'warning',
    other: 'secondary',
  } as const;

  return (
    <Badge variant={categoryColors[category]}>
      {categoryLabels[category]}
    </Badge>
  );
};

export default function LubricantsPage() {
  const { lubricantTypes, loading, error, createLubricantType, updateLubricantType, deleteLubricantType } = useLubricantTypes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLubricantType, setSelectedLubricantType] = useState<LubricantType | null>(null);

  const handleCreate = () => {
    setSelectedLubricantType(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lubricantType: LubricantType) => {
    setSelectedLubricantType(lubricantType);
    setIsFormOpen(true);
  };

  const handleDelete = async (lubricantType: LubricantType) => {
    if (!confirm(`¿Estás seguro de eliminar el lubricante "${lubricantType.name}"?`)) {
      return;
    }

    try {
      await deleteLubricantType(lubricantType.id);
      toast.success('Lubricante eliminado correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar lubricante');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      const lubricantTypeData = {
        name: data.name,
        category: data.category || null,
        viscosity: data.viscosity || null,
        application: data.application || null,
        storage_temp_min: data.storage_temp_min || null,
        storage_temp_max: data.storage_temp_max || null,
        safety_data_url: null,
      };

      if (selectedLubricantType) {
        await updateLubricantType(selectedLubricantType.id, lubricantTypeData);
        toast.success('Lubricante actualizado correctamente');
      } else {
        await createLubricantType(lubricantTypeData);
        toast.success('Lubricante creado correctamente');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar lubricante');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Cargando lubricantes...</p>
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
          <h1 className="text-3xl font-bold text-white">Lubricantes</h1>
          <p className="text-fog mt-1">
            Gestiona el catálogo de lubricantes de tu planta
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Lubricante
        </Button>
      </div>

      {lubricantTypes.length === 0 ? (
        <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-12 text-center">
          <p className="text-fog text-lg mb-4">No hay lubricantes registrados</p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Crear primer lubricante
          </Button>
        </div>
      ) : (
        <div className="rounded-sm border border-slate-panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Viscosidad</TableHead>
                <TableHead>Aplicación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lubricantTypes.map((lubricantType, index) => (
                <TableRow
                  key={lubricantType.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(45, 55, 72, 0.3)' : 'transparent',
                  }}
                >
                  <TableCell className="font-medium text-white">
                    {lubricantType.name}
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(lubricantType.category)}
                  </TableCell>
                  <TableCell className="text-fog font-mono">
                    {lubricantType.viscosity || '—'}
                  </TableCell>
                  <TableCell className="text-fog max-w-md truncate">
                    {lubricantType.application || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(lubricantType)}
                        className="hover:bg-machinery/10 hover:text-machinery"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(lubricantType)}
                        className="hover:bg-alert-red/10 hover:text-alert-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <LubricantTypeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        lubricantType={selectedLubricantType}
      />
    </div>
  );
}
