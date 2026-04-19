"use client";
import { useState } from "react";

export default function DAOGovernance() {
  const [proposal, setProposal] = useState("");
  const [dao, setDao] = useState("unifiedao");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!proposal.trim()) { setError("Please enter the DAO proposal text or ID."); return; }
    setLoading(true); setError(""); setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal, dao }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "No response received.");
    } catch { setError("Analysis failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <span className="text-blue-400 text-xl">🏛️</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">DAO Governance Analyzer</h1>
          </div>
          <p className="text-gray-400 text-sm">AI-powered governance proposal analysis &amp; voting recommendations</p>
        </header>

        <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">DAO</label>
            <select
              className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-gray-100 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors"
              value={dao} onChange={(e) => setDao(e.target.value)}
            >
              <option value="unifiedao">Uniswap</option>
              <option value="aave">Aave</option>
              <option value="compound">Compound</option>
              <option value="nouns">Nouns</option>
              <option value="gitcoin">Gitcoin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Proposal Text / ID</label>
            <textarea
              className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-gray-100 text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors"
              rows={6}
              placeholder="Paste the full proposal text or ID here..."
              value={proposal} onChange={(e) => setProposal(e.target.value)}
            />
          </div>
          {error && <div className="bg-red-900/20 border border-red-700/40 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
          <button
            onClick={analyze} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><span className="animate-spin">⏳</span> Analyzing...</> : <><span>🏛️</span> Analyze Proposal</>}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Governance Analysis</h2>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">{result}</pre>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-600 text-xs">Powered by DeepSeek AI · DYOR on all proposals</footer>
      </div>
    </main>
  );
}
