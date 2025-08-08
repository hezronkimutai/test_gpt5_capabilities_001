import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { HealthResponse } from '../types/shared';

type Props = { fetcher?: () => Promise<HealthResponse> };

export function HealthCheck({ fetcher = api.health }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus('loading');
    setError(null);
    fetcher()
      .then((res) => {
        setStatus(res.status);
        setHealth(res);
      })
      .catch((err) => {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      });
  }, [fetcher]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
      <h3>🔋 API Health Check</h3>
      <div>
        <strong>Status:</strong> 
        <span style={{ 
          color: status === 'ok' ? 'green' : status === 'error' ? 'red' : 'orange',
          marginLeft: '0.5rem'
        }}>
          {status}
        </span>
      </div>
      {health && (
        <>
          <div><strong>Uptime:</strong> {Math.floor(health.uptime)}s</div>
          <div><strong>Environment:</strong> {health.environment}</div>
          <div><strong>Last Check:</strong> {new Date(health.timestamp).toLocaleTimeString()}</div>
        </>
      )}
      {error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default HealthCheck;
