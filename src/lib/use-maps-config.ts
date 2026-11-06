import { useEffect, useState } from 'react';
import { api, type MapsConfig } from './api';

export function useMapsConfig() {
  const [config, setConfig] = useState<MapsConfig | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api.getMapsConfig(controller.signal).then(value => {
      if (!controller.signal.aborted) setConfig(value);
    }).catch(() => {
      if (!controller.signal.aborted) setError('Could not check the map setup. Refresh the page to try again.');
    });
    return () => controller.abort();
  }, []);

  return { config, error };
}
