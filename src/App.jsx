// @ts-nocheck

import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./pages/Footer";
import ContactUs from "./pages/ContactUs";
import Aboutus from "./pages/Aboutus";
import Latters from "./pages/letters/Letters";
import Homepage from "./pages/HomePage";
import Urduletter from "./pages/letters/Urduletter";
import Punjabiletter from "./pages/letters/Punjabiletter";
import PhotoGraph from "./pages/photographs/PhotoGraph";
import PhotoGraphDetail from "./pages/photographs/PhotoGraphDetail";
import ShopPage from "./pages/shop/ShopPage";
import LetterDetailPage from "./pages/letters/LetterDetailPage";
import Navbar from "./pages/Navbar";
import EnglishLetters from "./pages/letters/Englishletter";
import Featurelatter from "./pages/letters/Featurelatter";
import SubmissionForm from "./pages/submissionform/SubmissionForm";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/protected/ProtectedRoutes";
import LettersPage from "./pages/letters/Englishletter";
const Layout = () => {
  const location = useLocation();

  return (
    <>
      {/* ✅ Navbar sirf homepage "/" pe hide hoga */}
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<Aboutus />} />

        {/* Main Letters page */}
        <Route path="/letters" element={<Latters />} />

        {/* Sub routes with details */}
        {/* Generic language route */}
        <Route path="/letters/:lang" element={<LettersPage />} />
        <Route path="/letters/:lang/:id" element={<LetterDetailPage />} />

        {/* <Route path="/letters/urdu" element={<Urduletter />} />
        <Route path="/letters/urdu/:id" element={<LetterDetailPage />} />

        <Route path="/letters/punjabi" element={<Punjabiletter />} />
        <Route path="/letters/punjabi/:id" element={<LetterDetailPage />} /> */}

        <Route
          path="/photographs"
          element={<PhotoGraph title="Photographs" />}
        />
        <Route path="/PhotoGraphs/:id" element={<PhotoGraphDetail />} />
        <Route
          path="/featured"
          element={<Featurelatter title="Featured letters & Photographs" />}
        />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/submission"
          element={<SubmissionForm title="Submission" />}
        />
        <Route path="/shop" element={<ShopPage title="Shop" />} />
        <Route
          path="/admin-login"
          element={<AdminLogin title="Admin-Login" />}
        />
        <Route
          path="/admin-Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard title="Admin-Dashboard" />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ✅ Footer sirf homepage pe hide hoga */}
      {location.pathname !== "/" && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
