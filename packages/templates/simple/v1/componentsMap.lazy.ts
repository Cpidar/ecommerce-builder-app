export const lazyComponentMap: Record<string, () => Promise<any>> = {
    Hero: () => import('@repo/ui/components/Hero-Header-Sections/Hero1'),
    Footer: () => import('@repo/ui/components/Footers/Footer'),
    Page: () => import('@repo/ui/components/Page'),
    ProductGrid: () => import('@repo/ui/components/Product-List-Sections/ProductGrid'),
    Section: () => import('@repo/ui/components/Section'),
    Callout: () => import('@repo/ui/components/Callout')
}