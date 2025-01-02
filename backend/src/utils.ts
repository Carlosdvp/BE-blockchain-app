import { ethers } from 'ethers'
import { Listing, Bid } from './types'
import dotenv from 'dotenv'

dotenv.config()

// Listing type hash from our smart contract
const LISTING_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes("Listing(address nftContract,uint256 tokenId,address owner,uint256 minPrice)")
);

// Bid type hash from our smart contract
const BID_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes("Bid(address nftContract,uint256 tokenId,address bidder,uint256 amount,address paymentToken)")
)

// Domain separator params - should match smart contract
function getDomainSeparator(): string {
  const chainId = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 11155111
  const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS

  if (!contractAddress || !ethers.isAddress(contractAddress)) {
    throw new Error('Invalid or missing MARKETPLACE_CONTRACT_ADDRESS in environment variables')
  }

  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      [
        ethers.keccak256(
          ethers.toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
        ),
        ethers.keccak256(ethers.toUtf8Bytes("NFTMarketplace")),
        ethers.keccak256(ethers.toUtf8Bytes("1")),
        chainId,
        contractAddress
      ]
    )
  )
}

export async function verifySignature(data: Listing | Bid): Promise<boolean> {
  try {
    // Get the domain separator using configuration values
    const domainSeparator = getDomainSeparator()

    // Create the appropriate hash based on data type
    let typeHash
    let encodedData
    
    if ('owner' in data) {
      typeHash = LISTING_TYPEHASH;
      encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256", "address", "uint256"],
        [data.nftContract, data.tokenId, data.owner, data.minPrice]
      )
    } else {
      // This is a bid
      typeHash = BID_TYPEHASH
      encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256", "address", "uint256", "address"],
        [data.nftContract, data.tokenId, data.bidder, data.amount, data.paymentToken]
      );
    }

    // Create the hash that was signed
    const hash = ethers.keccak256(
      ethers.solidityPacked(
        ["bytes2", "bytes32", "bytes32"],
        [
          "0x1901",
          domainSeparator,
          ethers.keccak256(
            ethers.solidityPacked(
              ["bytes32", "bytes32"],
              [typeHash, ethers.keccak256(encodedData)]
            )
          )
        ]
      )
    );

    // Recover the signer
    const signature = ethers.Signature.from(data.signature);
    const recoveredAddress = ethers.verifyMessage(ethers.getBytes(hash), signature)

    // Verify the signer is correct
    const isSignerCorrect = recoveredAddress.toLowerCase() === ('owner' in data ? data.owner.toLowerCase() : data.bidder.toLowerCase())

    return isSignerCorrect
  } catch (error) {
    console.error('Error verifying signature:', error)

    return false
  }
}
