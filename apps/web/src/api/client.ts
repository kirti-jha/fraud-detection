const API_BASE = '/api/v1';

export const fetchApi = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; meta?: any }> => {
  const token = localStorage.getItem('fraudshield_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network request failed',
    };
  }
};
