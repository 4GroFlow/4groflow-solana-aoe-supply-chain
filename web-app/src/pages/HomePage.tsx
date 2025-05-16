import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProgram } from '../hooks/useAnchorProgram';

export const HomePage: FC = () => {
  const { connected, publicKey } = useWallet();
  const { createMessage, loading, error, isProgramInitialized } = useAnchorProgram();
  const [message, setMessage] = useState('');
  const [successTx, setSuccessTx] = useState<string | null>(null);
  const [programReady, setProgramReady] = useState(false);

  // Monitoreamos si el programa está inicializado
  useEffect(() => {
    const ready = isProgramInitialized();
    console.log("Program initialization check:", ready);
    setProgramReady(ready);
  }, [isProgramInitialized, connected, publicKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    console.log("Submitting message:", message.trim());
    console.log("Program ready state:", programReady);
    
    // Si el programa no está listo, mostramos un mensaje
    if (!programReady) {
      console.log("Program not ready, but proceeding anyway...");
    }
    
    try {
      const result = await createMessage(message.trim());
      
      if (result) {
        console.log("Message created successfully:", result);
        setSuccessTx(result.tx);
        setMessage(''); // Clear the form
      } else {
        console.error("No result returned from createMessage");
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Olive Oil Supply Chain Tracker</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Record a Supply Chain Event</h2>
        
        {!connected ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
            <p className="text-yellow-700">Please connect your wallet to interact with the blockchain.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!programReady && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <p className="text-blue-700">
                  Inicializando conexión con la blockchain... Si persisten los problemas, intenta reconectar tu wallet.
                </p>
              </div>
            )}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Event Description
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="Describe the supply chain event (e.g., 'Harvested 500kg of olives from Farm Los Olivos')"
                disabled={loading}
                maxLength={280}
              />
              <p className="text-sm text-gray-500 mt-1">
                {message.length}/280 characters
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Recording on blockchain...' : 'Record on Blockchain'}
            </button>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mt-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {successTx && (
              <div className="bg-green-50 border border-green-200 rounded p-4 mt-4">
                <p className="text-green-700 font-medium">Event successfully recorded on the blockchain!</p>
                <p className="text-sm mt-1">
                  Transaction ID:{' '}
                  <a 
                    href={`https://explorer.solana.com/tx/${successTx}?cluster=devnet`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {successTx}
                  </a>
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}; 