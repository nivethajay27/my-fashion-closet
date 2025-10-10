import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemsPage from './pages/ItemsPage';
import BuilderPage from './pages/BuilderPage';
import OutfitsPage from './pages/OutfitsPage'; 
import './styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/outfits" element={<OutfitsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
