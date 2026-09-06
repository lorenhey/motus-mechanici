import { Link } from 'react-router-dom';
import catalog from '../data/catalog.json';

export default function Catalog() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 font-serif border-b border-ink-light/20 pb-4">Index of Mechanisms</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {catalog.map(entry => (
          <Link 
            key={entry.id} 
            to={`/mechanisms/${entry.id}`}
            className="group block p-5 bg-white border border-ink-light/20 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="text-ink-light font-mono text-xs mb-2">{entry.id}</div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{entry.title}</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {entry.families.map(f => (
                <span key={f} className="text-[10px] uppercase tracking-wider bg-paper px-2 py-1 text-ink-light">
                  {f}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
