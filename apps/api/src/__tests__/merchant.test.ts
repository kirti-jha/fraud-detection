import { MerchantService } from '../services/merchant.service';

describe('Merchant API Key Service', () => {
  it('should hash API keys consistently', () => {
    const rawKey = 'fs_live_abcdef123456789';
    const hash1 = MerchantService.hashApiKey(rawKey);
    const hash2 = MerchantService.hashApiKey(rawKey);

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(rawKey);
  });
});
