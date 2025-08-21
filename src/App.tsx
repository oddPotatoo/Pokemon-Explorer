import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { useTheme } from './stores/theme';
import { useEffect } from 'react';
import Background from './components/common/Background';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;