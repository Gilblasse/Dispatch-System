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
        pickupAddress: '123 Start St',
        dropoffAddress: '456 End Ave',
        notes: 'n/a',
      },
    ],
  };

  const geoMock = jest.spyOn(geocode, 'geocodeAddress');
  geoMock.mockResolvedValueOnce({ lat: 1, lng: 2 });
  geoMock.mockResolvedValueOnce({ lat: 3, lng: 4 });

  const result = await mapScheduleToTrips(schedule);

  expect(geoMock).toHaveBeenCalledWith('123 Start St');
  expect(geoMock).toHaveBeenCalledWith('456 End Ave');
  expect(result).toEqual([
    {
      id: 't1',
      driverId: 'd1',
      status: 'pending',
      passengerName: 'Joe',
      pickup: { lat: 1, lng: 2 },
      dropoff: { lat: 3, lng: 4 },
    },
  ]);

  geoMock.mockRestore();
});
