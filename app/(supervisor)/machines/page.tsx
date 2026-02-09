'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useMachines } from '@/hooks/useMachines';
import { MachineForm } from '@/components/supervisor/MachineForm';
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
import type { Machine } from '@/types/machine';

const getStatusBadge = (status: Machine['status']) => {
  if (!status) return <Badge variant="secondary">Sin estado</Badge>;
  
  switch (status) {
    case 'operational':
      return <Badge variant="success">Operativa</Badge>;
    case 'maintenance':
      return <Badge variant="warning">En mantención</Badge>;
    case 'stopped':
      return <Badge variant="destructive">Detenida</Badge>;
    default:
      return <Badge variant="secondary">—</Badge>;
  }
};

const getCriticalityBadge = (criticality: Machine['criticality']) => {
  if (!criticality) return <Badge variant="secondary">Sin criticidad</Badge>;
  
  switch (criticality) {
    case 'critical':
      return <Badge variant="destructive">Crítica</Badge>;
    case 'important':
      return <Badge variant="default">Importante</Badge>;
    case 'standard':
      return <Badge variant="secondary">Estándar</Badge>;
    default:
      return <Badge variant="secondary">—</Badge>;
  }
};

export default function MachinesPage() {
  const { machines, loading, error, createMachine, updateMachine, deleteMachine } = useMachines();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const handleCreate = () => {
    setSelectedMachine(null);
    setIsFormOpen(true);
  };

  const handleEdit = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsFormOpen(true);
  };

  const handleDelete = async (machine: Machine) => {
    if (!confirm(`¿Estás seguro de eliminar la máquina "${machine.name}"?`)) {
      return;
    }

    try {
      await deleteMachine(machine.id);
      toast.success('Máquina eliminada correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar máquina');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      const machineData = {
        name: data.name,
        code: data.code,
        brand: data.brand || null,
        model: data.model || null,
        year: data.year || null,
        area_id: data.area_id || null,
        status: data.status || null,
        criticality: data.criticality || null,
        image_url: null,
        specs: null,
      };

      if (selectedMachine) {
        await updateMachine(selectedMachine.id, machineData);
        toast.success('Máquina actualizada correctamente');
      } else {
        await createMachine(machineData);
        toast.success('Máquina creada correctamente');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar máquina');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Cargando máquinas...</p>
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
          <h1 className="text-3xl font-bold text-white">Máquinas</h1>
          <p className="text-fog mt-1">
            Gestiona el inventario de maquinaria de tu planta
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          Nueva Máquina
        </Button>
      </div>

      {machines.length === 0 ? (
        <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-12 text-center">
          <p className="text-fog text-lg mb-4">No hay máquinas registradas</p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Crear primera máquina
          </Button>
        </div>
      ) : (
        <div className="rounded-sm border border-slate-panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criticidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((machine, index) => (
                <TableRow
                  key={machine.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(45, 55, 72, 0.3)' : 'transparent',
                  }}
                >
                  <TableCell className="font-mono text-white font-medium">
                    {machine.code}
                  </TableCell>
                  <TableCell className="text-white">
                    <div>
                      <p className="font-medium">{machine.name}</p>
                      {(machine.brand || machine.model) && (
                        <p className="text-sm text-fog">
                          {[machine.brand, machine.model].filter(Boolean).join(' - ')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-fog">
                    {machine.area_name || '—'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(machine.status)}
                  </TableCell>
                  <TableCell>
                    {getCriticalityBadge(machine.criticality)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(machine)}
                        className="hover:bg-machinery/10 hover:text-machinery"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(machine)}
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

      <MachineForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        machine={selectedMachine}
      />
    </div>
  );
}
