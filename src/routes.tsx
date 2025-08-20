import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import PokemonDetailPage from './pages/PokemonDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'pokemon/:id',
        element: <PokemonDetailPage />,
      },
    ],
  },
]);