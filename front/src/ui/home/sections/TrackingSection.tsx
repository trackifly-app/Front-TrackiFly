'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';

import { useFeedback } from '@/context/feedback/useFeedback';
import { getOrderByTrackingCode } from '@/services/tracking.service';
import deliveryTruck from '@/assets/lottie/Truck.json';

const TrackingSection = () => {
  const router = useRouter();

  const [trackingId, setTrackingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showToast, showHttpError } = useFeedback();

  const handleSearch = async () => {
    const cleanTrackingId = trackingId.trim();

    if (!cleanTrackingId) {
      showToast('Ingresa un número de seguimiento', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      await getOrderByTrackingCode(cleanTrackingId);

      showToast('Envío encontrado', 'success');

      router.push(`/tracking/${encodeURIComponent(cleanTrackingId)}`);
    } catch (error) {
      showHttpError(error, 'No se encontró el envío');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="flex h-full items-start">
      <div className="flex w-full max-w-xl flex-col justify-start">
        <h1 className="mb-4 text-5xl font-medium leading-tight text-gray-900">Seguí tu envío ahora</h1>

        <p className="mb-8 max-w-md text-lg leading-relaxed text-gray-500">Conocé el estado de tus envíos en todo momento.</p>

        <div className="mb-3 flex max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white">
          <input type="text" placeholder="Ingresá el número de seguimiento" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none" />

          <button type="button" onClick={handleSearch} disabled={isLoading} className="bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70">
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        <div className="flex items-center">
          <Lottie animationData={deliveryTruck} loop autoplay className="h-64 w-64 scale-120" />

          {isLoading && <span className="text-sm font-medium text-primary">Buscando envío...</span>}
        </div>

        <p className="mb-6 text-xs text-gray-400">Sin guiones ni puntos. Ej. VLZ-2026-R0NYG9</p>

        <div className="flex max-w-md flex-wrap gap-5">
          {['Seguimiento en tiempo real', 'Seguro incluido', 'Soporte 24/7'].map((t) => (
            <span key={t} className="flex items-center gap-2 text-sm font-medium text-green-700">
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-green-600" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;
