export interface Config {
  port: number;
  host: string;
  marketplaceContract: string;
  chainId: number;
  cleanupInterval: number;
  cors: {
    origin: string | string[];
    methods: string[];
  };
}

function getConfig(): Config {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
    marketplaceContract: process.env.MARKETPLACE_CONTRACT_ADDRESS || '',
    chainId: parseInt(process.env.CHAIN_ID || '11155111', 10), // Sepolia by default
    cleanupInterval: parseInt(process.env.CLEANUP_INTERVAL || '3600000', 10),
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      methods: ['GET', 'POST']
    }
  };
}

export const config = getConfig()
