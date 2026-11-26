import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { FeedbackBanner } from './components/FeedbackBanner';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LibraryProvider } from './context/LibraryContext';
import { BookDetailPage } from './pages/BookDetailPage';
import { CatalogPage } from './pages/CatalogPage';
import { DashboardPage } from './pages/DashboardPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoansPage } from './pages/LoansPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#18324B] flex flex-col lg:pl-64">
      <ScrollToTop />
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/libro/:id" element={<BookDetailPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/prestamos" element={<LoansPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>

      <Footer />
      <FeedbackBanner />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LibraryProvider>
        <AppLayout />
      </LibraryProvider>
    </BrowserRouter>
  );
}
