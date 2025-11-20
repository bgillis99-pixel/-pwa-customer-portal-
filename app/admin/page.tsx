'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Mic, Send } from 'lucide-react';
import PasswordProtection from '@/app/components/PasswordProtection';

export default function AdminPage() {
  return (
    <PasswordProtection>
      <AdminContent />
    </PasswordProtection>
  );
}

function AdminContent() {
  // ── Log dialog ─────────────────────────────────────
  const [logOpen, setLogOpen] = useState(false);
  const [logText, setLogText] = useState('');

  // ── Ask chat ───────────────────────────────────────
  const [askOpen, setAskOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);

  // ── Firestore real‑time logs ───────────────────────
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'logs'), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLogs(data);
    });
    return () => unsub();
  }, []);

  // ── Save a raw log entry (Genkit flow will parse later) ──
  const saveLog = async () => {
    if (!logText.trim()) return;
    await addDoc(collection(db, 'logs'), {
      raw: logText,
      createdAt: serverTimestamp(),
    });
    setLogText('');
    setLogOpen(false);
  };

  // ── Placeholder for Ask flow (replace with Genkit call) ──
  const sendQuestion = async () => {
    if (!question.trim()) return;
    const userMsg = { role: 'user' as const, text: question };
    setChat((c) => [...c, userMsg]);
    // TODO: call askCarbFlow → replace with real answer
    const botMsg = { role: 'bot' as const, text: `Answer for: ${question}` };
    setChat((c) => [...c, botMsg]);
    setQuestion('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#1A3C5E] hover:text-[#00A651] mb-6 font-semibold transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Home</span>
      </Link>

      {/* Admin Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A3C5E] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage logs and monitor activity
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 max-w-md mx-auto">
        <button
          onClick={() => setLogOpen(true)}
          className="bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-lg"
        >
          Log Entry
        </button>
        <button
          onClick={() => setAskOpen(true)}
          className="bg-[#1A3C5E] hover:bg-[#152e49] text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-lg"
        >
          Ask CARB Bot
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-[#1A3C5E] mb-4">
          Recent Activity
        </h2>
        <div className="max-h-[500px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                No logs yet
              </p>
              <p className="text-gray-400 text-sm">
                Start by creating a new log entry
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="border border-gray-200 hover:border-[#00A651] transition-colors rounded-lg p-4"
                >
                  <p className="text-sm text-gray-800 mb-2">{log.raw}</p>
                  {log.createdAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(log.createdAt.toDate()).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Dialog */}
      {logOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#1A3C5E] mb-4">Log Entry</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Type or speak… (e.g. "420 mi Sacramento → Long Beach, 75 gal")"
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveLog()}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors"
                autoFocus
              />
              <button
                onClick={() => alert('Voice input coming soon!')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Mic className="h-5 w-5" />
                <span>Voice Input (Coming Soon)</span>
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setLogOpen(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveLog}
                className="flex-1 bg-[#00A651] hover:bg-[#008f47] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Dialog */}
      {askOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-[#1A3C5E] mb-4">Ask CARB Bot</h3>
            <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 ${
                      msg.role === 'user'
                        ? 'bg-[#00A651] text-white'
                        : 'bg-white border-2 border-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="What are the DPF rules for a 2018 rig?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendQuestion()}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors"
              />
              <button
                onClick={sendQuestion}
                className="bg-[#00A651] hover:bg-[#008f47] text-white p-3 rounded-lg transition-colors"
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
            <button
              onClick={() => setAskOpen(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
