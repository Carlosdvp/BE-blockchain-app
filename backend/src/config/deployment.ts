import fs from 'fs'
import path from 'path'

interface DeploymentInfo {
  chainId: number
  network: string
  marketplace: string
  deployer: string
  timestamp: number
}

export class DeploymentConfig {
  // Update path to be relative to the backend directory
  private static DEPLOYMENTS_DIR = path.join(__dirname, '../../deployments')

  static getDeploymentInfo(network: string = 'sepolia'): DeploymentInfo {
    const deploymentPath = path.join(
      this.DEPLOYMENTS_DIR,
      `${network}-deployment.json`
    )

    try {
      const deploymentData = fs.readFileSync(deploymentPath, 'utf8')

      return JSON.parse(deploymentData)

    } catch (error) {
      console.warn(`No deployment file found at ${deploymentPath}, falling back to environment variables`)
      
      return {} as DeploymentInfo
    }
  }

  static getMarketplaceAddress(network: string = 'sepolia'): string {
    return this.getDeploymentInfo(network).marketplace
  }
}
