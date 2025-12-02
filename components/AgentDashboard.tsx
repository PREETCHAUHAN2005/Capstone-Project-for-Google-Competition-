'use client';

import { useState, useEffect } from 'react';
import { Activity, MessageSquare, Clock, TrendingUp } from 'lucide-react';

interface AgentMetrics {
  agentId: string;
  messagesProcessed: number;
  averageResponseTime: number;
  toolsUsed: number;
  delegations: number;
  errors: number;
}

interface SystemMetrics {
  totalMessages: number;
  totalSessions: number;
  activeSessions: number;
  averageResponseTime: number;
  agentMetrics: AgentMetrics[];
  errorRate: number;
  uptime: number;
}

interface AgentDashboardProps {
  selectedAgent: string | null;
}

export default function AgentDashboard({ selectedAgent }: AgentDashboardProps) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-l border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-l border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No metrics available</p>
        </div>
      </div>
    );
  }

  const selectedAgentMetrics = selectedAgent
    ? metrics.agentMetrics.find(m => m.agentId === selectedAgent)
    : null;

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <div className="w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-l border-gray-200 dark:border-gray-700 overflow-y-auto shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-6">
          System Metrics
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-primary-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 bg-primary-500 rounded-lg">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Messages
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.totalMessages}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-green-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 bg-green-500 rounded-lg">
                  <Activity className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Sessions
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.activeSessions}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-blue-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 bg-blue-500 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Avg Response
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(metrics.averageResponseTime)}ms
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-purple-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 bg-purple-500 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Uptime
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatUptime(metrics.uptime)}
              </p>
            </div>
          </div>

          {selectedAgentMetrics && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Agent Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Messages Processed</span>
                  <span className="font-semibold text-gray-900 dark:text-white px-2 py-1 bg-primary-100 dark:bg-primary-900 rounded">
                    {selectedAgentMetrics.messagesProcessed}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Avg Response Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">
                    {Math.round(selectedAgentMetrics.averageResponseTime)}ms
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Tools Used</span>
                  <span className="font-semibold text-gray-900 dark:text-white px-2 py-1 bg-green-100 dark:bg-green-900 rounded">
                    {selectedAgentMetrics.toolsUsed}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Delegations</span>
                  <span className="font-semibold text-gray-900 dark:text-white px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded">
                    {selectedAgentMetrics.delegations}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Errors</span>
                  <span className="font-semibold text-red-600 dark:text-red-400 px-2 py-1 bg-red-100 dark:bg-red-900 rounded">
                    {selectedAgentMetrics.errors}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              All Agents
            </h3>
            <div className="space-y-2">
              {metrics.agentMetrics.map(agent => (
                <div
                  key={agent.agentId}
                  className={`p-3 rounded-xl transition-all ${
                    selectedAgent === agent.agentId
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-semibold ${selectedAgent === agent.agentId ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {agent.agentId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedAgent === agent.agentId 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {agent.messagesProcessed} msgs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

