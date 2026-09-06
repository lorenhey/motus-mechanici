import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

interface LiveMathProps {
  equation: string; // The LaTeX equation template
  state: Record<string, number>;
}

export default function LiveMath({ equation, state }: LiveMathProps) {
  // Replace placeholders in the equation like {{x}} with actual formatted values
  let liveEq = equation;
  for (const [key, value] of Object.entries(state)) {
    // Format to 2 decimal places if it's not an integer
    const valStr = Number.isInteger(value) ? value.toString() : value.toFixed(2);
    // Simple regex to replace {{key}}
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    liveEq = liveEq.replace(regex, valStr);
  }

  return (
    <div className="my-4 p-4 bg-paper rounded border border-ink-light/20">
      <BlockMath math={liveEq} />
    </div>
  );
}
