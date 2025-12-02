'use client';

import { BookOpen, Code, ClipboardList, Briefcase, Moon, Sun, Sparkles } from 'lucide-react';

interface SidebarProps {
  selectedAgent: string | null;
  onSelectAgent: (agentId: string | null) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const agents = [
  {
    id: null,
    name: 'All Agents',
    icon: Sparkles,
    description: 'Let the system choose the best agent',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'academic-advisor',
    name: 'Academic Advisor',
    icon: BookOpen,
    description: 'Course guidance and degree planning',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'skill-roadmap',
    name: 'Skill Roadmap',
    icon: Code,
    description: 'Learning paths and skill development',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'assignment-helper',
    name: 'Assignment Helper',
    icon: ClipboardList,
    description: 'Homework and project assistance',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'career-guidance',
    name: 'Career Guidance',
    icon: Briefcase,
    description: 'Internships and career advice',
    color: 'from-indigo-500 to-purple-500',
  },
];

export default function Sidebar({ selectedAgent, onSelectAgent, darkMode, onToggleDarkMode }: SidebarProps) {
  return (
    <aside className="w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          AI Agents
        </h2>
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 transform hover:scale-105"
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
            </>
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-3">
        {agents.map(agent => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;
          
          return (
            <button
              key={agent.id || 'all'}
              onClick={() => onSelectAgent(agent.id)}
              className={`w-full text-left p-4 rounded-xl transition-all transform hover:scale-[1.02] relative overflow-hidden group ${
                isSelected
                  ? `bg-gradient-to-r ${agent.color} text-white shadow-xl border-2 border-white/30`
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg'
              }`}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              )}
              <div className="flex items-center space-x-3 relative z-10">
                {Icon && (
                  <div className={`p-2.5 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                      : `bg-gradient-to-br ${agent.color} opacity-80 group-hover:opacity-100`
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-white'}`} />
                  </div>
                )}
                <div className="flex-1">
                  <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {agent.name}
                  </div>
                  <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                    {agent.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

