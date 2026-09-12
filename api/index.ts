import dotenv from 'dotenv';
dotenv.config();

import appImport from '../backend/src/app';
import { connectDB } from '../backend/src/config/db';

const app: any = (appImport as any)?.default ?? appImport;

let isDbConnected = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isDbConnected) {
      await connectDB();
      isDbConnected = true;
    }
  } catch (err: any) {
    console.error('Database connection failed:', err.message);
  }
  return app(req, res);
}
