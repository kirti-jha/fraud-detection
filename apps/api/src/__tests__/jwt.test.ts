import { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

describe('JWT Utilities', () => {
  const payload = {
    userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    email: 'analyst@fraudshield.io',
    role: 'FRAUD_ANALYST' as const,
  };

  it('should generate and verify a valid access token', () => {
    const token = generateAccessToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('should generate and verify a valid refresh token', () => {
    const token = generateRefreshToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyRefreshToken(token);
    expect(decoded.userId).toBe(payload.userId);
  });
});
