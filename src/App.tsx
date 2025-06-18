import { useEffect, useState } from 'react';
import './index.css';
import { MOCK_DRIVERS, MOCK_SCHEDULE, Trip, Driver } from './mockData';
import { getDateKey } from "./utils/dateUtils";
import {
  CommandBar,
  TripQueue,
  DriverRoster,
  MapContainer,
} from './components';

type FilterType = 'none' | 'trip' | 'driver' | 'passenger';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterId, setFilterId] = useState<string | null>(null);
  const [detailedTrip, setDetailedTrip] = useState<Trip | null>(null);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  const dateKey = getDateKey(selectedDate);
  const allTripsForDay = MOCK_SCHEDULE[dateKey] || [];

  let tripsToDisplay = allTripsForDay;
  let driversToDisplay = Object.entries(MOCK_DRIVERS).map(([id, d]) => ({
    id,
    ...d,
  }));

  if (filterType === 'trip') {
    tripsToDisplay = allTripsForDay.filter(t => t.id === filterId);
    driversToDisplay = driversToDisplay.filter(
      d => d.id === tripsToDisplay[0]?.driverId
    );
  } else if (filterType === 'driver') {
    tripsToDisplay = allTripsForDay.filter(t => t.driverId === filterId);
    driversToDisplay = driversToDisplay.filter(d => d.id === filterId);
  } else if (filterType === 'passenger') {
    tripsToDisplay = allTripsForDay.filter(t => t.passenger === filterId);
    const driverIds = new Set(tripsToDisplay.map(t => t.driverId));
    driversToDisplay = driversToDisplay.filter(d => driverIds.has(d.id));
  }

  const totalDrivers = Object.keys(MOCK_DRIVERS).length;
  const totalTrips = allTripsForDay.length;
  const pending = allTripsForDay.filter(t => t.status === 'pending').length;
  const driversOnTrips = new Set(allTripsForDay.map(t => t.driverId)).size;

  useEffect(() => {
    setFilterType('none');
    setFilterId(null);
    setDetailedTrip(null);
    setActiveTripId(null);
  }, [selectedDate]);

  return (
    <div className="dashboard-container">
      <CommandBar
        selectedDate={selectedDate}
        pending={pending}
        totalTrips={totalTrips}
        driversOnTrips={driversOnTrips}
        totalDrivers={totalDrivers}
        onPrevDate={() => setSelectedDate(new Date(selectedDate.getTime() - 864e5))}
        onNextDate={() => setSelectedDate(new Date(selectedDate.getTime() + 864e5))}
      />

      <TripQueue
        trips={tripsToDisplay}
        drivers={MOCK_DRIVERS}
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
        onShowTripDetails={setDetailedTrip}
        onCloseTripDetails={() => setDetailedTrip(null)}
        onClearFilter={() => {
          setFilterType('none');
          setFilterId(null);
          setDetailedTrip(null);
        }}
      />

      <DriverRoster
        drivers={driversToDisplay as Driver[]}
        trips={allTripsForDay}
        activeDriverId={filterType === 'driver' ? filterId : null}
        onSelectDriver={id => {
          setFilterType('driver');
          setFilterId(id);
          setDetailedTrip(null);
        }}
      />

      <MapContainer drivers={MOCK_DRIVERS} trips={tripsToDisplay} />
    </div>
  );
}
