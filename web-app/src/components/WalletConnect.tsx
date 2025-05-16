import type { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnect: FC = () => {
  const { wallet, publicKey, connected, disconnect } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      <WalletMultiButton />
      {connected && (
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            <p className="text-green-500 font-semibold">Connected</p>
            <p className="text-xs truncate max-w-[150px]">{publicKey?.toString()}</p>
          </div>
          <button
            onClick={() => disconnect()}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
            title="Desconectar wallet"
          >
            Desconectar
          </button>
        </div>
      )}
    </div>
  );
}; 