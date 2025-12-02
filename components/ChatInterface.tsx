'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { UserProfile } from '@/lib/agents/types';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentId?: string;
  agentName?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  sessionId: string;
  userId: string;
  userProfile: UserProfile | null;
  selectedAgent: string | null;
}

export default function ChatInterface({
  sessionId,
  userId,
  userProfile,
  selectedAgent,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          userId,
          userProfile,
          selectedAgent, // Pass selected agent to API
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        agentId: data.agentId,
        agentName: data.agentName,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
                <Bot className="w-16 h-16 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 animate-fade-in">
              Welcome to EduAgent
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg mb-8 leading-relaxed">
              Your intelligent multi-agent educational assistant. Get personalized help with courses, skills, assignments, and career guidance!
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                <div className="text-2xl mb-2">📚</div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Academic</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Course guidance</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                <div className="text-2xl mb-2">💻</div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Skills</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Learning paths</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Assignments</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Project help</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Career</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Job guidance</p>
              </div>
            </div>
          </div>
        )}
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex space-x-3 max-w-3xl ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div
                className={`rounded-xl px-5 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                {message.role === 'assistant' && message.agentName && (
                  <div className="text-xs font-medium mb-1 opacity-70">
                    {message.agentName}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-3xl">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-gray-600 dark:text-gray-300 animate-spin" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4">
        <div className="flex space-x-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your studies..."
            rows={1}
            className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all shadow-sm"
            style={{ minHeight: '52px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

