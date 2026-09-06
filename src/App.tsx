import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { ArtisanLayout } from './layouts/ArtisanLayout';
import { BuyerLayout } from './layouts/BuyerLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
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
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-heritage-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-heritage-primary animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading KalaSetu...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          {/* Public: Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected: Buyer Mode */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <BuyerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DiscoveryFeed />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="artisan/:id" element={<ArtisanStory />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<BuyerProfile />} />
          </Route>
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Protected: Artisan Mode */}
          <Route
            path="/artisan"
            element={
              <ProtectedRoute>
                <ArtisanLayout />
              </ProtectedRoute>
            }
          >
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
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
