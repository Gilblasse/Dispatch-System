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

  it('shows autocomplete suggestions for passenger, phone and address', async () => {
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

    const passengerInput = screen.getByPlaceholderText(/select or type passenger/i);
    await userEvent.type(passengerInput, 'J');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    await userEvent.click(screen.getByText('John Doe'));

    const phoneInput = screen.getByPlaceholderText('Phone number');
    await userEvent.click(phoneInput);
    await waitFor(() => {
      expect(screen.getByText('555-0101')).toBeInTheDocument();
    });

    const pickupInput = screen.getByPlaceholderText('Pickup address');
    await userEvent.click(pickupInput);
    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
  });

  it('creates a new passenger when a new name is entered', async () => {
    const addPassenger = jest.fn();
    const addTrip = jest.fn();

    const { container } = render(
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
    const phoneInput = screen.getByPlaceholderText('Phone number');
    await userEvent.type(phoneInput, '555-9999');
    // Select payer and set date to satisfy validation
    const payerSelect = screen.getAllByRole('combobox')[0];
    await userEvent.selectOptions(payerSelect, 'Private');
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    await userEvent.type(dateInput, '2023-10-10');

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

    const { container } = render(
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
    const phoneInputs = screen.getAllByPlaceholderText('Phone number');
    await userEvent.type(phoneInputs[1], '555-0202');
    const payerSelect2 = screen.getAllByRole('combobox')[0];
    await userEvent.selectOptions(payerSelect2, 'Private');
    const dateInput2 = container.querySelector('input[type="date"]') as HTMLInputElement;
    await userEvent.type(dateInput2, '2023-10-10');

    const pickupInput = screen.getByPlaceholderText('Pickup address');
    await userEvent.type(pickupInput, '789 Pine Rd');

    await userEvent.click(screen.getByText(/save/i));

    expect(updatePassenger).toHaveBeenCalledTimes(1);
    expect(updatePassenger).toHaveBeenCalledTimes(1);
    expect(updatePassenger.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        id: 'p1',
        phone: ['555-0101', '555-0202'],
        addresses: expect.arrayContaining(['123 Main St', '789 Pine Rd']),
      })
    );
  });
});
