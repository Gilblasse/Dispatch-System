import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store';
import DriverRoster from '../DriverRoster';

test('renders driver names', () => {
  render(
    <Provider store={store}>
      <DriverRoster
        selectedDate={new Date()}
        activeDriverId={null}
        onSelectDriver={() => {}}
        collapsed={false}
        onToggleCollapse={() => {}}
        filterType="none"
        filterId={null}
      />
    </Provider>
  );

  expect(screen.getByText('Elena Vance')).toBeInTheDocument();
  expect(screen.getByText('Ben Carter')).toBeInTheDocument();
});

test('wheel event scrolls roster', () => {
  const { container } = render(
    <Provider store={store}>
      <DriverRoster
        selectedDate={new Date()}
        activeDriverId={null}
        onSelectDriver={() => {}}
        collapsed={false}
        onToggleCollapse={() => {}}
        filterType="none"
        filterId={null}
      />
    </Provider>
  );

  const roster = container.querySelector('#driver-roster-container') as HTMLElement;
  roster.scrollLeft = 0;
  fireEvent.wheel(roster, { deltaY: 30 });
  expect(roster.scrollLeft).toBe(30);
});

test('panel header toggles roster visibility', () => {
  function Wrapper() {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <Provider store={store}>
        <div className={`dashboard-container${collapsed ? ' roster-collapsed' : ''}`}>
          <DriverRoster
            selectedDate={new Date()}
            activeDriverId={null}
            onSelectDriver={() => {}}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(c => !c)}
            filterType="none"
            filterId={null}
          />
        </div>
      </Provider>
    );
  }

  const { container } = render(<Wrapper />);

  const header = screen.getByRole('button');
  const dashboard = container.querySelector('.dashboard-container') as HTMLElement;

  expect(screen.getByText('Elena Vance')).toBeInTheDocument();
  expect(dashboard.classList.contains('roster-collapsed')).toBe(false);
  fireEvent.click(header);
  expect(screen.queryByText('Elena Vance')).not.toBeInTheDocument();
  expect(dashboard.classList.contains('roster-collapsed')).toBe(true);
  fireEvent.click(header);
  expect(screen.getByText('Elena Vance')).toBeInTheDocument();
  expect(dashboard.classList.contains('roster-collapsed')).toBe(false);
});

test('filters drivers by passenger', () => {
  render(
    <Provider store={store}>
      <DriverRoster
        selectedDate={new Date()}
        activeDriverId={null}
        onSelectDriver={() => {}}
        collapsed={false}
        onToggleCollapse={() => {}}
        filterType="passenger"
        filterId="Marcus Thorne"
      />
    </Provider>
  );

  expect(screen.getByText('Ben Carter')).toBeInTheDocument();
  expect(screen.queryByText('Elena Vance')).not.toBeInTheDocument();
  expect(screen.queryByText('Maya Singh')).not.toBeInTheDocument();
  expect(screen.queryByText('David Chen')).not.toBeInTheDocument();
});