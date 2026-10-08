import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { sendEmail } from '../utils/sendEmail';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ message: 'Full name is required', field: 'name' });
      return;
    }
    if (!email || !email.trim()) {
      res.status(400).json({ message: 'Email address is required', field: 'email' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ message: 'Please enter a valid email address (e.g. name@example.com)', field: 'email' });
      return;
    }
    if (!phone || phone.trim().length < 10) {
      res.status(400).json({ message: 'Please enter a valid 10-digit phone number', field: 'phone' });
      return;
    }
    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long', field: 'password' });
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();
    const existingEmail = await User.findOne({ email: trimmedEmail });
    if (existingEmail) {
      res.status(400).json({ message: 'An account is already registered with this email address', field: 'email' });
      return;
    }

    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      res.status(400).json({ message: 'An account is already registered with this phone number', field: 'phone' });
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      passwordHash: password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken((user._id as any).toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user registration data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      res.status(400).json({ message: 'Please enter your email address', field: 'email' });
      return;
    }

    if (!password) {
      res.status(400).json({ message: 'Please enter your password', field: 'password' });
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      res.status(404).json({ 
        message: 'No account found with this email address. Please sign up or verify your email.',
        field: 'email'
      });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ 
        message: 'Invalid password. Please check your password and try again.',
        field: 'password'
      });
      return;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken((user._id as any).toString()),
    });
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
      message: 'If an account with that email exists, a password reset code and link have been sent.',
    };

    if (!user) {
      console.log(`[forgotPassword] No account found for email ${email}, returning generic success`);
      res.json(genericResponse);
      return;
    }

    const resetToken = user.getResetPasswordToken();
    const resetOtp = user.resetPasswordOtp || '123456';
    await user.save({ validateBeforeSave: false });

    // Determine the frontend URL dynamically from the request headers if available,
    // falling back to environment variable, then localhost.
    let requestOrigin = (req.headers.origin as string) || '';
    if (!requestOrigin && req.headers.referer) {
      try {
        requestOrigin = new URL(req.headers.referer as string).origin;
      } catch {
        // ignore malformed referer
      }
    }
    const frontendUrl = requestOrigin || process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const cleanFrontendUrl = frontendUrl.replace(/\/$/, '');
    const resetUrl = `${cleanFrontendUrl}/auth/reset-password?email=${encodeURIComponent(user.email)}&code=${resetOtp}&token=${resetToken}`;

    const message = `You requested a password reset for your HomePro account.\n\nYour 6-Digit Reset Code: ${resetOtp}\n\nReset Link: ${resetUrl}\n\nThis code and link are valid for 15 minutes. If you did not request this, please ignore this email.`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1120; color: #F8FAFC; padding: 36px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #F8FAFC; margin: 0; font-size: 24px; font-weight: 700;">Password Reset Request</h2>
          <p style="color: #94A3B8; font-size: 14px; margin-top: 8px;">HomePro Services & Electrician Platform</p>
        </div>

        <p style="color: #CBD5E1; line-height: 1.6; font-size: 15px;">
          Hello <strong>${user.name || 'there'}</strong>,
        </p>
        <p style="color: #94A3B8; line-height: 1.6; font-size: 14px;">
          We received a request to reset your password. Use the 6-digit verification code below to set a new password. Valid for <strong>15 minutes</strong>.
        </p>

        <!-- Prominent 6-Digit Code Box -->
        <div style="background: rgba(79, 70, 229, 0.12); border: 2px dashed #6366F1; border-radius: 12px; padding: 24px; margin: 28px 0; text-align: center;">
          <div style="font-size: 13px; color: #A5B4FC; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; font-weight: 600;">
            Your 6-Digit Reset Code
          </div>
          <div style="font-size: 40px; font-weight: 800; color: #FFFFFF; letter-spacing: 10px; font-family: monospace; text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);">
            ${resetOtp}
          </div>
          <p style="font-size: 12px; color: #94A3B8; margin-top: 10px; margin-bottom: 0;">
            Simply enter this code on the website to reset your password
          </p>
        </div>

        <!-- 1-Click Button -->
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #6366F1); color: #ffffff; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">
            Reset Password With 1-Click →
          </a>
        </div>

        <!-- Direct browser link -->
        <p style="color: #94A3B8; font-size: 13px; line-height: 1.5; word-break: break-all;">
          Or copy and paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color: #818CF8;">${resetUrl}</a>
        </p>

        <!-- Troubleshooting Note for Local Dev / Browser HTTPS redirect -->
        <div style="background: rgba(245, 158, 11, 0.08); border-left: 3px solid #F59E0B; padding: 12px 16px; border-radius: 6px; margin-top: 24px; text-align: left;">
          <p style="color: #FCD34D; font-size: 12px; margin: 0; line-height: 1.5;">
            💡 <strong>If your browser shows "This site can't be reached" when clicking the button:</strong><br/>
            This happens because Gmail links can force HTTPS redirect on localhost. Simply open <a href="${cleanFrontendUrl}/auth/reset-password" style="color: #FCD34D; font-weight: bold;">${cleanFrontendUrl}/auth/reset-password</a> in your browser, enter your email and the 6-digit code: <strong>${resetOtp}</strong>.
          </p>
        </div>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center; color: #64748B; font-size: 12px;">
          If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: `HomePro - Your Password Reset Code is ${resetOtp}`,
        text: message,
        html,
      });
      console.log(`[forgotPassword] Reset email sent to ${user.email} (code: ${resetOtp})`);
      res.json(genericResponse);
    } catch (emailError: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error(`[forgotPassword] Email send failed: ${emailError.message}`);
      res.status(500).json({ message: 'Email could not be sent. Please check SMTP settings and try again.' });
    }
  } catch (error: any) {
    console.error(`[forgotPassword] Error: ${error.message}`);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, otp, token, password, newPassword } = req.body;
    const rawToken = token || req.params.token || req.query.token;
    const rawCode = code || otp || req.query.code || req.query.otp;
    const finalPassword = password || newPassword;

    if (!finalPassword || finalPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    let user = null;

    // 1. If email + 6-digit code is provided
    if (email && rawCode) {
      const cleanEmail = String(email).toLowerCase().trim();
      const cleanCode = String(rawCode).trim();

      user = await User.findOne({
        email: cleanEmail,
        resetPasswordOtp: cleanCode,
        resetPasswordExpire: { $gt: new Date() },
      });

      if (!user) {
        // Check if token/code expired
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists && userExists.resetPasswordOtp && userExists.resetPasswordExpire && userExists.resetPasswordExpire < new Date()) {
          res.status(400).json({ message: 'The 6-digit reset code has expired (valid for 15 minutes). Please request a new code.' });
          return;
        }
        res.status(400).json({ message: 'Invalid reset code or email. Please check the 6-digit code in your email.' });
        return;
      }
    } 
    // 2. If token is provided
    else if (rawToken) {
      const cleanToken = String(rawToken).trim();

      // Check if user accidentally pasted their email into the token field!
      if (cleanToken.includes('@')) {
        res.status(400).json({ 
          message: 'It looks like you entered an email address into the code/token field. Please enter the 6-digit code sent to your email.' 
        });
        return;
      }

      // Check if the cleanToken is a 6-digit code
      if (/^\d{6}$/.test(cleanToken)) {
        user = await User.findOne({
          resetPasswordOtp: cleanToken,
          resetPasswordExpire: { $gt: new Date() },
        });
      }

      if (!user) {
        const hashedToken = crypto.createHash('sha256').update(cleanToken).digest('hex');
        user = await User.findOne({
          resetPasswordToken: hashedToken,
          resetPasswordExpire: { $gt: new Date() },
        });
      }

      if (!user) {
        res.status(400).json({ 
          message: 'Invalid or expired password reset link/token. Please request a new reset email.' 
        });
        return;
      }
    } 
    // 3. If just the 6-digit code was provided without email
    else if (rawCode) {
      const cleanCode = String(rawCode).trim();
      user = await User.findOne({
        resetPasswordOtp: cleanCode,
        resetPasswordExpire: { $gt: new Date() },
      });

      if (!user) {
        res.status(400).json({ 
          message: 'Invalid or expired 6-digit code. Please verify the code in your email or request a new one.' 
        });
        return;
      }
    } else {
      res.status(400).json({ message: 'Please provide your email and the 6-digit verification code.' });
      return;
    }

    // Save the new password
    user.passwordHash = finalPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully! You can now log in with your new password.' });
  } catch (error: any) {
    console.error(`[resetPassword] Error: ${error.message}`);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
