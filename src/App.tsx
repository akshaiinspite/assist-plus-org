import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { QuotePage } from './pages/QuotePage';

export const App: React.FC = () => {
  return (
    <div className="app-container">
      <TopBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quote" element={<QuotePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
