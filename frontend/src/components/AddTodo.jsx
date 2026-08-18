import { useState } from 'react';
import todoApi from '../api/todoApi';

function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const newTodo = await todoApi.create({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      onAdd(newTodo);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isSubmitting}
        required
      />
      
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        disabled={isSubmitting}
      />
      
      <div className="form-actions">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        
        <button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}

export default AddTodo;