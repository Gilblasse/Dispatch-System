import React from 'react';
import styles from './PassengerPage.module.css';

export interface PassengerDetails {
  phone?: string;
  medicaidId?: string;
  invoice?: string;
  notes?: string;
}

interface PassengerInfoPanelProps {
  details: PassengerDetails;
}

export default function PassengerInfoPanel({ details }: PassengerInfoPanelProps) {
  return (
    <div className={styles.passengerMainInfo} id="passenger-info-panel">
      <p>
        <i className="fas fa-phone" /> <span data-field="phone">{details.phone || 'N/A'}</span>
      </p>
      <p>
        <i className="fas fa-id-card" /> <span data-field="medicaidId">{details.medicaidId || 'N/A'}</span>
      </p>
      <p>
        <i className="fas fa-file-invoice" /> <span data-field="invoice">{details.invoice || 'N/A'}</span>
      </p>
      <p>
        <i className="fas fa-sticky-note" /> <span data-field="notes">{details.notes || 'No notes.'}</span>
      </p>
    </div>
  );
}
