import { Request, Response } from 'express';
import { MockAIProvider } from '../services/MockAIProvider';

// We can inject different providers here in the future
const aiService = new MockAIProvider();

export const handleAIRequest = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = await aiService.analyzeRequest(message);
    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
