import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import TodoList from './components/TodoList';
import Login from './components/Login';
import './App.css';

function AppContent() {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) return <div className="loading">Loading...</div>;
  
  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📋 My Todos</h1>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      <TodoList />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;