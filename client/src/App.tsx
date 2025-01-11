import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppProviders from "./context/AppProviders";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./layout/Layout";
import UnauthorizedPage from "./components/extra/Unauthorized";
import NotFoundPage from "./components/extra/NotFoundPage";
import Auth from "./layout/Auth";
import ConnectionsPage from "./pages/ConnectionsPage";
import HomePage from "./pages/HomePage";
import GetUserProfile from "./components/user/GetUserProfile";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./components/profile/EditProfile";
import Home from "./components/home/Home";
import RecommendationPage from "./pages/RecommendationPage";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/auth/login",
          element: (
            <PublicRoute>
              <Auth />
            </PublicRoute>
          ),
        },
        {
          path: "/auth/signup",
          element: (
            <PublicRoute>
              <Auth />
            </PublicRoute>
          ),
        },
        {
          path: "/",
          element: (
            <PublicRoute>
              <Home />
            </PublicRoute>
          ),
        },
        {
          path: "/home",
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/home/:userId",
          element: (
            <ProtectedRoute>
              <GetUserProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/connections",
          element: (
            <ProtectedRoute>
              <ConnectionsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/recommendations",
          element: (
            <ProtectedRoute>
              <RecommendationPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile/edit",
          element: (
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/unauthorized",
          element: <UnauthorizedPage />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
