import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Payment } from '../models/Payment';
import { Booking } from '../models/Booking';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_123',
});

// @route   POST /api/payments/create-order
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/payments/verify
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amount } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_123';
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      const payment = await Payment.create({
        bookingId,
        userId: req.user!._id,
        amount,
        currency: 'INR',
        paymentMethod: 'RAZORPAY',
        provider: 'Razorpay',
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'SUCCESS'
      });

      // Update Booking
      await Booking.findByIdAndUpdate(bookingId, { 
        $set: { paymentStatus: 'PAID' },
        $push: { statusHistory: { status: 'PAID', timestamp: new Date() } } 
      });

      res.json({ message: 'Payment verified successfully', payment });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
