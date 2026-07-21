import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type HotelCity = 'makkah' | 'medina';

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    // enlève un éventuel suffixe d'étoiles ex: " (3⭐)", " (5*)", " 4 étoiles"
    .replace(/\s*[\(\-–—]?\s*\d\s*(⭐|\*|étoiles?|stars?)\s*\)?\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
const makeKey = (name: string, city: HotelCity) => `${city}::${normalize(name)}`;

let cache: Map<string, string> | null = null;
let inflight: Promise<Map<string, string>> | null = null;

const fetchMap = async (): Promise<Map<string, string>> => {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase
      .from('hotel_presets')
      .select('hotel_name, city, website_url');
    const map = new Map<string, string>();
    if (!error && data) {
      for (const row of data as Array<{ hotel_name: string; city: string; website_url: string | null }>) {
        if (row.website_url && row.hotel_name && row.city) {
          map.set(makeKey(row.hotel_name, row.city as HotelCity), row.website_url);
        }
      }
    }
    cache = map;
    inflight = null;
    return map;
  })();
  return inflight;
};

export const invalidateHotelUrlCache = () => {
  cache = null;
  inflight = null;
};

export const useHotelUrlMap = () => {
  const [map, setMap] = useState<Map<string, string> | null>(cache);
  useEffect(() => {
    if (cache) {
      setMap(cache);
      return;
    }
    let mounted = true;
    fetchMap().then((m) => {
      if (mounted) setMap(m);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const getUrl = (name?: string | null, city?: HotelCity): string | null => {
    if (!name || !city || !map) return null;
    return map.get(makeKey(name, city)) || null;
  };

  return { getUrl, ready: !!map };
};
