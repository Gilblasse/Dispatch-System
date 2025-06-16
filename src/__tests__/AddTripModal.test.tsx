import { render, screen } from '@testing-library/react';
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
        addTrip={() => {}}
      />
    );
    expect(screen.getByText(/Medicaid ID/i)).toBeInTheDocument();
  });
});
