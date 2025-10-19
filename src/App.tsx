import { Suspense, lazy } from "react";
import { Toaster } from "@/ui-kit";
import { TooltipProvider } from "@/ui-kit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProfileChecker } from "./components/ProfileChecker";
import { AuthRedirectHandler } from "./components/AuthRedirectHandler";
import { AdminRoutes } from "./components/AdminRoutes";

// Lazy load all page components
const Index = lazy(() => import("./pages/Index"));
const BloggerProfile = lazy(() =>
  import("./pages/BloggerProfile").then((module) => ({
    default: module.BloggerProfile,
  })),
);
const ProfileEditor = lazy(() =>
  import("./pages/ProfileEditor").then((module) => ({
    default: module.ProfileEditor,
  })),
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard })),
);
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import("./pages/Register").then((module) => ({ default: module.Register })),
);
const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword").then((module) => ({
    default: module.ForgotPassword,
  })),
);
const EmailConfirmation = lazy(() =>
  import("./pages/EmailConfirmation").then((module) => ({
    default: module.EmailConfirmation,
  })),
);
const ProfileSetup = lazy(() =>
  import("./pages/ProfileSetup").then((module) => ({
    default: module.ProfileSetup,
  })),
);
const DevTools = lazy(() =>
  import("./pages/DevTools").then((module) => ({ default: module.DevTools })),
);
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminTwoFactor = lazy(() => import("./pages/AdminTwoFactor"));
const AdminBloggerEditor = lazy(() => import("./pages/AdminBloggerEditor"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Loading component for lazy routes
import { LoadingSpinner } from "@/ui-kit/components";

const PageLoader = () => <LoadingSpinner fullScreen text="Загрузка..." />;

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthRedirectHandler />
          <ProfileChecker>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/email-confirmation"
                  element={<EmailConfirmation />}
                />
                <Route
                  path="/profile-setup"
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <ProfileSetup />
                        </Suspense>
                      </ProtectedRoute>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <Dashboard />
                        </Suspense>
                      </ProtectedRoute>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <ProfileEditor />
                        </Suspense>
                      </ProtectedRoute>
                    </ErrorBoundary>
                  }
                />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/2fa" element={<AdminTwoFactor />} />
                <Route
                  path="/admin/*"
                  element={
                    <ErrorBoundary>
                      <AdminAuthProvider>
                        <ProtectedRoute>
                          <AdminRoutes />
                        </ProtectedRoute>
                      </AdminAuthProvider>
                    </ErrorBoundary>
                  }
                />
                <Route path="/:username" element={<BloggerProfile />} />
                <Route path="/dev-tools" element={<DevTools />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ProfileChecker>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
