import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { WalletContextProvider } from './contexts/WalletContext';

// Import custom CSS
import './App.css';

function App() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <HomePage />
        </main>
        <footer className="bg-slate-800 text-white text-center py-4 mt-10">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} 4GroFlow - Olive Oil Supply Chain Tracker on Solana
          </p>
        </footer>
      </div>
    </WalletContextProvider>
  );
}

export default App;
