import { lazy } from 'react'

export const createPathFromFile = (filePath: string) => {
    let routePath = filePath
        .replace(/^\/?src\/pages/, '')
        .replace(/\.tsx$/, '')
        .replace(/\/index$/, '')
        .replace(/\[(.+?)\]/g, ':$1')

    return routePath === '' ? '/' : routePath
}

export const createDynamicRoutes = (pageFiles: Record<string, any>) => {
    return Object.keys(pageFiles).map((filePath) => {
        const Component = lazy(pageFiles[filePath] as any)
        return {
            pathName: createPathFromFile(filePath),
            Component,
        }
    })
}
