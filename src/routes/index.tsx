import { Suspense, ComponentType } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes, adminRoutes } from "./createRoutes";
import { PrivateLayout } from "@/components/layout/PrivateLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoadingSpinner } from "@/ui-kit";
import NotFound from "@/pages/not-found/NotFound.tsx";

const PageLoader = () => <LoadingSpinner fullScreen text="Загрузка..." />;

// Обёртка для приватных маршрутов (если пользователь не авторизован, редирект на /login)
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    const isAuthenticated = true; // TODO: заменить на реальную проверку
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Универсальная функция рендеринга массива маршрутов
const renderRouteElements = (routes: typeof publicRoutes, isPrivate = false) => {
    // Сортируем: динамические пути (с :) идут в конец
    const sortedRoutes = [...routes].sort((a, b) => {
        const aDynamic = a.pathName.includes(":");
        const bDynamic = b.pathName.includes(":");
        return aDynamic === bDynamic ? 0 : aDynamic ? 1 : -1;
    });

    return sortedRoutes.map(({ pathName, Component }) => (
        <Route
            key={pathName}
            path={pathName}
            element={
                <Suspense fallback={<PageLoader />}>
                    {isPrivate ? <PrivateRoute element={<Component />} /> : <Component />}
                </Suspense>
            }
        />
    ));
};

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Публичные маршруты */}
            {renderRouteElements(publicRoutes)}

            {/* Приватные маршруты под PrivateLayout */}
            <Route element={<PrivateLayout />}>
                {renderRouteElements(privateRoutes, true)}
            </Route>

            {/* Админские маршруты под AdminLayout */}
            <Route path="/admin/*" element={<AdminLayout />}>
                {adminRoutes.map(({ pathName, Component }) => (
                    <Route
                        key={pathName}
                        path={pathName.replace(/^\/admin\//, "")} // относительный путь внутри /admin
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <Component />
                            </Suspense>
                        }
                    />
                ))}
            </Route>

            {/* Страница 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};


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
