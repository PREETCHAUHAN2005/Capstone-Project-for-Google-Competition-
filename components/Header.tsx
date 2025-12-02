'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { GraduationCap, User, Sparkles } from 'lucide-react';
import { UserProfile } from '@/lib/agents/types';

const ProfileModal = dynamic(() => import('./ProfileModal'), { ssr: false });

interface HeaderProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  darkMode: boolean;
}

export default function Header({ userProfile, onUpdateProfile, darkMode }: HeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 p-2 rounded-xl">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              EduAgent
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Multi-Agent Educational Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {userProfile ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userProfile.major} • {userProfile.year}
                </p>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105 shadow-sm border border-gray-200 dark:border-gray-600"
                aria-label="Edit profile"
              >
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">Set Up Profile</span>
            </button>
          )}
        </div>
      </header>
      {showProfileModal && (
        <ProfileModal
          userProfile={userProfile}
          onSave={(profile) => {
            onUpdateProfile(profile);
            setShowProfileModal(false);
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}

