import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { SnackbarProvider } from "notistack";

if (typeof window !== "undefined") {
  const fileBase =
    import.meta.env.VITE_FILE_BASE_URL || window.location.origin;
  const updatedBgUrl = `${fileBase}/public/StaticImages/updated_bg.webp`;
  document.documentElement.style.setProperty(
    "--updated-bg",
    `url(${updatedBgUrl})`
  );
}

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
    >
      <RouterProvider router={router} />
    </SnackbarProvider>
  </AuthProvider>
);
