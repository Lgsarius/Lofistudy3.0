/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaMarkdown, FaSave, FaEye, FaEdit, FaSearch, FaFolder, FaCalendar, FaFileAlt, FaBars, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useSettingsStore } from '@/lib/store/settings';
import { useAuthStore } from '@/lib/store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, onSnapshot } from 'firebase/firestore';
import { MDXEditor } from '@mdxeditor/editor';
import rehypeSanitize from 'rehype-sanitize';

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
  id: 'default',
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
  const [selectedNoteId, setSelectedNoteId] = useState<string>(defaultNote.id);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editContent, setEditContent] = useState(notes[0].content);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const folders = Array.from(new Set(notes.map(note => note.folder).filter(Boolean)));

  // Load notes from Firebase with proper cleanup
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const loadNotes = async () => {
      if (!user) {
        setNotes([{ ...defaultNote, userId: '' }]);
        setIsLoading(false);
        return;
      }
      
      try {
        const notesRef = collection(db, 'notes');
        const q = query(
          notesRef,
          where('userId', '==', user.uid),
          orderBy('lastModified', 'desc')
        );
        
        // Set up real-time listener
        unsubscribe = onSnapshot(q, (snapshot) => {
          const loadedNotes = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            lastModified: doc.data().lastModified.toDate(),
          })) as Note[];

          if (loadedNotes.length === 0) {
            setNotes([{ ...defaultNote, userId: user.uid }]);
          } else {
            setNotes(loadedNotes);
          }
          
          // Update selected note if needed
          if (!selectedNoteId || !loadedNotes.find(note => note.id === selectedNoteId)) {
            const firstNoteId = loadedNotes[0]?.id || defaultNote.id;
            setSelectedNoteId(firstNoteId);
            setEditContent(loadedNotes[0]?.content || defaultNote.content);
          }
        }, (error) => {
          console.error('Error loading notes:', error);
          setNotes([{ ...defaultNote, userId: user.uid }]);
        });
      } catch (error) {
        console.error('Error setting up notes listener:', error);
        setNotes([{ ...defaultNote, userId: user.uid }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
        setSelectedNoteId(docRef.id);
      } else {
        // Update existing note
        const noteRef = doc(db, 'notes', selectedNoteId);
        await updateDoc(noteRef, updatedNote);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      // Show error to user
      alert('Failed to save note. Please try again.');
      return;
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
      setSelectedNoteId(docRef.id);
      setEditContent(newNote.content);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create new note. Please try again.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (id === defaultNote.id) return;
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id: string) => {
    if (!user || id === defaultNote.id) return;

    try {
      await deleteDoc(doc(db, 'notes', id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
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

  const handleCreateFolder = () => {
    // Implementation for creating a new folder
  };

  const handleCreateNote = () => {
    // Implementation for creating a new note
  };

  const handleTitleChange = (value: string) => {
    // Implementation for changing the note title
  };

  const handleContentChange = (value: string) => {
    // Implementation for changing the note content
  };

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
    <div className="h-full flex">
      {/* Sidebar */}
      <div className={`w-48 md:w-64 border-r border-white/10 flex flex-col ${
        showSidebar ? 'block' : 'hidden'
      } md:block`}>
        {/* Folders */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white/90">Folders</h3>
            <button
              onClick={handleCreateFolder}
              className="p-2 text-white/60 hover:text-white/90 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => folder && setSelectedFolder(folder)}
                className={`w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 ${
                  selectedFolder === folder
                    ? 'bg-orange-500 text-white'
                    : 'text-white/60 hover:bg-white/10'
                }`}
              >
                <FaFolder className="w-4 h-4" />
                <span className="truncate">{folder}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes List */}
        <div className="p-4 flex-1 overflow-y-auto border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white/90">Notes</h3>
            <button
              onClick={handleCreateNote}
              className="p-2 text-white/60 hover:text-white/90 transition-colors"
              disabled={!selectedFolder}
            >
              <FaPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {notes
              .filter((note) => note.folder === selectedFolder)
              .map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 ${
                    selectedNote?.id === note.id
                      ? 'bg-orange-500 text-white'
                      : 'text-white/60 hover:bg-white/10'
                  }`}
                >
                  <FaFileAlt className="w-4 h-4" />
                  <span className="truncate">{note.title}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 text-white/60 hover:text-white/90 transition-colors"
            >
              {showSidebar ? (
                <FaTimes className="w-4 h-4" />
              ) : (
                <FaBars className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              value={selectedNote?.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Note title"
              className="bg-transparent text-white/90 text-lg font-semibold placeholder-white/40 focus:outline-none"
              disabled={!selectedNote}
            />
          </div>
          {selectedNote && (
            <button
              onClick={() => handleDeleteNote(selectedNote.id)}
              className="p-2 text-white/60 hover:text-red-500 transition-colors"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedNote ? (
            <MDXEditor
              value={selectedNote.content}
              onChange={(value) => handleContentChange(value || '')}
              preview="edit"
              className="h-full bg-transparent"
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-white/40">
              Select a note to edit
            </div>
          )}
        </div>
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