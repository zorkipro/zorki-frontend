import { createDynamicRoutes } from './createRoutes'

export const publicRoutes = createDynamicRoutes(
    import.meta.glob('/src/pages/(index|auth|privacy-policy|terms-of-service|404).tsx')
)
