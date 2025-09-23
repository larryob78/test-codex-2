import { useEffect, useState } from 'react';
import { fetchPresets } from '../lib/api.js';

export function usePresets() {
  const [sizes, setSizes] = useState([]);
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchPresets()
      .then((data) => {
        if (!active) return;
        setSizes(data.sizes || []);
        setFormats(data.formats || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { sizes, formats, loading, error };
}
