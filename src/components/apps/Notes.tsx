'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaMarkdown, FaSave, FaEye, FaEdit, FaSearch, FaFolder, FaTags } from 'react-icons/fa';
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
  tags: ['welcome', 'tutorial']
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

  const deleteNote = async (id: string) => {
    if (!user || notes.length === 1 || id === defaultNote.id) return;

    try {
      await deleteDoc(doc(db, 'notes', id));
      setNotes(prev => prev.filter(note => note.id !== id));
      if (selectedNoteId === id) {
        const newSelectedNote = notes.find(note => note.id !== id) || notes[0];
        setSelectedNoteId(newSelectedNote.id);
        setEditContent(newSelectedNote.content);
      }
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
      <div className={`w-72 flex flex-col border-r ${theme === 'dark' ? 'border-white/10 bg-gray-900/50' : 'border-black/10 bg-white/50'} backdrop-blur-xl`}>
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
        <div className="flex-1 overflow-auto">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setEditContent(note.content);
                }}
                className={`w-full p-4 text-left border-b cursor-pointer ${
                  theme === 'dark' ? 'border-white/10' : 'border-black/10'
                } ${
                  selectedNoteId === note.id
                    ? theme === 'dark'
                      ? 'bg-white/20'
                      : 'bg-black/10'
                    : ''
                } hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'} transition-colors relative group`}
              >
                <h3 className="font-medium truncate pr-8">{note.title}</h3>
                <p className={`text-sm truncate ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                  {note.content.replace(/^#\s*[^\n]*\n?/, '').slice(0, 100)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
                    {note.lastModified.toLocaleDateString()}
                  </span>
                  {note.folder && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`}>
                      {note.folder}
                    </span>
                  )}
                </div>
                {notes.length > 1 && note.id !== defaultNote.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 rounded-full ${
                      theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
                    } transition-all`}
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className={`h-12 flex items-center justify-between px-4 border-b ${
          theme === 'dark' ? 'border-white/10' : 'border-black/10'
        }`}>
          <div className="flex items-center space-x-2">
            <FaMarkdown className={theme === 'dark' ? 'text-white/40' : 'text-black/40'} />
            <span className={`text-sm ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
              Markdown supported
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                  style={{ color: accentColor }}
                  title="Save (⌘S)"
                >
                  <FaSave />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                  style={{ color: accentColor }}
                  title="Preview (⌘E)"
                >
                  <FaEye />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                style={{ color: accentColor }}
                title="Edit (⌘E)"
              >
                <FaEdit />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={`w-full h-full p-6 resize-none focus:outline-none font-mono ${
                theme === 'dark'
                  ? 'bg-transparent text-white/90'
                  : 'bg-transparent text-black/90'
              }`}
              placeholder="Write your notes here... Markdown is supported!"
              style={{
                caretColor: accentColor,
              }}
            />
          ) : (
            <div className={`p-6 prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <ReactMarkdown>{currentNote?.content || ''}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}