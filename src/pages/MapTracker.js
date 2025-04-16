import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Button, Stack } from '@mui/material';

const MapTracker = ({
  setDistance,
  setStartLocation,
  setEndLocation,
  startSet,
  endSet,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [startCoords, setStartCoords] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const setStart = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        if (startMarker) mapInstanceRef.current.removeLayer(startMarker);

        const marker = L.marker(coords).addTo(mapInstanceRef.current).bindPopup('Start Point').openPopup();
        setStartCoords(coords);
        setStartMarker(marker);
        setStartLocation({ latitude, longitude });
        mapInstanceRef.current.setView(coords, 14);
      },
      (err) => console.warn('Geolocation error (start):', err)
    );
  };

  const setEnd = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        if (endMarker) mapInstanceRef.current.removeLayer(endMarker);

        const marker = L.marker(coords).addTo(mapInstanceRef.current).bindPopup('End Point').openPopup();
        setEndMarker(marker);
        setEndLocation({ latitude, longitude });

        if (startCoords) {
          const distance = calculateDistance(startCoords, coords);
          setDistance(distance.toFixed(2));
        }

        mapInstanceRef.current.setView(coords, 14);
      },
      (err) => console.warn('Geolocation error (end):', err)
    );
  };

  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        mapInstanceRef.current.setView(coords, 14);
      },
      (err) => console.warn('Geolocation error (current):', err)
    );
  };

  const calculateDistance = (start, end) => {
    const [lat1, lon1] = start;
    const [lat2, lon2] = end;
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button variant="outlined" onClick={setStart} disabled={startSet}>
          {startSet ? '✅ Start Set' : '📍 Set Start'}
        </Button>
        <Button variant="outlined" onClick={setEnd} disabled={endSet}>
          {endSet ? '✅ End Set' : '🏁 Set End'}
        </Button>
        <Button variant="outlined" onClick={goToCurrentLocation}>
          🧭 Current Location
        </Button>
      </Stack>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: '#e0e0e0',
        }}
      />
    </Box>
  );
};

export default MapTracker;
