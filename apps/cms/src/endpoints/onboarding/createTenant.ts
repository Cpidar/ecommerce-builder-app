import type { Endpoint } from 'payload/config';
import payload from 'payload';
import { seedTemplateForTenant } from '../../seeders/seedTemplateForTenant';

export const createTenantEndpoint: Endpoint = {
  path: '/onboarding/create',
  method: 'post',
  handler: async (req, res) => {
    try {
      const { name, slug, domain, ownerEmail, template } = req.body;

      if (!name || !slug || !template) {
        return res.status(400).json({ error: 'name, slug and template are required' });
      }

      // 1) Create tenant entry
      const tenant = await payload.create({
        collection: 'tenants',
        data: {
          name,
          slug,
          domain,
          ownerEmail,
          template,
          onboardingCompleted: false,
        },
        overrideAccess: true,
      });

      // 2) Seed tenant with template (async or sync)
      // run seeding synchronously so client can show progress; you can change to background job
      await seedTemplateForTenant({ tenantId: tenant.id, templateId: template, overwrite: false });

      // 3) Mark onboarding completed
      await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: { onboardingCompleted: true },
        overrideAccess: true,
      });

      return res.status(200).json({ ok: true, tenantId: tenant.id, tenantSlug: tenant.slug });
    } catch (err: any) {
      console.error('createTenantEndpoint error', err);
      return res.status(500).json({ error: err.message || 'internal error' });
    }
  }
};
