'use client';

import { useState } from 'react';
import { FaSearch, FaPlus, FaFolder, FaTrash, FaEdit, FaMarkdown, FaCalendar } from 'react-icons/fa';

export function NotesPreview() {
  const [selectedNote, setSelectedNote] = useState<'welcome' | 'math'>('welcome');

  return (
    <div className="h-full flex text-white">
      {/* Sidebar */}
      <div className="w-72 flex flex-col border-r border-white/10 bg-gray-900/50 backdrop-blur-xl">
        {/* Search and New Note */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-white/40" />
            <input
              type="text"
              placeholder="Search notes... (⌘F)"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 focus:outline-none"
            />
          </div>
          <button
            className="w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors bg-orange-500/20 text-orange-500"
          >
            <FaPlus />
            <span>New Note (⌘N)</span>
          </button>
        </div>

        {/* Folders */}
        <div className="px-2 py-3 border-t border-white/10">
          <button className="w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 bg-white/20">
            <FaFolder className="text-white/60" />
            <span>All Notes</span>
          </button>
          <button className="w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-white/10">
            <FaFolder className="text-white/60" />
            <span>Study</span>
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          <div 
            className={`p-3 rounded-lg ${selectedNote === 'welcome' ? 'bg-orange-500/20' : 'hover:bg-white/5'} cursor-pointer`}
            onClick={() => setSelectedNote('welcome')}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">Welcome to Notes! 📝</h3>
                <p className="text-sm truncate text-white/60">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div 
            className={`p-3 rounded-lg ${selectedNote === 'math' ? 'bg-orange-500/20' : 'hover:bg-white/5'} group cursor-pointer`}
            onClick={() => setSelectedNote('math')}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">Mathematics Notes</h3>
                <p className="text-sm truncate text-white/60">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <button 
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle delete
                }}
              >
                <FaTrash className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 backdrop-blur-xl flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-white/10 text-orange-500">
                <FaEdit />
              </button>
            </div>
            <div className="text-sm text-white/60">
              <FaMarkdown className="inline-block mr-2" />
              Markdown supported
            </div>
          </div>
          
          <div>
            <button className="px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-white/10">
              <FaCalendar className="text-white/60" />
              <span>{new Date().toLocaleDateString()}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-sm max-w-none">
            {selectedNote === 'welcome' ? (
              <>
                <h1>Welcome to Notes! 📝</h1>
                <p>This is your new markdown editor. Here's what you can do:</p>
                <h2>Rich Text Features</h2>
                <ul>
                  <li>Write in <strong>bold</strong> or <em>italics</em></li>
                  <li>Create organized lists</li>
                  <li>Add <code>inline code</code> or code blocks</li>
                  <li>And much more!</li>
                </ul>
              </>
            ) : (
              <>
                <h1>Mathematics Notes</h1>
                <p>Chapter 5: Understanding calculus fundamentals and derivatives.</p>
                <h2>Key Concepts</h2>
                <ul>
                  <li>Limits and continuity</li>
                  <li>Derivatives and their applications</li>
                  <li>Integration techniques</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 