import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // Field presence check
        if (!email || !phone || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Strict email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address. Use a format like user@example.com.' });
        }

        // Strict phone validation (10–15 digits, optional leading +)
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'Invalid phone number. Include country code, e.g. +919876543210.' });
        }

        // Password strength
        if (password.length < 8 || !/[0-9]/.test(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters and contain a number.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        const newUser = new User({
            email,
            phone,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Create token
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: savedUser._id,
                email: savedUser.email,
                phone: savedUser.phone
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Validate email format before hitting the DB
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User with this email does not exist.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        (user as any).resetPasswordToken = resetToken;
        (user as any).resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email
        const resetUrl = `http://127.0.0.1:8080/reset-password/${resetToken}`;
        const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your CryptoPal Oracle account.</p>
            <p>Please click on the link below to reset your password. This link will expire in 1 hour.</p>
            <a href="${resetUrl}" target="_blank">${resetUrl}</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        try {
            await sendEmail(user.email, 'Password Reset Request', message);
            res.json({ message: 'Password reset link sent to your email.' });
        } catch (err) {
            (user as any).resetPasswordToken = undefined;
            (user as any).resetPasswordExpires = undefined;
            await user.save();
            res.status(500).json({ error: 'Email could not be sent. Please try again later.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during forgot password' });
    }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired password reset token.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        (user as any).resetPasswordToken = undefined;
        (user as any).resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been reset successfully. You can now login.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during password reset' });
    }
});

export default router;
