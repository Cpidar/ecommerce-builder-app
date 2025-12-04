import type { PayloadRequest, PayloadResponse } from 'payload';
import { Endpoint } from 'payload/config';

export const snapshotEndpoint: Endpoint = {
    path: '/templates/:templateId/snapshot',
    method: 'get',
    handler: async (req: PayloadRequest, res: PayloadResponse) => {
        try {
            const templateId = req.params.templateId;
            // Find template by id or slug
            const template = await req.payload.findByID({
                collection: 'templates',
                id: templateId,
                depth: 0,
                overrideAccess: true,
            });

            if (!template) {
                return res.status(404).json({ error: 'Template not found' });
            }

            // fetch related components
            const comps = await req.payload.find({
                collection: 'templateComponents',
                where: { template: { equals: templateId } },
                limit: 1000,
                depth: 0,
            });

            // normalized component map
            const componentMap: Record<string, any> = {};
            for (const c of comps.docs) {
                componentMap[c.slug] = {
                    slug: c.slug,
                    props: c.props,
                    style: c.style,
                    responsive: c.responsive,
                    restricted: c.restricted ?? false,
                };
            }

            // produce snapshot shaped for storefront
            const snapshot = {
                templateId: templateId,
                version: template.updatedAt,
                snapshot: template.snapshot ?? template.snapshotData ?? {
                    components: componentMap,
                    defaults: template.defaults,
                    settings: template.settings,
                    assets: { images: template.images ?? [], fonts: template.fonts ?? [] }
                }
            };

            res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
            return res.status(200).json(snapshot);
        } catch (err) {
            console.error('snapshot endpoint error', err);
            return res.status(500).json({ error: 'internal error' });
        }
    }
};
