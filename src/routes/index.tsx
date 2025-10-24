import React from "react";
import { Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes, adminRoutes } from "./createRoutes";
import { PrivateLayout } from "@/components/layout/PrivateLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoadingSpinner } from "@/ui-kit/components";
import NotFound from "@/pages/not-found/NotFound.tsx";

const PageLoader = () => <LoadingSpinner fullScreen text="Загрузка..." />;

// Разделяем открытые админские маршруты (login/2fa) и защищённые
const openAdminRoutes = adminRoutes.filter(
    (r) => r.pathName === "/admin/login" || r.pathName === "/admin/2fa"
);
const protectedAdminRoutes = adminRoutes.filter(
    (r) => r.pathName !== "/admin/login" && r.pathName !== "/admin/2fa"
);

export const AppRoutes = () => (
    <Routes>
        {/* Публичные страницы */}
        {publicRoutes.map(({ pathName, Component }) => (
            <Route key={pathName} path={pathName} element={<Component />} />
        ))}

        {/* Приватные страницы */}
        <Route element={<PrivateLayout />}>
            {privateRoutes.map(({ pathName, Component }) => (
                <Route key={pathName} path={pathName} element={<Component />} />
            ))}
        </Route>

        {/* Открытые админские страницы (login, 2fa) */}
        {openAdminRoutes.map(({ pathName, Component }) => (
            <Route key={pathName} path={pathName} element={<Component />} />
        ))}

        {/* Защищённые админские страницы */}
        <Route element={<AdminLayout />}>
            {protectedAdminRoutes.map(({ pathName, Component }) => {
                const isIndex = pathName === "/admin";

                return (
                    <Route
                        key={pathName}
                        index={isIndex}
                        path={pathName}
                        element={
                            <React.Suspense fallback={<PageLoader />}>
                                <Component />
                            </React.Suspense>
                        }
                    />
                );
            })}
        </Route>
        <Route path="*" element={<NotFound />} />
    </Routes>
);



// import { ComponentType, Suspense } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { publicRoutes, privateRoutes, adminRoutes } from "./createRoutes";
// import { PrivateLayout } from "@/components/layout/PrivateLayout";
// import { AdminLayout } from "@/components/layout/AdminLayout";
// import { LoadingSpinner } from "@/ui-kit";
// import NotFound from "@/pages/not-found/NotFound.tsx";
//
// const PageLoader = () => <LoadingSpinner fullScreen text="Загрузка..." />;
//
// const PrivateRoute = ({ element }: { element: JSX.Element }) => {
//     // TODO: заменить на реальную проверку авторизации
//     const isAuthenticated = true;
//     return isAuthenticated ? element : <Navigate to="/login" replace />;
// };
//
// const RenderRoutes = ({
//                           routes,
//                           layout: Layout,
//                           isPrivate = false,
//                       }: {
//     routes: typeof publicRoutes;
//     layout?: ComponentType;
//     isPrivate?: boolean;
// }) => {
//     // Сортируем: динамические пути (с :) идут в конец, чтобы не перекрывали статические
//     const sortedRoutes = [...routes].sort((a, b) => {
//         const aDynamic = a.pathName.includes(":");
//         const bDynamic = b.pathName.includes(":");
//         return aDynamic === bDynamic ? 0 : aDynamic ? 1 : -1;
//     });
//
//     const routeElements = sortedRoutes.map(({ pathName, Component }) => (
//         <Route
//             key={pathName}
//             path={pathName}
//             element={
//                 <Suspense fallback={<PageLoader />}>
//                     {isPrivate ? (
//                         <PrivateRoute element={<Component />} />
//                     ) : (
//                         <Component />
//                     )}
//                 </Suspense>
//             }
//         />
//     ));
//
//     if (Layout) {
//         return <Route element={<Layout />}>{routeElements}</Route>;
//     }
//
//     return routeElements;
// };
//
//
// export const AppRoutes = () => {
//     return (
//         <Routes>
//             {/* Публичные страницы */}
//             {RenderRoutes({ routes: publicRoutes })}
//
//             {/* Приватные страницы (под PrivateLayout) */}
//             {RenderRoutes({
//                 routes: privateRoutes,
//                 layout: PrivateLayout,
//                 isPrivate: true,
//             })}
//
//             {/* Админские страницы (под AdminLayout) */}
//             {RenderRoutes({ routes: adminRoutes, layout: AdminLayout })}
//
//             {/* Страница 404 */}
//             <Route path="*" element={<NotFound />} />
//         </Routes>
//     );
// };
