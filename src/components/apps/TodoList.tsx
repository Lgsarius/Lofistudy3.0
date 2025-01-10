import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, query, where } from 'firebase/firestore';
import { useAuthStore } from '@/lib/store/auth';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'todos'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData: Todo[] = [];
      snapshot.forEach((doc) => {
        todosData.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;

    try {
      await addDoc(collection(db, 'todos'), {
        text: newTodo,
        completed: false,
        userId: user.uid,
      });
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-md text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Todo List</h2>
      
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-white/10 focus:outline-none focus:border-white/20"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          <FaPlus />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-3 mb-2 rounded-lg bg-gray-800/30 border border-white/10"
          >
            <button
              onClick={() => toggleTodo(todo)}
              className={`p-2 rounded-lg transition-colors ${
                todo.completed ? 'bg-green-500/50' : 'bg-gray-700/50'
              }`}
            >
              <FaCheck className={todo.completed ? 'opacity-100' : 'opacity-30'} />
            </button>
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-white/50' : 'text-white'
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 