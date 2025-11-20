'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';

export default function FindAnswerPage() {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMsg = { role: 'user' as const, text: question };
    setChat((c) => [...c, userMsg]);
    setQuestion('');
    setIsLoading(true);

    // Simulate AI response (replace with actual Genkit AI call)
    setTimeout(() => {
      const botMsg = {
        role: 'bot' as const,
        text: `I'll help answer your question: "${userMsg.text}"\n\nThis AI feature is currently in development. For immediate assistance, please contact us directly at (916) 890-4427 or support@norcalcarbmobile.com.`,
      };
      setChat((c) => [...c, botMsg]);
      setIsLoading(false);
    }, 1000);
  };

  const suggestedQuestions = [
    'What is CARB compliance?',
    'Do I need a DPF filter for my 2018 truck?',
    'What are the testing requirements?',
    'How often do I need testing?',
    'What documents do I need for compliance?',
  ];

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

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A3C5E] mb-3">
          Find an Answer (AI Assistant)
        </h1>
        <p className="text-gray-600 text-lg">
          Get instant answers to your CARB compliance questions
        </p>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          <span>CARB Bot Assistant</span>
        </h2>

        {/* Chat Messages */}
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
          {chat.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                Ask me anything about CARB compliance
              </p>
              <p className="text-gray-400 text-sm">
                Start by typing a question below or select a suggested question
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#00A651] text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendQuestion()}
            placeholder="Ask a question about CARB compliance..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00A651] focus:outline-none transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={sendQuestion}
            disabled={isLoading || !question.trim()}
            className="bg-[#00A651] hover:bg-[#008f47] text-white p-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-[#1A3C5E] mb-4">
          Popular Questions
        </h3>
        <div className="space-y-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setQuestion(q)}
              className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 border border-gray-200"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border-l-4 border-[#00A651] p-6 rounded mt-6">
        <h3 className="font-bold text-[#1A3C5E] mb-2">
          Need More Help?
        </h3>
        <p className="text-gray-700 mb-3">
          For complex questions or immediate assistance, contact our expert team directly.
        </p>
        <Link
          href="/contact"
          className="text-[#00A651] font-semibold hover:text-[#008f47] transition-colors"
        >
          Contact Us →
        </Link>
      </div>
    </div>
  );
}
