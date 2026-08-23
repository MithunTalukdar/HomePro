import mongoose from 'mongoose';
import { AuditLog } from '../models/AuditLog';

export const logAdminAction = async (
  adminId: string | mongoose.Types.ObjectId,
  adminName: string,
  action: string,
  targetId?: string | mongoose.Types.ObjectId,
  targetType?: string,
  details?: string
): Promise<void> => {
  try {
    await AuditLog.create({
      adminId,
      adminName,
      action,
      targetId,
      targetType,
      details,
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};
