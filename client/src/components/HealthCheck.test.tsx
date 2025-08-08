import { render, screen, waitFor } from '@testing-library/react';
import { HealthCheck } from './HealthCheck';

it('renders API health status', async () => {
  const fetcher = async () => ({ 
    status: 'ok' as const, 
    uptime: 123,
    environment: 'test',
    timestamp: new Date().toISOString()
  });
  render(<HealthCheck fetcher={fetcher} />);
  await waitFor(() => screen.getByText(/API Health Check/));
  expect(screen.getByText(/ok/)).toBeInTheDocument();
});
