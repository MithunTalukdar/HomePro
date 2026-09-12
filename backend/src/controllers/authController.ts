import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { sendEmail } from '../utils/sendEmail';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      res.status(400).json({ message: 'User already exists with that email or phone' });
      return;
    }

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id as string),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id as string),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Please provide an email address' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });


    const genericResponse = {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };

    if (!user) {
      console.log(`[forgotPassword] No account found for email domain, returning generic success`);
      res.json(genericResponse);
      return;
    }


    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });


    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/auth/reset-password?token=${resetToken}`;

    const message = `You requested a password reset for your ServeSync account.\n\nPlease click the link below to reset your password (valid for 15 minutes):\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1120; color: #F8FAFC; padding: 32px; border-radius: 12px;">
        <h2 style="color: #F8FAFC; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="color: #94A3B8; line-height: 1.6;">You requested a password reset for your <strong>ServeSync</strong> account.</p>
        <p style="color: #94A3B8; line-height: 1.6;">Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6D5DFB, #4F46E5); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
        </div>
        <p style="color: #94A3B8; font-size: 13px; word-break: break-all;">Or copy this link: <a href="${resetUrl}" style="color: #8B7CFF;">${resetUrl}</a></p>
        <p style="color: #64748B; font-size: 12px; margin-top: 24px; border-top: 1px solid rgba(148,163,184,0.15); padding-top: 16px;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'ServeSync - Password Reset Link',
        text: message,
        html,
      });
      console.log(`[forgotPassword] Reset email sent to ${user.email} resetUrl generated`);
      res.json(genericResponse);
    } catch (emailError: any) {

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error(`[forgotPassword] Email send failed: ${emailError.message}`);
      res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
    }
  } catch (error: any) {
    console.error(`[forgotPassword] Error: ${error.message}`);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};




export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password, newPassword } = req.body;
    const rawToken = token || req.params.token || req.query.token;
    const finalPassword = password || newPassword;

    if (!rawToken) {
      res.status(400).json({ message: 'Reset token is required' });
      return;
    }
    if (!finalPassword || finalPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(String(rawToken)).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }


    user.passwordHash = finalPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (error: any) {
    console.error(`[resetPassword] Error: ${error.message}`);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
