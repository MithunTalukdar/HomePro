import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  action: string;
  targetId?: mongoose.Types.ObjectId;
  targetType?: string;
  details?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
    targetType: { type: String },
    details: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
