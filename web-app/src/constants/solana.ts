import { PublicKey, clusterApiUrl } from '@solana/web3.js';

// Program ID - the address of our deployed Solana program
export const PROGRAM_ID = new PublicKey('75Y6LyCnaUGwWu7GyDkVTrYBdDw9USyYRkoqEx9Xd43c');

// Network configuration
export const NETWORK = clusterApiUrl('devnet');

// Other constants
export const COMMITMENT = 'confirmed'; 