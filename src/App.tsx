import {AppLayout} from "@/components/layout/AppLayout.tsx";
import {AppRoutes} from "@/routes";


const App = () => (
    <AppLayout>
        <AppRoutes />
    </AppLayout>

);

export default App;

// Lazy load all page components
// const Index = lazy(() => import("./pages/Index"));
// const BloggerProfile = lazy(() =>
//     import("./pages/profile/[username]/BloggerProfile.tsx").then((module) => ({
//         default: module.BloggerProfile,
//     })),
// );
// const ProfileEditor = lazy(() =>
//     import("./pages/profile/ProfileEditor.tsx").then((module) => ({
//         default: module.ProfileEditor,
//     })),
// );
// const Dashboard = lazy(() =>
//     import("./pages/dashboard/Dashboard.tsx").then((module) => ({default: module.Dashboard})),
// );
// const NotFound = lazy(() => import("./pages/NotFound.tsx"));
// const Login = lazy(() =>
//     import("./pages/auth/Login.tsx").then((module) => ({default: module.Login})),
// );
// const Register = lazy(() =>
//     import("./pages/auth/Register.tsx").then((module) => ({default: module.Register})),
// );
// const ForgotPassword = lazy(() =>
//     import("./pages/auth/ForgotPassword.tsx").then((module) => ({
//         default: module.ForgotPassword,
//     })),
// );
// const EmailConfirmation = lazy(() =>
//     import("./pages/auth/EmailConfirmation.tsx").then((module) => ({
//         default: module.EmailConfirmation,
//     })),
// );
// const ProfileSetup = lazy(() =>
//     import("./pages/profile/ProfileSetup.tsx").then((module) => ({
//         default: module.ProfileSetup,
//     })),
// );
// const DevTools = lazy(() =>
//     import("./pages/static/DevTools.tsx").then((module) => ({default: module.DevTools})),
// );
// const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
// const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
// const AdminTwoFactor = lazy(() => import("./pages/admin/AdminTwoFactor.tsx"));
// const AdminBloggerEditor = lazy(() => import("./pages/admin/blogger/[username]/AdminBloggerEditor.tsx"));
// const TermsOfService = lazy(() => import("./pages/static/TermsOfService.tsx"));
// const PrivacyPolicy = lazy(() => import("./pages/static/PrivacyPolicy.tsx"));
//
// const PageLoader = () => <LoadingSpinner fullScreen text="Загрузка..."/>;
// const App = () => (
//   <ErrorBoundary>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <BrowserRouter
//           future={{
//             v7_startTransition: true,
//             v7_relativeSplatPath: true,
//           }}
//         >
//           <AuthRedirectHandler />
//           <ProfileChecker>
//             <Suspense fallback={<PageLoader />}>
//               <Routes>
//                 <Route path="/" element={<Index />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/forgot-password" element={<ForgotPassword />} />
//                 <Route
//                   path="/email-confirmation"
//                   element={<EmailConfirmation />}
//                 />
//                 <Route
//                   path="/profile-setup"
//                   element={
//                     <ErrorBoundary>
//                       <ProtectedRoute>
//                         <Suspense fallback={<PageLoader />}>
//                           <ProfileSetup />
//                         </Suspense>
//                       </ProtectedRoute>
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route
//                   path="/dashboard"
//                   element={
//                     <ErrorBoundary>
//                       <ProtectedRoute>
//                         <Suspense fallback={<PageLoader />}>
//                           <Dashboard />
//                         </Suspense>
//                       </ProtectedRoute>
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route
//                   path="/profile/edit"
//                   element={
//                     <ErrorBoundary>
//                       <ProtectedRoute>
//                         <Suspense fallback={<PageLoader />}>
//                           <ProfileEditor />
//                         </Suspense>
//                       </ProtectedRoute>
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route path="/admin/login" element={<AdminLogin />} />
//                 <Route path="/admin/2fa" element={<AdminTwoFactor />} />
//                 <Route
//                   path="/admin/*"
//                   element={
//                     <ErrorBoundary>
//                       <AdminAuthProvider>
//                         <ProtectedRoute>
//                           <AdminRoutes />
//                         </ProtectedRoute>
//                       </AdminAuthProvider>
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route path="/:username" element={<BloggerProfile />} />
//                 <Route path="/dev-tools" element={<DevTools />} />
//                 <Route path="/terms" element={<TermsOfService />} />
//                 <Route path="/privacy" element={<PrivacyPolicy />} />
//                 {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </Suspense>
//           </ProfileChecker>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </ErrorBoundary>
// );