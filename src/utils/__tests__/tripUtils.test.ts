import { mapScheduleToTrips } from '../tripUtils';
import * as geocode from '../geocodeAddress';
import type { Trip } from '../../mockData';

test('maps schedule trips to map trips using geocoded addresses', async () => {
  const schedule: Record<string, Trip[]> = {
    '2024-01-01': [
      {
        id: 't1',
        driverId: 'd1',
        status: 'pending',
        passenger: 'Joe',
        from: 'A',
        to: 'B',
        time: '10:00',
        date: '2024-01-01',
        inTime: '09:45',
        outTime: '10:15',
        miles: 1,
        transportType: 'Ambulatory',
        phone: '555',
        medicaidNumber: 'MC',
        invoiceNumber: 'INV',
        pickupAddress: '123 Start St, Albany, NY',
        dropoffAddress: '456 End Ave, Albany, NY',
        notes: 'n/a',
      },
    ],
  };

  const geoMock = jest.spyOn(geocode, 'geocodeAddress');
  geoMock.mockResolvedValueOnce({ lat: 42.6526, lng: -73.7562 });
  geoMock.mockResolvedValueOnce({ lat: 42.6527, lng: -73.75 });

  const result = await mapScheduleToTrips(schedule);

  expect(geoMock).toHaveBeenCalledWith('123 Start St, Albany, NY');
  expect(geoMock).toHaveBeenCalledWith('456 End Ave, Albany, NY');
  expect(result).toEqual([
    {
      id: 't1',
      driverId: 'd1',
      status: 'pending',
      passengerName: 'Joe',
      pickup: { lat: 42.6526, lng: -73.7562 },
      dropoff: { lat: 42.6527, lng: -73.75 },
    },
  ]);

  geoMock.mockRestore();
});
