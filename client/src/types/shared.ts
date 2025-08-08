export type EchoInput = { message: string };
export type EchoResponse = { echoed: string };
export type HealthResponse = { 
  status: 'ok'; 
  uptime: number; 
  environment: string;
  timestamp: string;
};
