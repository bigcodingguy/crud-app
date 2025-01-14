import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';  // Or your chosen logo
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch todos on component mount
  useEffect(() => {
    axios.get('http://localhost:5001/api/todos')
      .then(res => {
        setTodos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Create a new todo
  const addTodo = () => {
    if (!text.trim()) return;
    axios.post('http://localhost:5001/api/todos', { text })
      .then(res => {
        setTodos([...todos, res.data]);
        setText('');
      })
      .catch(err => console.error(err));
  };

  // Toggle completion
  const toggleComplete = (id, completed) => {
    axios.put(`http://localhost:5001/api/todos/${id}`, { completed: !completed })
      .then(res => {
        const updated = todos.map(t => t._id === id ? res.data : t);
        setTodos(updated);
      })
      .catch(err => console.error(err));
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5001/api/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(t => t._id !== id));
      })
      .catch(err => console.error(err));
  };

  // Handle Enter key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="app-container">
      {/* Banner/Header Section */}
      <header className="app-header">
        <div className="logo-container">
          <img src={logo} className="app-logo" alt="logo" />
          <h1 className="app-title">Blake's To-Do List</h1>
        </div>
      </header>

      {/* Main Section */}
      <main className="main-content">
        <div className="todo-input-section">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="New task..."
            className="todo-input"
          />
          <button onClick={addTodo} className="add-button">Add</button>
        </div>

        {/* Loading Spinner (if loading) */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        )}

        {/* To-Do List */}
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo._id} className="todo-item">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo._id, todo.completed)}
                />
              </div>
              <span
                className={`todo-text ${todo.completed ? 'completed' : ''}`}
              >
                {todo.text}
              </span>
              <button
                className="delete-button"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer Section */}
      <footer className="app-footer">
        <p>© 2025 Blake's To-Do App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;