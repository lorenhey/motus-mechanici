import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import catalog from '../data/catalog.json';
import MechanismViewer from '../components/MechanismViewer';
import type { MechanismDefinition } from '../engine/types';

export default function MechanismDetail() {
  const { id } = useParams();
  
  // Find in catalog (needs cast because JSON isn't strictly typed automatically yet)
  const entry = catalog.find(e => e.id === id) as unknown as MechanismDefinition;

  if (!entry) {
    return <div className="p-8">Mechanism not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-ink-light hover:text-accent mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Atlas
      </Link>
      
      <header className="mb-8 border-b border-ink-light/20 pb-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-bold font-serif">{entry.title}</h2>
          <span className="font-mono text-ink-light text-sm">{entry.id}</span>
        </div>
        <div className="mt-2 text-ink-light text-sm">
          Source: Hiscox ({entry.source.edition}), Page {entry.source.page}
          {entry.source.figureNumber && `, Fig. ${entry.source.figureNumber}`}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <MechanismViewer def={entry} />
        </div>
        
        <div className="prose prose-stone">
          <h3 className="text-xl font-bold mb-4 font-serif border-b border-ink-light/20 pb-2">Description</h3>
          <p className="text-ink">{entry.source.originalDescription}</p>
          
          <h3 className="text-xl font-bold mt-8 mb-4 font-serif border-b border-ink-light/20 pb-2">Analysis</h3>
          <p>
            <strong>Fidelity:</strong> <span className="font-mono text-xs">{entry.fidelity}</span><br />
            <strong>Degrees of Freedom:</strong> {entry.degreesOfFreedom}
          </p>
          {entry.assumptions && entry.assumptions.length > 0 && (
            <div className="mt-4">
              <strong>Assumptions:</strong>
              <ul className="list-disc pl-5 mt-2">
                {entry.assumptions.map((a: string, i: number) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
