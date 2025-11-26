// src/routes/constants/paths.js
export const paths = {
  HOME: "/",
  ABOUT: "/about",
  LETTERS: "/letters",
  LETTER_LANG: "/letters/:lang",
  LETTER_DETAIL: "/letters/:lang/:id",
  PHOTOS: "/photographs",
  PHOTO_DETAIL: "/photographs/:id",
  FEATURED: "/featured",
  CONTACT: "/contact",
  SUBMISSION: "/submission",
  SHOP: "/shop",
  SHOP_DETAIL: "/shop/:productId",
  CART: "/cart",
  CHECKOUT: "/checkout",
  FORGOT: "/forgot-password",
  RESET: "/reset-password",

  // admin
  ADMIN: "/admin",
  ADMIN_LOGIN: "/admin-login",
  ADMIN_DASH: "/admin/dashboard",

  // old paths (we'll redirect these)
  ADMIN_LOGIN_OLD: "/admin-login",
  ADMIN_DASH_OLD: "/admin-Dashboard",
};
