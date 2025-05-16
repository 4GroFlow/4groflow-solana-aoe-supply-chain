import { useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { NETWORK, COMMITMENT } from '../constants/solana';

// Import the wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // Set to 'devnet' for development
  const network = WalletAdapterNetwork.Devnet;

  // Initialize the available wallet adapters
  const wallets = useMemo(() => [
    // Preferimos Phantom y Solflare que son más estables con Anchor
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // Backpack puede tener problemas de compatibilidad con Anchor
    new BackpackWalletAdapter(),
  ], [network]);

  console.log("Wallet adapters initialized:", wallets.map(w => w.name));

  return (
    <ConnectionProvider endpoint={NETWORK} config={{ commitment: COMMITMENT }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}; 