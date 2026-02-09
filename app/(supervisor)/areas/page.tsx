'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAreas } from '@/hooks/useAreas';
import { AreaForm } from '@/components/supervisor/AreaForm';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Area } from '@/types/area';

export default function AreasPage() {
  const { areas, loading, error, createArea, updateArea, deleteArea } = useAreas();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const handleCreate = () => {
    setSelectedArea(null);
    setIsFormOpen(true);
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsFormOpen(true);
  };

  const handleDelete = async (area: Area) => {
    if (!confirm(`¿Estás seguro de eliminar el área "${area.name}"?`)) {
      return;
    }

    try {
      await deleteArea(area.id);
      toast.success('Área eliminada correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar área');
    }
  };

  const handleSubmit = async (data: { name: string; description?: string; order_index: number }) => {
    try {
      const areaData = {
        name: data.name,
        description: data.description || null,
        order_index: data.order_index,
      };

      if (selectedArea) {
        await updateArea(selectedArea.id, areaData);
        toast.success('Área actualizada correctamente');
      } else {
        await createArea(areaData);
        toast.success('Área creada correctamente');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar área');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Cargando áreas...</p>
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
          <h1 className="text-3xl font-bold text-white">Áreas de la Planta</h1>
          <p className="text-fog mt-1">
            Gestiona las zonas físicas de tu planta industrial
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          Nueva Área
        </Button>
      </div>

      {areas.length === 0 ? (
        <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-12 text-center">
          <p className="text-fog text-lg mb-4">No hay áreas registradas</p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Crear primera área
          </Button>
        </div>
      ) : (
        <div className="rounded-sm border border-slate-panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map((area, index) => (
                <TableRow
                  key={area.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(45, 55, 72, 0.3)' : 'transparent',
                  }}
                >
                  <TableCell className="font-mono text-white">
                    {area.order_index}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {area.name}
                  </TableCell>
                  <TableCell className="text-fog">
                    {area.description || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(area)}
                        className="hover:bg-machinery/10 hover:text-machinery"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(area)}
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

      <AreaForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        area={selectedArea}
      />
    </div>
  );
}
