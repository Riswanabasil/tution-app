import { useParams } from 'react-router-dom';
import NotesTab from './NotesTab';
import { useState } from 'react';
import AssignmentTab from './AssignmentTab';
import VideosTab from './VideosTab';
import LiveTab from './LiveTab';

export default function TopicViewPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [activeTab, setActiveTab] = useState<'notes' | 'assignments' | 'videos' | 'live'>('notes');

  const tabs = [
    {
      id: 'notes' as const,
      label: 'Notes',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      description: 'Study materials and documents',
    },
    {
      id: 'assignments' as const,
      label: 'Assignments',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      description: 'Tasks and homework',
    },
    {
      id: 'videos' as const,
      label: 'Videos',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      description: 'Topic videos',
    },
    {
      id: 'live' as const,
      label: 'Live Sessions',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      description: 'Virtual classroom sessions',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-3xl font-bold text-transparent">
              Topic Overview
            </h2>
            <p className="mt-1 text-slate-500">Explore content, assignments, and live sessions</p>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-sm">
          <div className="p-2">
            <nav className="flex space-x-1" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex flex-1 items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'scale-[1.02] transform bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-800'
                  }`}
                >
                  <div
                    className={`transition-all duration-300 ${
                      activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    {tab.icon}
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-base font-semibold">{tab.label}</span>
                    <span
                      className={`text-xs transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'text-white/80'
                          : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    >
                      {tab.description}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 transform rounded-full bg-white shadow-lg"></div>
                  )}

                  {/* Hover effect overlay */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      activeTab !== tab.id
                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100'
                        : ''
                    }`}
                  ></div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-xl backdrop-blur-sm">
          {/* Tab content header with animation */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50/50 to-white/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 transition-all duration-300 ${
                  activeTab === 'notes'
                    ? 'bg-indigo-100 text-indigo-600'
                    : activeTab === 'assignments'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-purple-100 text-purple-600'
                }`}
              >
                {tabs.find((tab) => tab.id === activeTab)?.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h3>
                <p className="text-sm text-slate-500">
                  {tabs.find((tab) => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Content with fade-in animation */}
          <div className="p-6">
            <div className="animate-fadeIn">
              {activeTab === 'notes' && <NotesTab topicId={topicId!} />}
              {activeTab === 'assignments' && <AssignmentTab topicId={topicId!} />}
              {activeTab === 'videos' && <VideosTab topicId={topicId!} />}
              {activeTab === 'live' && <LiveTab topicId={topicId!} />
             
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
