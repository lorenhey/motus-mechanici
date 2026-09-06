import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import MechanismDetail from './pages/MechanismDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper text-ink flex flex-col font-serif">
        <header className="border-b border-ink-light/20 py-6 px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Motus Mechanici</h1>
            <p className="text-ink-light text-sm italic mt-1">1800 mechanical movements brought back to motion.</p>
          </div>
          <nav>
            <a href="/" className="hover:text-accent transition-colors">Atlas</a>
          </nav>
        </header>
        
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/mechanisms/:id" element={<MechanismDetail />} />
          </Routes>
        </main>
        
        <footer className="py-6 text-center text-ink-light text-sm border-t border-ink-light/20">
          <p>Based on Gardner D. Hiscox's 1899 publication.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
