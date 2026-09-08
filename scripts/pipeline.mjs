import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI();

const PATH = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));

// Schema definition for the LLM
const mechanismSchema = {
  type: "object",
  properties: {
    families: { type: "array", items: { type: "string" } },
    parameters: { 
      type: "array", 
      items: { 
        type: "object", 
        properties: { id: { type: "string" }, label: { type: "string" }, value: { type: "number" }, unit: { type: "string" } } 
      } 
    },
    variables: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, label: { type: "string" }, unit: { type: "string" } }
      }
    },
    visuals: {
      type: "array",
      items: {
        type: "object",
        properties: { type: { type: "string" }, p1: { type: "string" }, p2: { type: "string" }, color: { type: "string" }, radius: { type: "string" }, angle: { type: "string" } }
      }
    },
    solver: {
      type: "object",
      properties: { type: { type: "string", enum: ['CRANK_SLIDER', 'FOUR_BAR', 'DIRECT', 'SIMPLE_GEAR', 'BELT_PULLEY', 'PLANETARY_GEAR', 'RACK_PINION', 'CAM_FOLLOWER', 'SCOTCH_YOKE', 'SCREW', 'INTERMITTENT', 'ESCAPEMENT'] } }
    },
    equations: { type: "array", items: { type: "string" } },
    fidelity: { type: "string", enum: ["KINEMATICALLY_RECONSTRUCTED", "STATIC"] }
  }
};

async function processMechanisms() {
  const staticEntries = data.filter(e => e.fidelity === 'STATIC');
  console.log(`Found ${staticEntries.length} STATIC mechanisms. Processing batch...`);
  
  for (const entry of staticEntries) { // Process all remaining
    console.log(`\nProcessing ${entry.id}: ${entry.title}`);
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are an expert mechanical engineer. Design a kinematic model for the following historical mechanism:
Title: ${entry.originalTitle}
Description: ${entry.originalDescription}

Available solvers: CRANK_SLIDER, FOUR_BAR, DIRECT, SIMPLE_GEAR, BELT_PULLEY, PLANETARY_GEAR, RACK_PINION, CAM_FOLLOWER, SCOTCH_YOKE, SCREW, INTERMITTENT, ESCAPEMENT.
If the mechanism is a static object (like a boiler or battery) or too complex for these solvers, set fidelity to "STATIC".
Otherwise, set fidelity to "KINEMATICALLY_RECONSTRUCTED" and provide the parameters, variables, visuals, solver, and equations (LaTeX).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: mechanismSchema,
          temperature: 0.2
        }
      });
      
      const result = JSON.parse(response.text);
      
      if (result.fidelity === 'KINEMATICALLY_RECONSTRUCTED') {
        Object.assign(entry, result);
        console.log(`✅ Reconstructed ${entry.id}`);
        // Save incrementally
        fs.writeFileSync(PATH, JSON.stringify(data, null, 2));
      } else {
        console.log(`⏭️ Skipped ${entry.id} (Remains STATIC)`);
      }
      
      // Rate limiting wait
      await new Promise(r => setTimeout(r, 4000));
      
    } catch (err) {
      console.error(`Failed to process ${entry.id}:`, err.message);
    }
  }
}

processMechanisms();
