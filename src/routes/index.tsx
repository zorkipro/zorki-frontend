import { ComponentType, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes, adminRoutes } from "./createRoutes";
import { PrivateLayout } from "@/components/layout/PrivateLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoadingSpinner } from "@/ui-kit";
import NotFound from "@/pages/not-found/NotFound.tsx";

// Загрузка страниц с fallback
const PageLoader = () => <LoadingSpinner fullScreen text="Загрузка..." />;

// ---------------------
// Приватный роут
// ---------------------
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    // TODO: заменить на реальную проверку
    // const isAuthenticated = true;
    // return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const RenderRoutes = ({
                          routes,
                          layout: Layout,
                          isPrivate = false,
                      }: {
    routes: typeof publicRoutes;
    layout?: ComponentType;
    isPrivate?: boolean;
}) => {
    // Сортировка: динамические пути в конец
    const sortedRoutes = [...routes].sort((a, b) => {
        const aDynamic = a.pathName.includes(':');
        const bDynamic = b.pathName.includes(':');
        return aDynamic === bDynamic ? 0 : aDynamic ? 1 : -1;
    });

    const routeElements = sortedRoutes.map(({ pathName, Component }) => (
        <Route
            key={pathName}
            path={pathName}
            element={<Component />}
        />
    ));

    if (Layout) {
        return <Route element={<Layout />}>{routeElements}</Route>;
    }

    return routeElements;
};

export const AppRoutes = () => {

    return (
        <Routes>
            {RenderRoutes({ routes: publicRoutes })}
            {RenderRoutes({ routes: privateRoutes, layout: PrivateLayout, isPrivate: true })}
            {RenderRoutes({ routes: adminRoutes, layout: AdminLayout })}
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>

    );
};
