import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // Fetch todos on component mount
  useEffect(() => {
    axios.get('http://localhost:5001/api/todos')
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
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

  return (
    <div style={{ margin: '2rem' }}>
      <h1>My To-Do List</h1>
      <div>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;