import { DPTNInputs, DPTNContext, DPTNPraxis } from '../types';

/**
 * A lightweight TypeScript implementation of the RobotDPTN PyTorch logic.
 * Simulates the Matrix Multiplications and Activation functions.
 */
export class DPTNModel {
  // Mock Weights
  private wContent: number[][]; // [3 -> 16]
  private wContext: number[][]; // [3 -> 16]
  private wHidden: number[][];  // [16 -> 8]
  private wPraxis: number[][];  // [8 + 3 -> 3]

  constructor() {
    // Initialize random weights deterministically-ish
    this.wContent = this.initWeights(3, 16);
    this.wContext = this.initWeights(3, 16);
    this.wHidden = this.initWeights(16, 8);
    // Praxis layer takes Content (3) + V_contextual (8) = 11 inputs, outputs 3 praxis dims
    this.wPraxis = this.initWeights(11, 3);
  }

  private initWeights(inDim: number, outDim: number): number[][] {
    const weights: number[][] = [];
    for (let i = 0; i < inDim; i++) {
      const row: number[] = [];
      for (let j = 0; j < outDim; j++) {
        row.push((Math.random() - 0.5) * 2); // Random between -1 and 1
      }
      weights.push(row);
    }
    return weights;
  }

  private relu(vec: number[]): number[] {
    return vec.map(v => Math.max(0, v));
  }

  private sigmoid(vec: number[]): number[] {
    return vec.map(v => 1 / (1 + Math.exp(-v)));
  }

  private matMul(input: number[], weights: number[][]): number[] {
    const outDim = weights[0].length;
    const output = new Array(outDim).fill(0);
    
    for (let j = 0; j < outDim; j++) {
      for (let i = 0; i < input.length; i++) {
        output[j] += input[i] * weights[i][j];
      }
    }
    return output;
  }

  public forward(content: DPTNInputs, context: DPTNContext): { 
    praxis: DPTNPraxis; 
    vContextual: number[]; 
    rawOutput: number[] 
  } {
    // Flatten inputs
    const contentVec = [content.fragility, content.weight, content.size];
    const contextVec = [context.humanProximity, context.noiseLevel, context.urgency];

    // --- 1. Módulo de Contextualización (Motor Dialéctico) ---
    // In original code: input = cat(content, context)
    // Here we simulate separate projections summed up (equivalent to linear layer on concat)
    const h1Content = this.matMul(contentVec, this.wContent);
    const h1Context = this.matMul(contextVec, this.wContext);
    
    // Sum and ReLU (Simulating fc1 -> relu)
    const h1 = h1Content.map((v, i) => Math.max(0, v + h1Context[i]));
    
    // Hidden -> Output (V_contextual)
    // Reducing dimensionality for visual clarity (8 dims)
    const vContextualRaw = this.matMul(h1, this.wHidden);
    const vContextual = vContextualRaw.map(v => Math.tanh(v)); // Tanh for clearer range -1 to 1

    // --- 2. Praxis Layer ---
    // Input: Concat(contentVec, vContextual)
    const praxisInput = [...contentVec, ...vContextual];
    
    // Dense Layer
    const praxisRaw = this.matMul(praxisInput, this.wPraxis);
    
    // Sigmoid to bound outputs to 0-1 for visualization sliders
    const praxis = this.sigmoid(praxisRaw);

    return {
      praxis: {
        speed: praxis[0],
        gripForce: praxis[1],
        precision: praxis[2]
      },
      vContextual: vContextual,
      rawOutput: praxisRaw
    };
  }
}
