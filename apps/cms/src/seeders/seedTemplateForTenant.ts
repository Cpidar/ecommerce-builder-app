import payload from 'payload';
import { loadCompiledSnapshot } from '../utils/loadCompiledSnapshot';
import { transformCompiledToPayload } from '../utils/transformCompiledToPayload';

/**
 * Seed a tenant with a template snapshot.
 * - tenantId: ID of an existing tenant document in Payload (you can create tenant first)
 * - templateId: the template slug/id to seed
 * - overwrite: whether to remove existing pages/products for that tenant first
 */
export async function seedTemplateForTenant({ tenantId, templateId, overwrite = false }: { tenantId: string, templateId: string, overwrite?: boolean }) {
  // 1) Load compiled snapshot
  const snapshot = await loadCompiledSnapshot(templateId);

  // 2) Transform to payload payload-ready objects
  const { pages, products, templateSettings, templateComponents } = transformCompiledToPayload({ snapshot, tenantId });

  // 3) Optionally remove current tenant data
  if (overwrite) {
    // Use find & delete calls — be careful in prod
    await payload.delete({
      collection: 'pages',
      id: undefined,
      where: { tenant: { equals: tenantId } },
      overrideAccess: true,
    }).catch(() => {});
    await payload.delete({
      collection: 'products',
      id: undefined,
      where: { tenant: { equals: tenantId } },
      overrideAccess: true,
    }).catch(() => {});
  }

  // 4) Insert template components first (optional)
  for (const comp of templateComponents) {
    try {
      await payload.create({
        collection: 'templateComponents',
        data: { ...comp, template: templateId },
        overrideAccess: true,
      });
    } catch (e) {
      console.warn('templateComponents create failed', e);
    }
  }

  // 5) Insert products
  for (const prod of products) {
    try {
      await payload.create({
        collection: 'products',
        data: prod,
        overrideAccess: true,
      });
    } catch (e) { console.warn('product create failed', e); }
  }

  // 6) Insert pages
  for (const page of pages) {
    try {
      await payload.create({
        collection: 'pages',
        data: page,
        overrideAccess: true,
      });
    } catch (e) { console.warn('page create failed', e); }
  }

  // 7) Save template settings to tenant
  try {
    await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        template: templateId,
        templateVersion: snapshot.version,
        templateSettings
      },
      overrideAccess: true,
    });
  } catch (e) {
    console.warn('tenant update failed', e);
  }

  return { ok: true, pagesCreated: pages.length, productsCreated: products.length };
}
