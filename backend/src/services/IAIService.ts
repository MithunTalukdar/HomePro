export interface IAIService {
  analyzeRequest(message: string): Promise<AIResponse>;
}

export interface AIResponse {
  recommendedCategory: string | null;
  suggestedResponse: string;
  isHazardous: boolean;
}
