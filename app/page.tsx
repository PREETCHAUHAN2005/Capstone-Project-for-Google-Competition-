'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from '@/lib/agents/types';

// Dynamically import components to avoid hydration issues
const ChatInterface = dynamic(() => import('@/components/ChatInterface'), { ssr: false });
const AgentDashboard = dynamic(() => import('@/components/AgentDashboard'), { ssr: false });
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const Header = dynamic(() => import('@/components/Header'), { ssr: false });

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize client-side only state
  useEffect(() => {
    setMounted(true);
    
    // Initialize userId
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newId = uuidv4();
        localStorage.setItem('userId', newId);
        setUserId(newId);
      }

      // Initialize dark mode
      const storedDarkMode = localStorage.getItem('darkMode');
      if (storedDarkMode === 'true') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode, mounted]);

  useEffect(() => {
    if (!mounted || !userId || typeof window === 'undefined') return;

    const createSession = async () => {
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, userProfile }),
        });
        if (!response.ok) throw new Error('Failed to create session');
        const data = await response.json();
        setSessionId(data.sessionId);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    };

    if (!sessionId) {
      createSession();
    }
  }, [userId, userProfile, sessionId, mounted]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading EduAgent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <Sidebar
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userProfile={userProfile}
          onUpdateProfile={setUserProfile}
          darkMode={darkMode}
        />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            {sessionId && (
              <ChatInterface
                sessionId={sessionId}
                userId={userId}
                userProfile={userProfile}
                selectedAgent={selectedAgent}
              />
            )}
          </div>
          <AgentDashboard selectedAgent={selectedAgent} />
        </div>
      </div>
    </div>
  );
}

