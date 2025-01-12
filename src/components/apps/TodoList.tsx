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

export function TodoList() {
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
    <div className="h-full p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/90 mb-6">
          Todo List
        </h2>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6 mb-6">
          <form onSubmit={addTodo} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={!newTodo.trim()}
              className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Todo
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6 flex flex-col">
            <h3 className="text-lg md:text-xl font-semibold text-white/90 mb-4">
              Active
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {todos
                .filter((todo) => !todo.completed)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <button
                      onClick={() => toggleTodo(todo)}
                      className="w-5 h-5 rounded border border-white/20 flex items-center justify-center hover:border-orange-500 transition-colors"
                    >
                      <FaCheck className="w-3 h-3 text-transparent group-hover:text-orange-500" />
                    </button>
                    <span className="flex-1 text-white/90">{todo.text}</span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-white/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-white/90">
                Completed
              </h3>
              <button
                onClick={() => {
                  // Implement clear completed todos functionality
                }}
                className="text-sm text-white/60 hover:text-white/90 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {todos
                .filter((todo) => todo.completed)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <button
                      onClick={() => toggleTodo(todo)}
                      className="w-5 h-5 rounded border border-orange-500 flex items-center justify-center bg-orange-500"
                    >
                      <FaCheck className="w-3 h-3 text-white" />
                    </button>
                    <span className="flex-1 text-white/60 line-through">
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-white/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 