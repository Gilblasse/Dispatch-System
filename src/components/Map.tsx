import React, { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as LibMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setZoom, setCenter, setDarkMode } from '../store/mapUiSlice';
import { useFitMapToEntities } from '../hooks';
import { getVisibleEntities } from '../utils/filterMapEntities';
import './MapStyles.css';

type FilterType = 'none' | 'trip' | 'driver' | 'passenger';

interface Props {
  filterType: FilterType;
  activeTripId: string | null;
  filterId: string | null;
}
export default function Map({ filterType, activeTripId, filterId }: Props) {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LibMap | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const drivers = useSelector((s: RootState) => s.drivers);
  const trips = useSelector((s: RootState) => s.trips);
  const ui = useSelector((s: RootState) => s.mapUi);

  const { visibleDrivers, visibleTrips } = getVisibleEntities(
    filterType,
    filterId,
    activeTripId,
    drivers,
    trips,
  );

  useFitMapToEntities(mapRef.current, visibleDrivers, visibleTrips);

  const driverMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const tripMarkersRef = useRef<Record<string, { pickup: maplibregl.Marker; dropoff: maplibregl.Marker }>>({});

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => dispatch(setDarkMode(mq.matches));
    mq.addEventListener('change', listener);
    listener();
    return () => mq.removeEventListener('change', listener);
  }, [dispatch]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: containerRef.current,
        style: ui.isDarkMode
          ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
          : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: ui.center,
        zoom: ui.zoom,
      });
      mapRef.current.addControl(new maplibregl.NavigationControl());
      mapRef.current.on('move', () => {
        // markers automatically reposition
      });
      mapRef.current.on('moveend', () => {
        if (!mapRef.current) return;
        const c = mapRef.current.getCenter();
        dispatch(setCenter([c.lng, c.lat]));
      });
      mapRef.current.on('zoomend', () => {
        if (!mapRef.current) return;
        dispatch(setZoom(mapRef.current.getZoom()));
      });
      setMapReady(true);
    } else {
      mapRef.current.setStyle(
        ui.isDarkMode
          ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
          : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
      );
      mapRef.current.setZoom(ui.zoom);
      mapRef.current.setCenter(ui.center);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      Object.values(driverMarkersRef.current).forEach(m => m.remove());
      driverMarkersRef.current = {};
      Object.values(tripMarkersRef.current).forEach(p => {
        p.pickup.remove();
        p.dropoff.remove();
      });
      tripMarkersRef.current = {};
      setMapReady(false);
    };
  }, [ui.isDarkMode]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    const existing = new Set(Object.keys(driverMarkersRef.current));
    visibleDrivers.forEach(d => {
      let marker = driverMarkersRef.current[d.id];
      if (!marker) {
        const el = document.createElement('div');
        el.className = 'map-driver';
        const body = document.createElement('div');
        body.className = 'icon-body';
        el.appendChild(body);
        marker = new maplibregl.Marker({ element: el })
          .setLngLat([d.lng, d.lat])
          .addTo(map);
        driverMarkersRef.current[d.id] = marker;
      } else {
        marker.setLngLat([d.lng, d.lat]);
      }
      existing.delete(d.id);
    });
    existing.forEach(id => {
      driverMarkersRef.current[id].remove();
      delete driverMarkersRef.current[id];
    });
  }, [mapReady, visibleDrivers]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    const existing = new Set(Object.keys(tripMarkersRef.current));
    visibleTrips.forEach(t => {
      let pair = tripMarkersRef.current[t.id];
      if (!pair) {
        const pEl = document.createElement('div');
        pEl.className = 'map-pin map-pickup-pin';
        pEl.textContent = 'P';
        const dEl = document.createElement('div');
        dEl.className = 'map-pin map-dropoff-pin';
        dEl.textContent = 'D';
        pair = {
          pickup: new maplibregl.Marker({ element: pEl })
            .setLngLat([t.pickup.lng, t.pickup.lat])
            .addTo(map),
          dropoff: new maplibregl.Marker({ element: dEl })
            .setLngLat([t.dropoff.lng, t.dropoff.lat])
            .addTo(map),
        };
        tripMarkersRef.current[t.id] = pair;
      } else {
        pair.pickup.setLngLat([t.pickup.lng, t.pickup.lat]);
        pair.dropoff.setLngLat([t.dropoff.lng, t.dropoff.lat]);
      }
      existing.delete(t.id);
    });
    existing.forEach(id => {
      tripMarkersRef.current[id].pickup.remove();
      tripMarkersRef.current[id].dropoff.remove();
      delete tripMarkersRef.current[id];
    });
  }, [mapReady, visibleTrips]);

  return (
    <div className="map-container">
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
