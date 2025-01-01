import { DeploymentConfig } from './config/deployment'

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
  // Try to get deployment information first
  const network = process.env.NETWORK || 'sepolia'
  const deploymentInfo = DeploymentConfig.getDeploymentInfo(network)

  // Use deployment info if available, otherwise fall back to environment variables
  const marketplaceContract = deploymentInfo?.marketplace || process.env.MARKETPLACE_CONTRACT_ADDRESS || ''
  const chainId = deploymentInfo?.chainId || parseInt(process.env.CHAIN_ID || '11155111', 10)

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
    marketplaceContract,
    chainId,
    cleanupInterval: parseInt(process.env.CLEANUP_INTERVAL || '3600000', 10),
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      methods: ['GET', 'POST']
    }
  };
}

export const config = getConfig()
