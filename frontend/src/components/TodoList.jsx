import { useState, useEffect } from 'react';
import todoApi from '../api/todoApi';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await todoApi.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = (newTodo) => {
    setTodos([newTodo, ...todos]);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleToggle = (id) => {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleClearCompleted = async () => {
    try {
      await todoApi.clearCompleted();
      setTodos(todos.filter(t => !t.completed));
    } catch (error) {
      console.error('Error clearing completed:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  };

  if (loading) return <div className="loading">Loading todos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="todo-list-container">
      <h1>📋 Todo App</h1>
      
      <AddTodo onAdd={handleAdd} />
      
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All ({stats.total})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed ({stats.completed})
        </button>
      </div>
      
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <p className="empty-state">No todos found!</p>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))
        )}
      </div>
      
      {stats.completed > 0 && (
        <button onClick={handleClearCompleted} className="clear-completed-btn">
          Clear {stats.completed} completed todo(s)
        </button>
      )}
    </div>
  );
}

export default TodoList;