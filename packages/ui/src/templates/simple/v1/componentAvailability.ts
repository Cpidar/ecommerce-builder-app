// packages/template-packages/modern/v1/componentAvailability.ts
/**
 * Which components are exposed to the editor for this template version.
 * true = available, false = hidden / disabled
 */
export const componentAvailability: { [key: string]: boolean } = {
  Page: true,
  Hero: true,
  Section: true,
  ProductGrid: true,
  Callout: false, // not available in v1
  Footer: true
} as const;
