import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '@fraudshield/shared-types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2),
  role: z.enum(['ADMIN', 'FRAUD_ANALYST', 'MERCHANT', 'USER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = registerSchema.parse(req.body);
      const result = await AuthService.registerUser(
        body.email,
        body.password,
        body.fullName,
        body.role
      );

      const response: ApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = loginSchema.parse(req.body);
      const result = await AuthService.loginUser(body.email, body.password);

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const body = refreshSchema.parse(req.body);
      const tokens = await AuthService.refreshSession(body.refreshToken);

      const response: ApiResponse = {
        success: true,
        message: 'Tokens refreshed successfully',
        data: tokens,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new Error('Unauthenticated'));
      }

      const user = await AuthService.getUserProfile(req.user.userId);

      const response: ApiResponse = {
        success: true,
        data: { user },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
