'use client';

import { useState } from 'react';
import { Search, ExternalLink, Home, ChevronRight } from 'lucide-react';
import { searchKnowledgeBase, searchFAQ, carbFAQ, carbOfficialResources } from '@/lib/carb-knowledge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FAQPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [faqResults, setFaqResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;

    // Priority 1: Search CARB official resources
    const kbResults = searchKnowledgeBase(query);
    setSearchResults(kbResults);

    // Search FAQ
    const faqMatches = searchFAQ(query);
    setFaqResults(faqMatches);

    setHasSearched(true);

    // TODO: Priority 2 & 3: Add blog search and web search here
    // if (kbResults.length === 0 && faqMatches.length === 0) {
    //   // Search blogs (Priority 2)
    //   // Then search web (Priority 3) with CARB context
    // }
  };

  const handleQuestionClick = (question: string) => {
    setQuery(question);
    const faqMatches = searchFAQ(question);
    setFaqResults(faqMatches);
    setSearchResults([]);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">CARB FAQ & Help</h1>
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
          <p className="text-gray-600">
            Pocket CARB – Never Call the Hotline Again
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* AI Search Bar */}
        <Card className="mb-8 border-2 border-green-500 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              Ask Anything About CARB Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., 'What does the DPF light mean?' or 'How often do I need testing?'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-lg py-6"
              />
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                Search
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              All searches are CARB-focused. Sources: CARB Official → Your Blogs → Web
            </p>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Search Results</h2>

            {/* FAQ Results */}
            {faqResults.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  Quick Answers
                </h3>
                <div className="space-y-3">
                  {faqResults.map((item, idx) => (
                    <Card key={idx} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {item.question}
                        </h4>
                        <p className="text-gray-700 mb-2">{item.answer}</p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge Base Results */}
            {searchResults.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  Official CARB Resources
                </h3>
                <div className="space-y-3">
                  {searchResults.map((item) => (
                    <Card key={item.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.length === 0 && faqResults.length === 0 && (
              <Card className="border-2 border-yellow-400">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-600">
                    No CARB-related results found. Try rephrasing your question or contact CARB
                    directly at{' '}
                    <a href="mailto:hdim@arb.ca.gov" className="text-blue-600 hover:underline">
                      hdim@arb.ca.gov
                    </a>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Popular Questions */}
        {!hasSearched && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Common Questions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {carbFAQ.slice(0, 6).map((item, idx) => (
                  <Card
                    key={idx}
                    className="cursor-pointer hover:border-green-500 transition-all hover:shadow-md"
                    onClick={() => handleQuestionClick(item.question)}
                  >
                    <CardContent className="pt-4">
                      <p className="font-medium text-gray-900 mb-2">{item.question}</p>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All FAQ Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Browse All Topics</h2>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {carbFAQ.map((item, idx) => (
                    <Card key={idx} className="border-l-4 border-l-gray-300">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                        <p className="text-gray-700 mb-2">{item.answer}</p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Official Resources */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Official CARB Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {carbOfficialResources.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                          <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Contact Section */}
        <Card className="bg-green-50 border-2 border-green-500">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Still Need Help?</h3>
            <p className="text-gray-700 mb-4">
              Contact CARB directly or call NorCal CARB for assistance
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:hdim@arb.ca.gov"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Email CARB: hdim@arb.ca.gov
              </a>
              <a
                href="tel:844-685-8922"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              >
                Call NorCal: 844-685-8922
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
