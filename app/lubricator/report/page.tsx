'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Droplets,
  Wrench,
  Volume2,
  Thermometer,
  PackageX,
  HelpCircle,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

const issueTypes = [
  { id: 'leak', label: 'Fuga', icon: Droplets },
  { id: 'damage', label: 'Daño', icon: Wrench },
  { id: 'noise', label: 'Ruido', icon: Volume2 },
  { id: 'hot', label: 'Caliente', icon: Thermometer },
  { id: 'no_lubricant', label: 'Sin lubricante', icon: PackageX },
  { id: 'other', label: 'Otro', icon: HelpCircle },
];

const severityOptions = [
  { id: 'low', label: 'Puede esperar', bgColor: 'rgba(236, 201, 75, 0.2)', borderColor: '#ECC94B' },
  { id: 'medium', label: 'Atender pronto', bgColor: 'rgba(212, 116, 14, 0.2)', borderColor: '#D4740E' },
  { id: 'high', label: 'Urgente', bgColor: 'rgba(229, 62, 62, 0.2)', borderColor: '#E53E3E' },
];

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('task_id');
  const pointId = searchParams.get('point_id');
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType || !selectedSeverity) {
      toast.error('Selecciona tipo y gravedad');
      return;
    }

    if (!taskId || !pointId) {
      toast.error('Error: datos de tarea faltantes');
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();

      let photoUrls: string[] = [];

      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `incidents/${userData?.company_id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, photo);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('photos')
            .getPublicUrl(filePath);
          photoUrls = [urlData.publicUrl];
        }
      }

      // Update task_execution
      await supabase
        .from('task_executions')
        .update({
          status: 'issue_reported',
          executed_at: new Date().toISOString(),
          executed_by: user.id,
          notes: description || null,
          photo_urls: photoUrls.length > 0 ? photoUrls : null,
        })
        .eq('id', taskId);

      // Insert incident
      await supabase
        .from('incidents')
        .insert([{
          company_id: userData?.company_id,
          lubrication_point_id: pointId,
          reported_by: user.id,
          type: selectedType,
          severity: selectedSeverity,
          description: description || null,
          photo_urls: photoUrls.length > 0 ? photoUrls : null,
          status: 'open',
        }]);

      toast.success('Problema reportado');

      // Obtener work_order_id para volver a la ejecución
      const { data: taskData } = await supabase
        .from('task_executions')
        .select('work_order_id')
        .eq('id', taskId)
        .single();

      if (taskData?.work_order_id) {
        router.push(`/lubricator/execute/${taskData.work_order_id}`);
      } else {
        router.push('/lubricator/dashboard');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al reportar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!taskId) {
      router.push('/lubricator/dashboard');
      return;
    }

    const { data: taskData } = await supabase
      .from('task_executions')
      .select('work_order_id')
      .eq('id', taskId)
      .single();

    if (taskData?.work_order_id) {
      router.push(`/lubricator/execute/${taskData.work_order_id}`);
    } else {
      router.push('/lubricator/dashboard');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tipo de problema */}
        <div className="space-y-3">
          <p className="font-bold text-white" style={{ fontSize: '24px' }}>
            Qué problema?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {issueTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="flex flex-col items-center justify-center gap-2 rounded-sm transition-colors"
                  style={{
                    backgroundColor: '#2D3748',
                    height: '80px',
                    border: isSelected ? '2px solid #D4740E' : '2px solid transparent',
                  }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: isSelected ? '#D4740E' : '#A0AEC0' }}
                  />
                  <span
                    className="font-bold"
                    style={{
                      color: isSelected ? '#D4740E' : '#A0AEC0',
                      fontSize: '14px',
                    }}
                  >
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gravedad */}
        {selectedType && (
          <div className="space-y-3">
            <p className="font-bold text-white" style={{ fontSize: '20px' }}>
              Qué tan grave?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {severityOptions.map((severity) => {
                const isSelected = selectedSeverity === severity.id;
                return (
                  <button
                    key={severity.id}
                    onClick={() => setSelectedSeverity(severity.id)}
                    className="flex items-center justify-center rounded-sm p-3 transition-colors"
                    style={{
                      backgroundColor: severity.bgColor,
                      border: isSelected
                        ? `3px solid ${severity.borderColor}`
                        : '3px solid transparent',
                      height: '56px',
                    }}
                  >
                    <span
                      className="font-bold text-center"
                      style={{
                        color: severity.borderColor,
                        fontSize: '13px',
                      }}
                    >
                      {severity.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Foto */}
        {selectedSeverity && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />

            {photoPreview ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Foto del problema"
                  className="w-full h-48 object-cover rounded-sm"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 font-bold text-white rounded-sm"
                  style={{ backgroundColor: '#2D3748', height: '56px', fontSize: '18px' }}
                >
                  <Camera className="w-5 h-5" />
                  CAMBIAR FOTO
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 font-bold text-white rounded-sm"
                style={{ backgroundColor: '#2D3748', height: '56px', fontSize: '18px' }}
              >
                <Camera className="w-6 h-6" />
                TOMAR FOTO
              </button>
            )}
          </div>
        )}

        {/* Descripción opcional */}
        {selectedSeverity && (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe algo si quieres (opcional)"
            rows={2}
            className="w-full p-3 rounded-sm resize-none"
            style={{
              backgroundColor: '#2D3748',
              color: '#fff',
              fontSize: '16px',
              border: '2px solid #2D3748',
            }}
          />
        )}
      </div>

      {/* Botones de acción */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!selectedType || !selectedSeverity || submitting}
          className="w-full font-bold text-white rounded-sm disabled:opacity-50"
          style={{
            backgroundColor: '#38A169',
            height: '56px',
            fontSize: '20px',
          }}
        >
          {submitting ? 'ENVIANDO...' : 'ENVIAR'}
        </button>

        <button
          onClick={handleCancel}
          className="w-full text-center"
          style={{ color: '#A0AEC0', fontSize: '18px', height: '56px' }}
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full p-6">
        <p style={{ color: '#A0AEC0', fontSize: '18px' }}>Cargando...</p>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
