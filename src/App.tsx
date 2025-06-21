import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDriverDetails } from './store/driverDetailsSlice';
import { setTripsSchedule } from './store/tripsDetailsSlice';
import { setTrips } from './store/tripsSlice';
import { RootState } from './store';
import './index.css';
import { MOCK_DRIVERS, MOCK_SCHEDULE, Trip, Driver } from './mockData';
import { getDateKey } from "./utils/dateUtils";
import { mapScheduleToTrips } from './utils/tripUtils';
import {
  CommandBar,
  TripQueue,
  DriverRoster,
  Map,
  PassengerPage,
} from './components';

type FilterType = 'none' | 'trip' | 'driver' | 'passenger';

export default function App() {
  const dispatch = useDispatch();
  const driversData = useSelector((s: RootState) => s.driverDetails);
  const tripsSchedule = useSelector((s: RootState) => s.tripsDetails);

  useEffect(() => {
    dispatch(setDriverDetails(MOCK_DRIVERS));
    dispatch(setTripsSchedule(MOCK_SCHEDULE));
    (async () => {
      try {
        const mapTrips = await mapScheduleToTrips(MOCK_SCHEDULE);
        dispatch(setTrips(mapTrips));
      } catch {
        // ignore geocode errors
      }
    })();
  }, [dispatch]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterId, setFilterId] = useState<string | null>(null);
  const [detailedTrip, setDetailedTrip] = useState<Trip | null>(null);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [passengerView, setPassengerView] = useState<string | null>(null);
  const [rosterCollapsed, setRosterCollapsed] = useState(false);

  const dateKey = getDateKey(selectedDate);
  const allTripsForDay = tripsSchedule[dateKey] || [];


  const totalDrivers = Object.keys(driversData).length;
  const totalTrips = allTripsForDay.length;
  const pending = allTripsForDay.filter(t => t.status === 'pending').length;
  const driversOnTrips = new Set(allTripsForDay.map(t => t.driverId)).size;

  useEffect(() => {
    setFilterType('none');
    setFilterId(null);
    setDetailedTrip(null);
    setActiveTripId(null);
    setPassengerView(null);
  }, [selectedDate]);

  return (
    <div className={`dashboard-container${rosterCollapsed ? ' roster-collapsed' : ''}`}>
      <CommandBar
        selectedDate={selectedDate}
        pending={pending}
        totalTrips={totalTrips}
        driversOnTrips={driversOnTrips}
        totalDrivers={totalDrivers}
        onPrevDate={() => setSelectedDate(new Date(selectedDate.getTime() - 864e5))}
        onNextDate={() => setSelectedDate(new Date(selectedDate.getTime() + 864e5))}
        onDateChange={setSelectedDate}
      />

      {passengerView ? (
        <PassengerPage
          passenger={passengerView}
          onBack={() => {
            setPassengerView(null);
            setFilterType('none');
            setFilterId(null);
            setDetailedTrip(null);
          }}
        />
      ) : (
        <TripQueue
          selectedDate={selectedDate}
          filterType={filterType}
          filterId={filterId}
          detailedTrip={detailedTrip}
          activeTripId={activeTripId}
          onSelectTrip={setActiveTripId}
          onPassengerFilter={passenger => {
            setFilterType('passenger');
            setFilterId(passenger);
            setDetailedTrip(null);
          }}
          onShowPassengerPage={setPassengerView}
          onShowTripDetails={setDetailedTrip}
          onCloseTripDetails={() => setDetailedTrip(null)}
          onClearFilter={() => {
            setFilterType('none');
            setFilterId(null);
            setDetailedTrip(null);
          }}
        />
      )}

      <DriverRoster
        selectedDate={selectedDate}
        activeDriverId={filterType === 'driver' ? filterId : null}
        onSelectDriver={id => {
          setFilterType('driver');
          setFilterId(id);
          setDetailedTrip(null);
        }}
        collapsed={rosterCollapsed}
        onToggleCollapse={() => setRosterCollapsed(c => !c)}
        filterType={filterType}
        filterId={filterId}
      />

      <Map filterType={filterType} activeTripId={activeTripId} filterId={filterId} />
    </div>
  );
}
