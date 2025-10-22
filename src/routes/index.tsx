import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { publicRoutes } from './publicRoutes'
import { privateRoutes } from './privateRoutes'
import { adminRoutes } from './adminRoutes'
import AppMainLayout from '@/layouts/AppMainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import { PageLoader } from '@/components/PageLoader'
import { PageNotFound } from '@/components/PageNotFound'

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
    //todo заменить на реальную проверку
    const isAuthenticated = true
    return isAuthenticated ? element : <Navigate to="/login" replace />
}

export const AppRoutes = () => (
    <Suspense fallback={<PageLoader />}>
        <Routes>
            {/* Публичные страницы */}
            <Route element={<AppMainLayout />}>
                {publicRoutes.map(({ pathName, Component }) => (
                    <Route key={pathName} path={pathName} element={<Component />} />
                ))}
            </Route>

            {/* Приватные страницы */}
            <Route element={<AppMainLayout />}>
                {privateRoutes.map(({ pathName, Component }) => (
                    <Route
                        key={pathName}
                        path={pathName}
                        element={<PrivateRoute element={<Component />} />}
                    />
                ))}
            </Route>

            {/* Админские страницы */}
            <Route element={<AdminLayout />}>
                {adminRoutes.map(({ pathName, Component }) => (
                    <Route key={pathName} path={pathName} element={<Component />} />
                ))}
            </Route>

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    </Suspense>
)
