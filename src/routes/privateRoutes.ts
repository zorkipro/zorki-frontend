import { createDynamicRoutes } from './createRoutes'

export const privateRoutes = createDynamicRoutes(
    import.meta.glob('/src/pages/(dashboard|profile)/**/*.tsx')
)
