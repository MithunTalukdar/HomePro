import { Request, Response } from 'express';
import { ServiceCategory, Service } from '../models/Service';

// @route   GET /api/services/categories
export const getServiceCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await ServiceCategory.find({ isActive: true });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/services
export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ isActive: true }).populate('category', 'name');
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/services/:id
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id).populate('category', 'name');
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
