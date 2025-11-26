// src/routes/publicRoutes.jsx
// @ts-nocheck
import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./constants/paths";

import Homepage from "@/pages/HomePage";
import Aboutus from "@/pages/Aboutus";
import Latters from "@/pages/letters/Letters";
import LettersPage from "@/pages/letters/Englishletter";
import LetterDetailPage from "@/pages/letters/LetterDetailPage";
import PhotoGraph from "@/pages/photographs/PhotoGraph";
import PhotoGraphDetail from "@/pages/photographs/PhotoGraphDetail";
import Featurelatter from "@/pages/letters/Featurelatter";
import ContactUs from "@/pages/ContactUs";
import SubmissionForm from "@/pages/submissionform/SubmissionForm";
import ShopPage from "@/pages/shop/ShopPage";
import ProductDetailPage from "@/pages/shop/ProductDetailPage";
import CartPage from "@/pages/shop/CartPage";
import CheckoutPage from "@/pages/shop/CheckoutPage";
import ForgotPassword from "@/pages/admin/ForgotPassword";
import ResetPassword from "@/pages/admin/ResetPassword";
import AdminLogin from "@/pages/admin/AdminLogin";
import Featuredletterandphotographs from "@/pages/Featuredletterandphotographs/Featuredletterandphotographs";

// Optional legacy aliases (keep old URLs working)
const legacyAliases = [
  { path: "/PhotoGraphs/:id", to: paths.PHOTO_DETAIL }, // old weird casing -> new
];

const publicRoutes = [
  { index: true, element: <Homepage /> },
  { path: paths.ABOUT, element: <Aboutus /> },
  { path: paths.LETTERS, element: <Latters /> },
  { path: paths.LETTER_LANG, element: <LettersPage /> },
  { path: paths.LETTER_DETAIL, element: <LetterDetailPage /> },
  { path: paths.PHOTOS, element: <PhotoGraph title="Photographs" /> },
  { path: paths.PHOTO_DETAIL, element: <PhotoGraphDetail /> },
  { path: paths.FEATURED, element: <Featuredletterandphotographs/> },
  { path: paths.CONTACT, element: <ContactUs /> },
  { path: paths.SUBMISSION, element: <SubmissionForm title="Submission" /> },
  // { path: paths.SHOP, element: <ShopPage title="Shop" /> },
  { path: paths.SHOP_DETAIL, element: <ProductDetailPage /> },
  { path: paths.CART, element: <CartPage /> },
  { path: paths.CHECKOUT, element: <CheckoutPage /> },
  { path: paths.FORGOT, element: <ForgotPassword /> },
  { path: paths.RESET, element: <ResetPassword /> },
  { path: paths.ADMIN_LOGIN, element: <AdminLogin /> },

  // legacy redirects
  ...legacyAliases.map((r) => ({ path: r.path, element: <Navigate to={r.to} replace /> })),
  { path: paths.ADMIN_LOGIN_OLD, element: <Navigate to={paths.ADMIN_LOGIN} replace /> },
  { path: paths.ADMIN_DASH_OLD, element: <Navigate to={paths.ADMIN_DASH} replace /> },
];

export default publicRoutes;
