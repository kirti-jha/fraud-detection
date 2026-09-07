import { hashPassword, comparePassword } from '../utils/password';

describe('Password Hashing Utilities', () => {
  it('should hash a password and compare correctly', async () => {
    const password = 'SecurePassword123!';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);

    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await comparePassword('WrongPassword', hash);
    expect(isInvalid).toBe(false);
  });
});
