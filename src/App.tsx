import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ArtisanLayout } from './layouts/ArtisanLayout';
import { BuyerLayout } from './layouts/BuyerLayout';

// Pages
import { Dashboard } from './pages/artisan/Dashboard';
import { AddProduct } from './pages/artisan/AddProduct';
import { MyCatalog } from './pages/artisan/MyCatalog';
import { Schemes } from './pages/artisan/Schemes';
import { WhatsAppDemo } from './pages/artisan/WhatsAppDemo';
import { ArtisanProfile } from './pages/artisan/Profile';
import { DiscoveryFeed } from './pages/buyer/DiscoveryFeed';
import { ProductDetails } from './pages/buyer/ProductDetails';
import { ArtisanStory } from './pages/buyer/ArtisanStory';
import { Cart } from './pages/buyer/Cart';
import { Checkout } from './pages/buyer/Checkout';
import { BuyerProfile } from './pages/buyer/Profile';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <Routes>
            {/* Buyer Mode (Default Demo Entry) */}
            <Route path="/" element={<BuyerLayout />}>
              <Route index element={<DiscoveryFeed />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="artisan/:id" element={<ArtisanStory />} />
              <Route path="cart" element={<Cart />} />
              <Route path="profile" element={<BuyerProfile />} />
            </Route>
            <Route path="/checkout" element={<Checkout />} />

            {/* Artisan Mode */}
            <Route path="/artisan" element={<ArtisanLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="add" element={<AddProduct />} />
              <Route path="products" element={<MyCatalog />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="whatsapp" element={<WhatsAppDemo />} />
              <Route path="profile" element={<ArtisanProfile />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
