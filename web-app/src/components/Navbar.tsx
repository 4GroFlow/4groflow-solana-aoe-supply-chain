import type { FC } from 'react';
import { WalletConnect } from './WalletConnect';

export const Navbar: FC = () => {
  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">🫒 4GroFlow</span>
          <span className="text-sm text-slate-400">Olive Oil Supply Chain</span>
        </div>
        <WalletConnect />
      </div>
    </nav>
  );
}; 