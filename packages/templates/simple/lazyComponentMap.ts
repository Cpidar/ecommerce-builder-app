export const lazyComponentMap: Record<string, () => Promise<any>> = {
    Hero: () => import('../components/Hero-Header-Sections/Hero1'),
    Footer: () => import('../components/Footers/Footer'),
    Page: () => import('../components/Page'),
    ProductGrid: () => import('../components/Product-List-Sections/ProductGrid'),
    Section: () => import('../components/Section'),
    Callout: () => import('../components/Callout')
}