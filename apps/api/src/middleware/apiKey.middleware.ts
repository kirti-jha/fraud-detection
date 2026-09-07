import { Request, Response, NextFunction } from 'express';
import { MerchantService, IMerchant } from '../services/merchant.service';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

export interface FlexibleAuthRequest extends Request {
  merchant?: IMerchant;
  user?: TokenPayload;
}

export const authenticateApiKeyOrJwt = async (
  req: FlexibleAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const apiKeyHeader = req.headers['x-api-key'] as string;
  const authHeader = req.headers.authorization;

  // 1. Try API Key Authentication (Merchant Server-to-Server)
  if (apiKeyHeader) {
    try {
      const merchant = await MerchantService.validateApiKey(apiKeyHeader);
      req.merchant = merchant;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  // 2. Try JWT Bearer Authentication (Analyst/User Session)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      return next();
    } catch (error) {
      return next(new AppError('Invalid or expired access token', 401));
    }
  }

  return next(new AppError('Authentication required (Provide X-API-Key or Bearer Token)', 401));
};
