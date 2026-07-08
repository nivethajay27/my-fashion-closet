import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemsPage from './pages/ItemsPage';
import BuilderPage from './pages/BuilderPage';
import OutfitsPage from './pages/OutfitsPage'; 
import TodayPage from './pages/TodayPage';
import StyleGoalsPage from './pages/StyleGoalsPage';
import UploadItemPage from './pages/UploadItemPage';
import TripsPage from './pages/TripsPage';
import WishlistPage from './pages/WishlistPage';
import InspirationPage from './pages/InspirationPage';
import './styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/style-goals" element={<StyleGoalsPage />} />
        <Route path="/upload" element={<UploadItemPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/outfits" element={<OutfitsPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/inspiration" element={<InspirationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
