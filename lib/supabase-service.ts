import { supabase } from './supabase';

// ============================================================
// SUPABASE DATA SERVICE
// Reemplaza localStorage con base de datos real
// ============================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'desarrollador' | 'supervisor' | 'lubricador';
  avatar_url?: string;
  created_at: string;
}

export interface Plant {
  id: string;
  name: string;
  created_at: string;
}

export interface Area {
  id: string;
  plant_id: string;
  name: string;
  created_at: string;
}

export interface Machine {
  id: string;
  area_id: string;
  name: string;
  created_at: string;
}

export interface Component {
  id: string;
  machine_id: string;
  name: string;
  created_at: string;
}

export interface Lubricant {
  id: string;
  name: string;
  type: 'aceite' | 'grasa';
  unit: string;
  stock: number;
  created_at: string;
}

export interface Frequency {
  id: string;
  name: string;
  days: number;
  created_at: string;
}

export interface LubricationPoint {
  id: string;
  component_id: string;
  lubricant_id: string;
  frequency_id: string;
  code: string;
  description: string;
  method: string;
  quantity: number;
  created_at: string;
}

export interface Task {
  id: string;
  lubrication_point_id: string;
  scheduled_date: string;
  status: 'pendiente' | 'completado' | 'omitido';
  quantity_used?: number;
  photo_url?: string;
  observations?: string;
  completed_at?: string;
  completed_by?: string;
  created_at: string;
  // Joined data
  lubrication_point?: LubricationPoint;
  component?: Component;
  machine?: Machine;
  area?: Area;
  lubricant?: Lubricant;
  frequency?: Frequency;
}

export interface Anomaly {
  id: string;
  task_id?: string;
  lubrication_point_id?: string;
  reported_by: string;
  description: string;
  severity: 'baja' | 'media' | 'alta' | 'critica';
  status: 'abierta' | 'en_revision' | 'resuelta';
  photo_url?: string;
  resolution?: string;
  resolved_at?: string;
  created_at: string;
}

// ============================================================
// PROFILES
// ============================================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }
  return true;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name');
  
  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return data || [];
}

// ============================================================
// HIERARCHY: Plants > Areas > Machines > Components
// ============================================================

export async function getPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
  return data || [];
}

export async function getAreas(plantId?: string): Promise<Area[]> {
  let query = supabase.from('areas').select('*').order('name');
  if (plantId) query = query.eq('plant_id', plantId);
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
  return data || [];
}

export async function getMachines(areaId?: string): Promise<Machine[]> {
  let query = supabase.from('machines').select('*').order('name');
  if (areaId) query = query.eq('area_id', areaId);
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching machines:', error);
    return [];
  }
  return data || [];
}

export async function getComponents(machineId?: string): Promise<Component[]> {
  let query = supabase.from('components').select('*').order('name');
  if (machineId) query = query.eq('machine_id', machineId);
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching components:', error);
    return [];
  }
  return data || [];
}

// ============================================================
// LUBRICANTS & FREQUENCIES
// ============================================================

export async function getLubricants(): Promise<Lubricant[]> {
  const { data, error } = await supabase
    .from('lubricants')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching lubricants:', error);
    return [];
  }
  return data || [];
}

export async function getFrequencies(): Promise<Frequency[]> {
  const { data, error } = await supabase
    .from('frequencies')
    .select('*')
    .order('days');
  
  if (error) {
    console.error('Error fetching frequencies:', error);
    return [];
  }
  return data || [];
}

export async function updateLubricantStock(lubricantId: string, quantity: number): Promise<boolean> {
  const { error } = await supabase.rpc('decrement_stock', {
    lubricant_id: lubricantId,
    amount: quantity
  });
  
  if (error) {
    // Si la función RPC no existe, hacemos update directo
    const { data: current } = await supabase
      .from('lubricants')
      .select('stock')
      .eq('id', lubricantId)
      .single();
    
    if (current) {
      const { error: updateError } = await supabase
        .from('lubricants')
        .update({ stock: Math.max(0, current.stock - quantity) })
        .eq('id', lubricantId);
      
      return !updateError;
    }
    return false;
  }
  return true;
}

// ============================================================
// LUBRICATION POINTS
// ============================================================

export async function getLubricationPoints(): Promise<LubricationPoint[]> {
  const { data, error } = await supabase
    .from('lubrication_points')
    .select('*')
    .order('code');
  
  if (error) {
    console.error('Error fetching lubrication points:', error);
    return [];
  }
  return data || [];
}

// ============================================================
// TASKS
// ============================================================

export async function getTasks(date?: string): Promise<Task[]> {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      lubrication_point:lubrication_points(
        *,
        component:components(
          *,
          machine:machines(
            *,
            area:areas(*)
          )
        ),
        lubricant:lubricants(*),
        frequency:frequencies(*)
      )
    `)
    .order('created_at', { ascending: false });
  
  if (date) {
    query = query.eq('scheduled_date', date);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  return data || [];
}

export async function getTasksForToday(): Promise<Task[]> {
  const today = new Date().toISOString().split('T')[0];
  return getTasks(today);
}

export async function getTasksForWeek(): Promise<Task[]> {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      lubrication_point:lubrication_points(
        *,
        component:components(
          *,
          machine:machines(
            *,
            area:areas(*)
          )
        ),
        lubricant:lubricants(*),
        frequency:frequencies(*)
      )
    `)
    .gte('scheduled_date', startOfWeek.toISOString().split('T')[0])
    .lte('scheduled_date', endOfWeek.toISOString().split('T')[0])
    .order('scheduled_date');
  
  if (error) {
    console.error('Error fetching weekly tasks:', error);
    return [];
  }
  return data || [];
}

