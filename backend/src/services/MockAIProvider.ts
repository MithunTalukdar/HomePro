import { IAIService, AIResponse } from './IAIService';

export class MockAIProvider implements IAIService {
  
  async analyzeRequest(message: string): Promise<AIResponse> {
    const text = message.toLowerCase();


    if (text.includes('diy') || text.includes('how to fix') || text.includes('open the panel') || text.includes('bare wires')) {
      return {
        recommendedCategory: null,
        suggestedResponse: 'Electrical repairs can be extremely dangerous. Please do not attempt hazardous DIY repairs. Would you like me to find a certified professional to help you?',
        isHazardous: true
      };
    }


    if (text.includes('fan')) {
      return {
        recommendedCategory: 'Fan Repair & Installation',
        suggestedResponse: 'Your issue may require Fan Repair. Would you like to find an available technician?',
        isHazardous: false
      };
    }

    if (text.includes('light') || text.includes('bulb') || text.includes('switch')) {
      return {
        recommendedCategory: 'Lighting',
        suggestedResponse: 'It sounds like you need help with Lighting or Switches. Let me guide you to the right service.',
        isHazardous: false
      };
    }

    if (text.includes('wiring') || text.includes('short') || text.includes('spark') || text.includes('fuse')) {
      return {
        recommendedCategory: 'Wiring & Panels',
        suggestedResponse: 'This sounds like a serious electrical issue involving wiring or panels. Please stay safe and let me find a professional for you immediately.',
        isHazardous: true
      };
    }


    return {
      recommendedCategory: 'General Assessment',
      suggestedResponse: 'I can help you find a professional for that. Would you like to browse our services or find an electrician nearby?',
      isHazardous: false
    };
  }
}
