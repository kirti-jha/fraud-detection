const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

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

    const contentType = res.headers.get('content-type') || '';
    let data: any;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = {
        error: res.status === 404
          ? 'Backend API endpoint not found (404).'
          : text.substring(0, 100) || `HTTP ${res.status}: ${res.statusText}`
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${res.status}: ${res.statusText}`,
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
