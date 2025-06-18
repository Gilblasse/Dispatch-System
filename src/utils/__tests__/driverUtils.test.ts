import { getDriverStatus } from '../driverUtils';
import { Trip } from '../../mockData';

describe('getDriverStatus', () => {
  const baseTrip = {
    id: 't1',
    driverId: 'd1',
    passenger: '',
    from: '',
    to: '',
    time: '',
  } as const;

  test('maps at-dropoff status', () => {
    const trips: Trip[] = [{ ...baseTrip, status: 'at-dropoff' }];
    expect(getDriverStatus('d1', trips)).toEqual({ className: 'status-pill-arrived', text: 'At Dropoff' });
  });

  test('maps cancel status', () => {
    const trips: Trip[] = [{ ...baseTrip, status: 'cancel' }];
    expect(getDriverStatus('d1', trips)).toEqual({ className: 'status-pill-cancel', text: 'Canceled' });
  });

  test('maps no_show status', () => {
    const trips: Trip[] = [{ ...baseTrip, status: 'no_show' }];
    expect(getDriverStatus('d1', trips)).toEqual({ className: 'status-pill-no-show', text: 'No Show' });
  });

  test('returns Available for complete status', () => {
    const trips: Trip[] = [{ ...baseTrip, status: 'complete' }];
    expect(getDriverStatus('d1', trips)).toEqual({ className: 'status-pill-available', text: 'Available' });
  });
});
