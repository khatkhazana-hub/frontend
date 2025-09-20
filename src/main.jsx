import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { SnackbarProvider } from "notistack";

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
