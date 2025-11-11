'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Send } from 'lucide-react';

export default function Home() {
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
    <>
      {/* ── Main Dashboard ───────────────────────────────────── */}
      <div className="min-h-screen bg-gray-50 p-4">
        <h1 className="mb-6 text-2xl font-bold text-center text-primary">
          CARB‑Simple
        </h1>

        {/* Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button onClick={() => setLogOpen(true)} size="lg">
            Log
          </Button>
          <Button onClick={() => setAskOpen(true)} size="lg" variant="outline">
            Ask
          </Button>
        </div>

        {/* Real‑time log list */}
        <ScrollArea className="h-[calc(100vh-220px)]">
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No logs yet – start by tapping “Log”.
            </p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="pt-4">
                    <p className="text-sm">{log.raw}</p>
                    {log.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.createdAt.toDate()).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── Log Dialog ─────────────────────────────────────── */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Type or speak… (e.g. “420 mi Sacramento → Long Beach, 75 gal”)"
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              autoFocus
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // Simple voice‑to‑text placeholder – replace with Capacitor plugin
                alert('Voice input coming soon!');
              }}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={saveLog}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Ask Chat Dialog ─────────────────────────────────── */}
      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ask CARB Bot</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-64 mb-4">
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
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="What are the DPF rules for a 2018 rig?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendQuestion()}
            />
            <Button onClick={sendQuestion} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
