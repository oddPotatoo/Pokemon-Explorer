import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { useTheme } from './stores/theme';
import { useEffect } from 'react';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;