'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, List } from 'lucide-react';
import { toast } from 'sonner';
import { useRoutes } from '@/hooks/useRoutes';
import { RouteForm } from '@/components/supervisor/RouteForm';
import { RoutePointsManager } from '@/components/supervisor/RoutePointsManager';
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
import type { Route } from '@/types/route';

export default function RoutesPage() {
  const { routes, loading, error, createRoute, updateRoute, deleteRoute, fetchRoutes } = useRoutes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [managePointsRouteId, setManagePointsRouteId] = useState<string | null>(null);

  const handleCreate = () => {
    setSelectedRoute(null);
    setIsFormOpen(true);
  };

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setIsFormOpen(true);
  };

  const handleDelete = async (route: Route) => {
    if (!confirm(`¿Estás seguro de eliminar la ruta "${route.name}"?`)) {
      return;
    }

    try {
      await deleteRoute(route.id);
      toast.success('Ruta eliminada correctamente');
      if (managePointsRouteId === route.id) {
        setManagePointsRouteId(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar ruta');
    }
  };

  const handleManagePoints = (route: Route) => {
    setManagePointsRouteId(managePointsRouteId === route.id ? null : route.id);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      const routeData = {
        name: data.name,
        description: data.description || null,
        estimated_duration_min: data.estimated_duration_min || null,
        is_active: data.is_active,
      };

      if (selectedRoute) {
        await updateRoute(selectedRoute.id, routeData);
        toast.success('Ruta actualizada correctamente');
      } else {
        await createRoute(routeData);
        toast.success('Ruta creada correctamente');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar ruta');
      throw err;
    }
  };

  const handlePointsChange = () => {
    fetchRoutes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Cargando rutas...</p>
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
          <h1 className="text-3xl font-bold text-white">Rutas de Lubricación</h1>
          <p className="text-fog mt-1">
            Gestiona las rutas y secuencias de lubricación
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          Nueva Ruta
        </Button>
      </div>

      {routes.length === 0 ? (
        <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-12 text-center">
          <p className="text-fog text-lg mb-4">No hay rutas registradas</p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Crear primera ruta
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-sm border border-slate-panel overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Puntos</TableHead>
                  <TableHead>Duración Est.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route, index) => (
                  <>
                    <TableRow
                      key={route.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'rgba(45, 55, 72, 0.3)' : 'transparent',
                      }}
                    >
                      <TableCell className="font-medium text-white">
                        {route.name}
                      </TableCell>
                      <TableCell className="text-fog max-w-md truncate">
                        {route.description || '—'}
                      </TableCell>
                      <TableCell className="text-white font-mono">
                        {route.points_count || 0}
                      </TableCell>
                      <TableCell className="text-fog">
                        {route.estimated_duration_min ? `${route.estimated_duration_min} min` : '—'}
                      </TableCell>
                      <TableCell>
                        {route.is_active ? (
                          <Badge variant="success">Activa</Badge>
                        ) : (
                          <Badge variant="secondary">Inactiva</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleManagePoints(route)}
                            className="hover:bg-machinery/10 hover:text-machinery"
                            title="Ver puntos"
                          >
                            <List className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(route)}
                            className="hover:bg-machinery/10 hover:text-machinery"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(route)}
                            className="hover:bg-alert-red/10 hover:text-alert-red"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {managePointsRouteId === route.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-carbon p-6">
                          <div className="space-y-3">
                            <h3 className="text-lg font-bold text-white">
                              Puntos de la Ruta: {route.name}
                            </h3>
                            <RoutePointsManager
                              routeId={route.id}
                              onPointsChange={handlePointsChange}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <RouteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        route={selectedRoute}
      />
    </div>
  );
}
