export interface DPTNInputs {
  fragility: number; // 0-1
  weight: number;    // 0-1
  size: number;      // 0-1
  [key: string]: number;
}

export interface DPTNContext {
  humanProximity: number; // 0-1
  noiseLevel: number;     // 0-1
  urgency: number;        // 0-1
  [key: string]: number;
}

export interface DPTNPraxis {
  speed: number;      // 0-1
  gripForce: number;  // 0-1
  precision: number;  // 0-1
}

export interface SimulationState {
  content: DPTNInputs;
  context: DPTNContext;
  praxis: DPTNPraxis;
  vectors: {
    vContextual: number[];
    rawOutput: number[];
  };
}

export interface TrainingMetric {
  epoch: number;
  totalLoss: number;
  materialLoss: number;
  dialecticalLoss: number;
}