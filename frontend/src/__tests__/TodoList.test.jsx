import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../components/TodoList';
import todoApi from '../api/todoApi';

// Mock the API
jest.mock('../api/todoApi');

describe('TodoList', () => {
  beforeEach(() => {
    todoApi.getAll.mockResolvedValue([
      { id: 1, title: 'Test Todo', completed: false, priority: 'medium', created_at: '2024-01-01' },
    ]);
  });

  test('renders todo list', async () => {
    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    render(<TodoList />);
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
  });

  test('renders filters', async () => {
    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText(/All/)).toBeInTheDocument();
      expect(screen.getByText(/Pending/)).toBeInTheDocument();
      expect(screen.getByText(/Completed/)).toBeInTheDocument();
    });
  });
});