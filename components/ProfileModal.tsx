'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '@/lib/agents/types';

interface ProfileModalProps {
  userProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export default function ProfileModal({ userProfile, onSave, onClose }: ProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>({
    name: userProfile?.name || '',
    major: userProfile?.major || 'Computer Science',
    year: userProfile?.year || 'Freshman',
    interests: userProfile?.interests || [],
    goals: userProfile?.goals || [],
  });

  const [interestInput, setInterestInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const majors = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Software Engineering',
    'Data Science',
  ];

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

  const handleAddInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.trim()],
      });
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest),
    });
  };

  const handleAddGoal = () => {
    if (goalInput.trim() && !formData.goals.includes(goalInput.trim())) {
      setFormData({
        ...formData,
        goals: [...formData.goals, goalInput.trim()],
      });
      setGoalInput('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter(g => g !== goal),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Major
            </label>
            <select
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {majors.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interests
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add an interest"
              />
              <button
                onClick={handleAddInterest}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map(interest => (
                <span
                  key={interest}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                >
                  {interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goals
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add a goal"
              />
              <button
                onClick={handleAddGoal}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.goals.map(goal => (
                <span
                  key={goal}
                  className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                >
                  {goal}
                  <button
                    onClick={() => handleRemoveGoal(goal)}
                    className="ml-2 hover:text-green-600 dark:hover:text-green-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

