'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaMarkdown, FaSave, FaEye, FaEdit, FaSearch, FaFolder, FaCalendar } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useSettingsStore } from '@/lib/store/settings';
import { useAuthStore } from '@/lib/store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  folder?: string;
  tags?: string[];
  userId: string;
}

const defaultNote = {
  id: '1',
  title: 'Welcome to Notes! 📝',
  content: `# Welcome to Notes! 📝

This is your new markdown editor. Here's what you can do:

## Rich Text Features
- Write in **bold** or *italics*
- Create organized lists
- Add \`inline code\` or code blocks
- Create [links](https://example.com)
- Add > blockquotes
- And much more!

## Keyboard Shortcuts
- ⌘/Ctrl + S to save
- ⌘/Ctrl + E to toggle preview
- ⌘/Ctrl + N for new note
- ⌘/Ctrl + F to search

## Organization
- Create folders to organize notes
- Add tags for easy filtering
- Search across all your notes
- Sort by date or title

Start writing by clicking the + button or pressing ⌘/Ctrl + N!`,
  lastModified: new Date(),
  folder: 'Getting Started',
  tags: ['welcome', 'tutorial'],
  userId: ''
};

export function Notes() {
  const { theme, accentColor } = useSettingsStore();
  const { user } = useAuthStore();
  const [notes, setNotes] = useState<Note[]>([defaultNote]);
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editContent, setEditContent] = useState(notes[0].content);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const folders = Array.from(new Set(notes.map(note => note.folder).filter(Boolean)));

  // Load notes from Firebase
  useEffect(() => {
    const loadNotes = async () => {
      if (!user) return;
      
      try {
        const notesRef = collection(db, 'notes');
        const q = query(
          notesRef,
          where('userId', '==', user.uid),
          orderBy('lastModified', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const loadedNotes = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          lastModified: doc.data().lastModified.toDate(),
        })) as Note[];

        setNotes(loadedNotes.length > 0 ? loadedNotes : [defaultNote]);
        setSelectedNoteId(loadedNotes[0]?.id || defaultNote.id);
        setEditContent(loadedNotes[0]?.content || defaultNote.content);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const updatedNote = {
      content: editContent,
      title: editContent.split('\n')[0].replace(/^#*\s*/, '').slice(0, 40),
      lastModified: new Date(),
      userId: user.uid,
      folder: selectedFolder || undefined,
    };

    try {
      if (selectedNoteId === defaultNote.id) {
        // Create new note
        const docRef = await addDoc(collection(db, 'notes'), updatedNote);
        setNotes(prev => [{
          ...updatedNote,
          id: docRef.id,
          lastModified: new Date(),
        }, ...prev.filter(n => n.id !== defaultNote.id)]);
        setSelectedNoteId(docRef.id);
      } else {
        // Update existing note
        const noteRef = doc(db, 'notes', selectedNoteId);
        await updateDoc(noteRef, updatedNote);
        setNotes(prev => prev.map(note =>
          note.id === selectedNoteId
            ? { ...note, ...updatedNote }
            : note
        ));
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }

    setIsEditing(false);
  };

  const createNewNote = async () => {
    if (!user) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '# New Note',
      lastModified: new Date(),
      folder: selectedFolder || undefined,
      userId: user.uid,
    };

    try {
      const docRef = await addDoc(collection(db, 'notes'), newNote);
      const noteWithId = { ...newNote, id: docRef.id };
      setNotes(prev => [noteWithId, ...prev]);
      setSelectedNoteId(docRef.id);
      setEditContent(newNote.content);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id: string) => {
    if (!user || notes.length === 1 || id === defaultNote.id) return;

    try {
      await deleteDoc(doc(db, 'notes', id));
      setNotes(prev => prev.filter(note => note.id !== id));
      if (selectedNoteId === id) {
        const newSelectedNote = notes.find(note => note.id !== id) || notes[0];
        setSelectedNoteId(newSelectedNote.id);
        setEditContent(newSelectedNote.content);
      }
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const currentNote = notes.find((note) => note.id === selectedNoteId);
  const filteredNotes = notes.filter((note) =>
    (!selectedFolder || note.folder === selectedFolder) &&
    (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'e':
            e.preventDefault();
            setIsEditing(!isEditing);
            break;
          case 'n':
            e.preventDefault();
            createNewNote();
            break;
          case 'f':
            e.preventDefault();
            document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, editContent]);

  // Add click outside handler for calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className={`text-lg ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
          Loading notes...
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      {/* Sidebar */}
      <div className={`w-72 flex flex-col border-r ${theme === 'dark' ? 'border-white/10 bg-gray-900/50' : 'border-black/10 bg-white/50'} backdrop-blur-xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20`}>
        {/* Search and New Note */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <FaSearch className={`absolute left-3 top-2.5 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`} />
            <input
              type="text"
              placeholder="Search notes... (⌘F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-white/10 text-white placeholder-white/40'
                  : 'bg-black/5 text-black placeholder-black/40'
              } focus:outline-none focus:ring-2`}
              style={{ '--tw-ring-color': `${accentColor}40` } as any}
            />
          </div>
          <button
            onClick={createNewNote}
            className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors`}
            style={{ 
              backgroundColor: `${accentColor}20`,
              color: accentColor 
            }}
          >
            <FaPlus />
            <span>New Note (⌘N)</span>
          </button>
        </div>

        {/* Folders */}
        <div className={`px-2 py-3 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 ${
              !selectedFolder
                ? theme === 'dark'
                  ? 'bg-white/20'
                  : 'bg-black/10'
                : theme === 'dark'
                ? 'hover:bg-white/10'
                : 'hover:bg-black/5'
            } transition-colors`}
          >
            <FaFolder className={theme === 'dark' ? 'text-white/60' : 'text-black/60'} />
            <span>All Notes</span>
          </button>
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 ${
                selectedFolder === folder
                  ? theme === 'dark'
                    ? 'bg-white/20'
                    : 'bg-black/10'
                  : theme === 'dark'
                  ? 'hover:bg-white/10'
                  : 'hover:bg-black/5'
              } transition-colors`}
            >
              <FaFolder className={theme === 'dark' ? 'text-white/60' : 'text-black/60'} />
              <span>{folder}</span>
            </button>
          ))}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative group p-3 rounded-lg cursor-pointer transition-colors ${
                selectedNoteId === note.id
                  ? `bg-${accentColor}/20`
                  : theme === 'dark'
                  ? 'hover:bg-white/5'
                  : 'hover:bg-black/5'
              }`}
              onClick={() => {
                setSelectedNoteId(note.id);
                setEditContent(note.content);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <p className={`text-sm truncate ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                    {new Date(note.lastModified).toLocaleDateString()}
                  </p>
                </div>
                {note.id !== defaultNote.id && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                      theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                  >
                    <FaTrash className="w-4 h-4 text-red-500" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentNote && (
          <>
            <div className="p-4 border-b backdrop-blur-xl flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                        style={{ color: accentColor }}
                        title="Save (⌘S)"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                        style={{ color: accentColor }}
                        title="Preview (⌘E)"
                      >
                        <FaEye />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                      style={{ color: accentColor }}
                      title="Edit (⌘E)"
                    >
                      <FaEdit />
                    </button>
                  )}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                  <FaMarkdown className="inline-block mr-2" />
                  Markdown supported
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
                  }`}
                >
                  <FaCalendar className={theme === 'dark' ? 'text-white/60' : 'text-black/60'} />
                  <span>{new Date().toLocaleDateString()}</span>
                </button>

                {/* Calendar Popup */}
                {showCalendar && (
                  <motion.div
                    ref={calendarRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 top-full mt-2 p-4 rounded-xl shadow-xl z-50 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}
                    style={{ width: '300px' }}
                  >
                    <div className="grid grid-cols-7 gap-1">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div
                          key={day}
                          className={`text-center text-sm font-medium p-2 ${
                            theme === 'dark' ? 'text-white/60' : 'text-black/60'
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }, (_, i) => {
                        const date = new Date();
                        date.setDate(1);
                        const firstDay = date.getDay();
                        const currentDate = i - firstDay + 1;
                        const isCurrentMonth = currentDate > 0 && currentDate <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                        const isToday = currentDate === new Date().getDate() && isCurrentMonth;

                        return (
                          <div
                            key={i}
                            className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                              isCurrentMonth
                                ? isToday
                                  ? `bg-${accentColor} text-white`
                                  : theme === 'dark'
                                  ? 'text-white hover:bg-white/10'
                                  : 'text-black hover:bg-black/5'
                                : theme === 'dark'
                                ? 'text-white/20'
                                : 'text-black/20'
                            }`}
                          >
                            {isCurrentMonth ? currentDate : ''}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={`w-full h-full resize-none focus:outline-none ${
                    theme === 'dark' ? 'bg-transparent text-white' : 'bg-transparent text-black'
                  } [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20`}
                  style={{ height: 'calc(100vh - 12rem)' }}
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{currentNote.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl p-6 max-w-sm mx-4 shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-2">Delete Note</h3>
              <p className={`${theme === 'dark' ? 'text-white/60' : 'text-black/60'} mb-6`}>
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
                  }`}
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => showDeleteConfirm && confirmDelete(showDeleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}