import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactComponent as TodoLogo } from './assets/todo-logo.svg';
import { ReactComponent as TrashIcon } from './assets/trash-icon.svg';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/todos');
      setTodos(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post('http://localhost:5001/api/todos', { text });
      setTodos([...todos, res.data]);
      setText('');
      setError(null);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error(err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/todos/${id}`, { completed: !completed });
      const updated = todos.map(t => t._id === id ? res.data : t);
      setTodos(updated);
      setError(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <TodoLogo className="app-logo" />
          <h1 className="app-title">Blake's Tasks</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="todo-input-section">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button onClick={addTodo} className="add-button">
            Add Task
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : (
          <div className="todo-list-container">
            {todos.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet. Add one above! 🚀</p>
              </div>
            ) : (
              <ul className="todo-list">
                {todos.map(todo => (
                  <li key={todo._id} className={`todo-item ${todo.completed ? 'completed-item' : ''}`}>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo._id, todo.completed)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                      {todo.text}
                    </span>
                    <button
                      className="delete-button"
                      onClick={() => deleteTodo(todo._id)}
                      aria-label="Delete task"
                    >
                      <TrashIcon />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Blake's Tasks • Made with ❤️</p>
      </footer>
    </div>
  );
}

export default App;