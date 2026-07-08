import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ResultsPage from "./pages/ResultsPage";

function AppContent() {
  const navigate = useNavigate();

  const handleStartAnalysis = (wallet: string) => {
    // Navigate straight to results page for the input wallet
    navigate(`/results/${encodeURIComponent(wallet)}`);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] flex flex-col justify-between overflow-x-hidden grid-bg">
      {/* Visual Background Lighting Effects */}
      <div className="absolute top-0 left-0 right-0 h-[600px] radial-glow pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[400px] radial-glow-bottom pointer-events-none -z-10" />

      {/* Persistent App Navbar */}
      <Navbar />

      {/* Router Main Content Wrapper */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage onStartAnalysis={handleStartAnalysis} />} />
          <Route path="/results/:walletAddress" element={<ResultsPage />} />
          {/* Fallback back to landing */}
          <Route path="*" element={<LandingPage onStartAnalysis={handleStartAnalysis} />} />
        </Routes>
      </main>

      {/* Persistent App Footer */}
      <Footer />

      {/* Styled React Hot Toast notification system */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'glass-card border border-white/10 font-mono text-xs',
          style: {
            background: 'rgba(10, 10, 12, 0.9)',
            color: '#f3f4f6',
            backdropFilter: 'blur(10px)',
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
