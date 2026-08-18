import { useState } from 'react';
import todoApi from '../api/todoApi';

function TodoItem({ todo, onDelete, onToggle }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Delete this todo?')) {
      setIsDeleting(true);
      try {
        await todoApi.delete(todo.id);
        onDelete(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        setIsDeleting(false);
      }
    }
  };

  const handleToggle = async () => {
    try {
      await todoApi.toggle(todo.id, !todo.completed);
      onToggle(todo.id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const priorityClass = `priority-${todo.priority}`;

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${priorityClass}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <div className="todo-info">
          <h3>{todo.title}</h3>
          {todo.description && <p>{todo.description}</p>}
          <span className="todo-meta">
            <span className={`priority-badge ${priorityClass}`}>
              {todo.priority}
            </span>
            <span className="todo-date">
              {new Date(todo.created_at).toLocaleDateString()}
            </span>
          </span>
        </div>
      </div>
      <button 
        onClick={handleDelete} 
        className="delete-btn"
        disabled={isDeleting}
      >
        {isDeleting ? '...' : '×'}
      </button>
    </div>
  );
}

export default TodoItem;