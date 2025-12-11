import { GoogleGenAI } from "@google/genai";
import { SimulationState } from "../types";

export const analyzeWithGemini = async (state: SimulationState): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Please set process.env.API_KEY to use Gemini Analysis.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert AI Robotics Engineer specializing in "Dialectical Praxi-Transformer Networks" (DPTN).
    
    Analyze the following robotic inference state based on the dialectical contradiction between Material Content (Object) and Social Context (Environment).
    
    **State Data:**
    - **Content (Object):** Fragility: ${state.content.fragility.toFixed(2)}, Weight: ${state.content.weight.toFixed(2)}, Size: ${state.content.size.toFixed(2)}
    - **Context (Environment):** Human Proximity: ${state.context.humanProximity.toFixed(2)}, Noise Level: ${state.context.noiseLevel.toFixed(2)}, Urgency: ${state.context.urgency.toFixed(2)}
    - **Resulting Praxis (Action):** Speed: ${state.praxis.speed.toFixed(2)}, Grip Force: ${state.praxis.gripForce.toFixed(2)}, Precision: ${state.praxis.precision.toFixed(2)}
    
    **Instructions:**
    1. Explain *why* the model chose this specific Praxis (action).
    2. Highlight the dialectical tension. For example, if urgency is high but fragility is high, how did the model resolve the contradiction? (e.g., did it sacrifice speed for safety?)
    3. Keep the response concise (under 150 words) and analytical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to connect to Gemini API for analysis.";
  }
};
