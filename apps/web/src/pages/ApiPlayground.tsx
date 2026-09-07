import React, { useState } from 'react';
import { fetchApi } from '../api/client';
import { Code, Send, Copy, Check, Clock } from 'lucide-react';

export const ApiPlayground: React.FC = () => {
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(
      {
        userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        amount: 85000,
        currency: 'INR',
        deviceId: 'DEV_SANDBOX_991',
        ipAddress: '103.44.12.99',
        location: 'Mumbai',
        merchantCategory: 'ECOMMERCE',
      },
      null,
      2
    )
  );

  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleSendRequest = async () => {
    try {
      const parsed = JSON.parse(payloadText);
      setLoading(true);
      const start = performance.now();

      const res = await fetchApi('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          ...parsed,
          idempotencyKey: `PLAYGROUND_${Date.now()}`,
        }),
      });

      const duration = Number((performance.now() - start).toFixed(1));
      setLatencyMs(duration);
      setResponse(res);
      setLoading(false);
    } catch (err: any) {
      setResponse({ success: false, error: err.message || 'Invalid JSON syntax' });
      setLoading(false);
    }
  };

  const curlCommand = `curl -X POST http://localhost:4000/api/v1/transactions \\
  -H "Content-Type: application/json" \\
  -H "X-Idempotency-Key: PLAYGROUND_${Date.now()}" \\
  -H "X-API-Key: fs_live_merchant_key_here" \\
  -d '${payloadText.replace(/\n/g, '')}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-[#26332E] pb-6">
        <h1 className="text-2xl font-bold text-[#F1F5F2] tracking-tight flex items-center space-x-3">
          <Code className="w-6 h-6 text-[#34D399]" />
          <span>Developer API Playground</span>
        </h1>
        <p className="text-[#9AA9A2] text-xs font-mono mt-1">Interactive API sandbox for testing real-time risk decisioning endpoints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Request Editor */}
        <div className="graphite-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#26332E] pb-3 font-mono">
            <span className="text-xs font-bold text-[#34D399] uppercase">POST /api/v1/transactions</span>
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="btn-primary text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Evaluating...' : 'Execute Request'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider mb-2 font-mono">
              JSON Request Body
            </label>
            <textarea
              rows={12}
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="w-full bg-[#0B0F0E] border border-[#26332E] rounded-lg p-4 font-mono text-xs text-[#34D399] focus:outline-none focus:border-[#10B981] leading-relaxed"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={copyCurl}
              className="w-full py-2 bg-[#0B0F0E] hover:bg-[#101615] border border-[#26332E] rounded-lg text-xs font-mono text-[#9AA9A2] hover:text-[#F1F5F2] flex items-center justify-center space-x-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-[#34D399]" /> : <Copy className="w-4 h-4 text-[#34D399]" />}
              <span>{copied ? 'cURL Copied to Clipboard!' : 'Copy cURL Command'}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Live Response Preview */}
        <div className="graphite-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#26332E] pb-3">
            <span className="text-xs font-bold uppercase text-[#F1F5F2]">Live API Response</span>
            {latencyMs !== null && (
              <span className="text-xs font-mono font-bold text-[#34D399] flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{latencyMs}ms</span>
              </span>
            )}
          </div>

          {!response ? (
            <div className="h-64 flex items-center justify-center text-xs text-[#6B7A72] italic font-mono">
              Click 'Execute Request' to test the risk engine API
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
                <pre className="text-xs font-mono text-[#34D399] overflow-x-auto max-h-96">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
