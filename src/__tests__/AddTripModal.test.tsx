import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AddTripModal } from '../components/AddTripModal';

describe('AddTripModal', () => {
  it('shows Medicaid field when payer is Medicaid', () => {
    render(
      <AddTripModal
        open={true}
        onClose={() => {}}
        drivers={[]}
        vehicles={[]}
        passengers={[]}
        addTrip={() => {}}
        addPassenger={() => {}}
        updatePassenger={() => {}}
      />
    );
    expect(screen.getByText(/Medicaid ID/i)).toBeInTheDocument();
  });

  it('shows datalist suggestions for passenger, phone and address', async () => {
    const passengers = [
      { id: 'p1', name: 'John Doe', phone: ['555-0101'], addresses: ['123 Main St'] },
      { id: 'p2', name: 'Jane Smith', phone: ['555-0202'], addresses: ['456 Oak Ave'] },
    ];
    render(
      <AddTripModal
        open={true}
        onClose={() => {}}
        drivers={[]}
        vehicles={[]}
        passengers={passengers as any}
        addTrip={() => {}}
        addPassenger={() => {}}
        updatePassenger={() => {}}
      />
    );

    // passenger suggestions
    expect(document.querySelector('datalist#passenger-list option[value="John Doe"]')).toBeInTheDocument();
    expect(document.querySelector('datalist#passenger-list option[value="Jane Smith"]')).toBeInTheDocument();

    const passengerInput = screen.getByPlaceholderText(/select or type passenger/i);
    await userEvent.type(passengerInput, 'John Doe');

    await waitFor(() => {
      expect(document.querySelector('datalist#phone-list-0 option[value="555-0101"]')).toBeInTheDocument();
      expect(document.querySelector('datalist#address-list option[value="123 Main St"]')).toBeInTheDocument();
    });
  });

  it('creates a new passenger when a new name is entered', async () => {
    const addPassenger = jest.fn();
    const addTrip = jest.fn();

    render(
      <AddTripModal
        open={true}
        onClose={() => {}}
        drivers={[]}
        vehicles={[]}
        passengers={[]}
        addTrip={addTrip}
        addPassenger={addPassenger}
        updatePassenger={() => {}}
      />
    );

    const passengerInput = screen.getByPlaceholderText(/select or type passenger/i);
    await userEvent.type(passengerInput, 'New Rider');
    const phoneInput = document.querySelector('input[list="phone-list-0"]') as HTMLInputElement;
    await userEvent.type(phoneInput, '555-9999');

    await userEvent.click(screen.getByText(/save/i));

    expect(addPassenger).toHaveBeenCalledTimes(1);
    expect(addPassenger.mock.calls[0][0]).toEqual(
      expect.objectContaining({ name: 'New Rider', phone: ['555-9999'] })
    );
  });

  it('updates existing passenger with new phone and address', async () => {
    const passengers = [
      { id: 'p1', name: 'John Doe', phone: ['555-0101'], addresses: ['123 Main St'] },
    ];
    const updatePassenger = jest.fn();

    render(
      <AddTripModal
        open={true}
        onClose={() => {}}
        drivers={[]}
        vehicles={[]}
        passengers={passengers as any}
        addTrip={() => {}}
        addPassenger={() => {}}
        updatePassenger={updatePassenger}
      />
    );

    const passengerInput = screen.getByPlaceholderText(/select or type passenger/i);
    await userEvent.type(passengerInput, 'John Doe');

    await userEvent.click(screen.getByText(/add phone/i));
    const phoneInputs = document.querySelectorAll('input[list^="phone-list-"]');
    await userEvent.type(phoneInputs[1] as HTMLInputElement, '555-0202');

    const pickupInput = document.querySelectorAll('input[list="address-list"]')[0] as HTMLInputElement;
    await userEvent.type(pickupInput, '789 Pine Rd');

    await userEvent.click(screen.getByText(/save/i));

    expect(updatePassenger).toHaveBeenCalledTimes(1);
    expect(updatePassenger.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        id: 'p1',
        phone: ['555-0101', '555-0202'],
        lastPickup: '789 Pine Rd',
      })
    );
    expect(passengers[0].addresses).toContain('789 Pine Rd');
  });
});
