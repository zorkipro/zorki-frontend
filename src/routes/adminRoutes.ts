import { createDynamicRoutes } from './createRoutes'

export const adminRoutes = createDynamicRoutes(
    import.meta.glob('/src/pages/admin/**/*.tsx')
)