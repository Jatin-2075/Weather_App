import { useState, useEffect } from 'react';
import type { LocationCoords } from '../types/weather.types';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                name: 'Current Location',
              });
              setError(null);
              setLoading(false);
            },
            (error) => {
              console.warn('Geolocation error:', error);
              setLocation({
                latitude: 40.7128,
                longitude: -74.006,
                name: 'New York',
              });
              setError(null);
              setLoading(false);
            },
            {
              timeout: 5000,
              maximumAge: 300000,
              enableHighAccuracy: false,
            }
          );
        } else {
          setLocation({
            latitude: 40.7128,
            longitude: -74.006,
            name: 'New York',
          });
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to get location');
        setLocation({
          latitude: 40.7128,
          longitude: -74.006,
          name: 'New York',
        });
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, error, loading };
};
