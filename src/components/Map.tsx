import React, { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as LibMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setZoom, setCenter, setDarkMode } from '../store/mapUiSlice';
import { useFitMapToEntities, useProjectedTrips } from '../hooks';
import DriverIcon from './DriverIcon';
import TripPin from './TripPin';
import './MapStyles.css';

type FilterType = 'none' | 'trip' | 'driver' | 'passenger';

interface Props {
  filterType: FilterType;
  activeTripId: string | null;
}
export default function Map({ filterType, activeTripId }: Props) {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LibMap | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const drivers = useSelector((s: RootState) => s.drivers);
  const trips = useSelector((s: RootState) => s.trips);
  const ui = useSelector((s: RootState) => s.mapUi);

  let visibleDrivers = drivers;
  let visibleTrips = trips;
  if (filterType !== 'none') {
    const active = trips.find(t => t.id === activeTripId);
    if (active) {
      visibleTrips = [active];
      const driver = drivers.find(d => d.id === active.driverId);
      visibleDrivers = driver ? [driver] : [];
    } else {
      visibleDrivers = [];
      visibleTrips = [];
    }
  }

  useFitMapToEntities(mapRef.current, visibleDrivers, visibleTrips);

  const [driverPos, setDriverPos] = useState<Record<string, { x: number; y: number }>>({});
  const tripPos = useProjectedTrips(mapRef.current, visibleTrips);

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
        if (!mapRef.current) return;
        const c = mapRef.current.getCenter();
        dispatch(setCenter([c.lng, c.lat]));
        dispatch(setZoom(mapRef.current.getZoom()));
        updatePositions();
      });
      mapRef.current.on('zoom', updatePositions);
      mapRef.current.on('resize', updatePositions);
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
    updatePositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapReady(false);
    };
  }, [ui.isDarkMode]);

  const updatePositions = () => {
    if (!mapRef.current) return;
    const m = mapRef.current;
    const dPos: Record<string, { x: number; y: number }> = {};
    visibleDrivers.forEach(d => {
      const p = m.project([d.lng, d.lat]);
      dPos[d.id] = { x: p.x, y: p.y };
    });
    setDriverPos(dPos);
  };

  useEffect(updatePositions, [visibleDrivers]);

  return (
    <div className="map-container">
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {visibleDrivers.map(d =>
        driverPos[d.id] ? (
          <DriverIcon key={d.id} driver={d} position={driverPos[d.id]} />
        ) : null
      )}
      {visibleTrips.map(t =>
        tripPos[t.id] ? (
          <TripPin key={t.id} trip={t} position={tripPos[t.id]} />
        ) : null
      )}
    </div>
  );
}
