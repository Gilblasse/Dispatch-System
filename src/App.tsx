import { useEffect, useState } from 'react';
import './index.css';
import { MOCK_DRIVERS, MOCK_SCHEDULE, Trip, Driver } from './mockData';

type FilterType = 'none' | 'trip' | 'driver' | 'passenger';

function getDateKey(date: Date) {
  return date.toISOString().split('T')[0];
}

const formatDateForDisplay = (date: Date) => {
  return new Date().toDateString() === date.toDateString()
    ? 'Today'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface DriverStatus {
  className: string;
  text: string;
}

function getDriverStatus(driverId: string, trips: Trip[]): DriverStatus {
  const active = trips.find(
    t => t.driverId === driverId && !['complete', 'pending'].includes(t.status)
  );
  if (active) {
    switch (active.status) {
      case 'en-route':
        return { className: 'status-pill-progress', text: 'En-Route' };
      case 'at-pickup':
        return { className: 'status-pill-arrived', text: 'At Pickup' };
      case 'in-transit':
        return { className: 'status-pill-progress', text: 'In-Transit' };
    }
  }
  return { className: 'status-pill-available', text: 'Available' };
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState<FilterType>('none');
  const [filterId, setFilterId] = useState<string | null>(null);

  const dateKey = getDateKey(selectedDate);
  const allTripsForDay = MOCK_SCHEDULE[dateKey] || [];

  let tripsToDisplay = allTripsForDay;
  let driversToDisplay = Object.entries(MOCK_DRIVERS).map(([id, d]) => ({ id, ...d }));

  if (filterType === 'trip') {
    tripsToDisplay = allTripsForDay.filter(t => t.id === filterId);
    driversToDisplay = driversToDisplay.filter(d => d.id === tripsToDisplay[0]?.driverId);
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
  }, [selectedDate]);

  return (
    <div className="dashboard-container">
      <header className="command-bar">
        <div className="logo">Zenith</div>
        <div className="date-navigator">
          <i
            className="fas fa-chevron-left nav-arrow"
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 864e5))}
          />
          <span id="current-date">{formatDateForDisplay(selectedDate)}</span>
          <i
            className="fas fa-chevron-right nav-arrow"
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 864e5))}
          />
        </div>
        <div className="kpis" id="kpis-container">
          <div className="kpi">
            PENDING <span>{pending}</span>
          </div>
          <div className="kpi">
            ACTIVE TRIPS <span>{totalTrips - pending}</span>
          </div>
          <div className="kpi">
            DRIVERS <span>{totalDrivers - driversOnTrips} / {totalDrivers}</span>
          </div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </header>

      <aside className="trip-queue">
        <div className="panel-header" id="trip-panel-header">
          <h2>
            {filterType === 'none' ? 'Trip Manifest' : `Filtered: ${filterId}`}
          </h2>
          {filterType !== 'none' && (
            <button
              className="clear-filter-btn"
              onClick={() => {
                setFilterType('none');
                setFilterId(null);
              }}
            >
              <i className="fas fa-xmark" /> Show All
            </button>
          )}
        </div>
        <div className="trip-list" id="trip-list-container">
          {tripsToDisplay.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
              No trips found.
            </p>
          )}
          {tripsToDisplay
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(trip => {
              const isActive = filterType === 'trip' && filterId === trip.id;
              return (
                <div
                  key={trip.id}
                  className={`trip-card ${isActive ? 'active' : ''}`}
                  data-status={trip.status}
                  onClick={() => {
                    setFilterType('trip');
                    setFilterId(trip.id);
                  }}
                >
                  <div className="trip-header">
                    <h3
                      onClick={e => {
                        e.stopPropagation();
                        setFilterType('passenger');
                        setFilterId(trip.passenger);
                      }}
                    >
                      {trip.passenger}
                    </h3>
                    <span style={{ flexShrink: 0, marginLeft: '10px' }}>{trip.id.toUpperCase()}</span>
                  </div>
                  <div className="trip-locations">
                    <p>
                      <i className="fas fa-circle-dot"></i> <span>{trip.from}</span>
                    </p>
                    <p>
                      <i className="fas fa-flag-checkered"></i> <span>{trip.to}</span>
                    </p>
                  </div>
                  <div className="trip-footer">
                    <span>
                      <i className="fas fa-clock"></i> Pickup at {trip.time}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </aside>

      <footer className="driver-roster">
        <div className="panel-header">
          <h2>Active Drivers</h2>
        </div>
        <div className="roster-scroll" id="driver-roster-container">
          {driversToDisplay.map(driver => {
            const isActive = filterType === 'driver' && filterId === driver.id;
            const status = getDriverStatus(driver.id, allTripsForDay);
            return (
              <div
                key={driver.id}
                className={`driver-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('driver');
                  setFilterId(driver.id);
                }}
              >
                <div className="driver-profile">
                  <img src={`https://i.pravatar.cc/80?u=${driver.photo}`} alt="Avatar" />
                  <div className="driver-info">
                    <h4>{driver.name}</h4>
                    <span className="driver-vehicle-info">{driver.vehicle}</span>
                  </div>
                </div>
                <div className="driver-status-container">
                  <span className={`status-pill ${status.className}`}>{status.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </footer>

      <main className="map-container" id="map-container">
        {Object.entries(MOCK_DRIVERS).map(([id, d]) => {
          const activeTrip = (tripsToDisplay || []).find(t => t.driverId === id && t.status !== 'pending' && t.status !== 'complete');
          if (!activeTrip) return null;
          return (
            <div
              key={id}
              className="map-icon map-driver"
              data-status={activeTrip.status}
              style={{ top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%` }}
            >
              <div className="icon-body"></div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