export async function completeTask(
  taskId: string,
  userId: string,
  data: {
    quantity_used?: number;
    photo_url?: string;
    observations?: string;
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'completado',
      quantity_used: data.quantity_used,
      photo_url: data.photo_url,
      observations: data.observations,
      completed_at: new Date().toISOString(),
      completed_by: userId
    })
    .eq('id', taskId);
  
  if (error) {
    console.error('Error completing task:', error);
    return false;
  }
  return true;
}

export async function skipTask(taskId: string, reason: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'omitido',
      observations: reason
    })
    .eq('id', taskId);
  
  if (error) {
    console.error('Error skipping task:', error);
    return false;
  }
  return true;
}

export async function createTasksForDate(date: string): Promise<boolean> {
  // Obtener puntos de lubricación con sus frecuencias
  const { data: points, error: pointsError } = await supabase
    .from('lubrication_points')
    .select('*, frequency:frequencies(*)');
  
  if (pointsError || !points) {
    console.error('Error fetching points:', pointsError);
    return false;
  }
  
  const taskDate = new Date(date);
  const dayOfWeek = taskDate.getDay();
  const dayOfMonth = taskDate.getDate();
  
  const tasksToCreate = points.filter(point => {
    const freq = point.frequency;
    if (!freq) return false;
    
    // Lógica de frecuencias
    if (freq.days === 1) return true; // Diario
    if (freq.days === 2 && dayOfWeek % 2 === 0) return true; // Cada 2 días
    if (freq.days === 7 && dayOfWeek === 1) return true; // Semanal (lunes)
    if (freq.days === 14 && dayOfMonth <= 7 && dayOfWeek === 1) return true; // Quincenal
    if (freq.days === 30 && dayOfMonth === 1) return true; // Mensual
    if (freq.days === 90 && dayOfMonth === 1 && [0, 3, 6, 9].includes(taskDate.getMonth())) return true; // Trimestral
    
    return false;
  }).map(point => ({
    lubrication_point_id: point.id,
    scheduled_date: date,
    status: 'pendiente'
  }));
  
  if (tasksToCreate.length === 0) return true;
  
  const { error } = await supabase
    .from('tasks')
    .upsert(tasksToCreate, { 
      onConflict: 'lubrication_point_id,scheduled_date',
      ignoreDuplicates: true 
    });
  
  if (error) {
    console.error('Error creating tasks:', error);
    return false;
  }
  
  return true;
}

// ============================================================
// ANOMALIES
// ============================================================

export async function getAnomalies(status?: string): Promise<Anomaly[]> {
  let query = supabase
    .from('anomalies')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching anomalies:', error);
    return [];
  }
  return data || [];
}

export async function createAnomaly(anomaly: Omit<Anomaly, 'id' | 'created_at'>): Promise<string | null> {
  const { data, error } = await supabase
    .from('anomalies')
    .insert(anomaly)
    .select('id')
    .single();
  
  if (error) {
    console.error('Error creating anomaly:', error);
    return null;
  }
  return data?.id || null;
}

export async function resolveAnomaly(anomalyId: string, resolution: string): Promise<boolean> {
  const { error } = await supabase
    .from('anomalies')
    .update({
      status: 'resuelta',
      resolution,
      resolved_at: new Date().toISOString()
    })
    .eq('id', anomalyId);
  
  if (error) {
    console.error('Error resolving anomaly:', error);
    return false;
  }
  return true;
}

// ============================================================
// PHOTO UPLOAD
// ============================================================

export async function uploadPhoto(file: File, folder: string = 'tasks'): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('photos')
    .upload(fileName, file);
  
  if (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
  
  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);
  
  return data?.publicUrl || null;
}

// ============================================================
// STATISTICS
// ============================================================

export async function getStats() {
  const today = new Date().toISOString().split('T')[0];
  
  const [
    { count: totalTasks },
    { count: completedTasks },
    { count: pendingTasks },
    { count: openAnomalies }
  ] = await Promise.all([
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('scheduled_date', today),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('scheduled_date', today).eq('status', 'completado'),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('scheduled_date', today).eq('status', 'pendiente'),
    supabase.from('anomalies').select('*', { count: 'exact', head: true }).eq('status', 'abierta')
  ]);
  
  const compliance = totalTasks && totalTasks > 0 
    ? Math.round(((completedTasks || 0) / totalTasks) * 100) 
    : 0;
  
  return {
    totalTasks: totalTasks || 0,
    completedTasks: completedTasks || 0,
    pendingTasks: pendingTasks || 0,
    openAnomalies: openAnomalies || 0,
    compliance
  };
}

// ============================================================
// INITIALIZATION CHECK
// ============================================================

export async function checkConnection(): Promise<boolean> {
  const { error } = await supabase.from('frequencies').select('id').limit(1);
  return !error;
}
